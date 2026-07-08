import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProposalCreateSchema, ProposalQuerySchema } from "@/lib/validations/proposal";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { serializeProposal } from "@/lib/serializers";
import {
  ok,
  created,
  badRequest,
  conflict,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

/**
 * GET /api/challenges/[id]/proposals
 * - Industry SPOC: see proposals for own challenge (student PII hidden)
 * - Admin: see all proposals for challenge
 * - Students: forbidden (use /api/proposals for own)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const { searchParams } = new URL(req.url);
    const queryParsed = ProposalQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
    });
    if (!queryParsed.success) return validationError(queryParsed.error.flatten());
    const { page, limit, status } = queryParsed.data;

    const role = session.user.role;
    const isAdmin = role === "SUPER_ADMIN" || role === "CII_ADMIN";
    const isIndustry = role === "INDUSTRY_SPOC";
    const isInstitutionSpoc = role === "INSTITUTION_SPOC";

    if (!isAdmin && !isIndustry && !isInstitutionSpoc) {
      return forbidden("Access denied");
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: { industryProfile: { select: { userId: true } } },
    });
    if (!challenge) return notFound("Challenge not found");

    // Industry SPOC can only see their own challenge's proposals
    if (isIndustry && challenge.industryProfile.userId !== session.user.id) {
      return forbidden("Access denied to this challenge's proposals");
    }

    const skip = (page - 1) * limit;
    const where = {
      challengeId: id,
      ...(status ? { status } : {}),
    };

    const [total, proposals] = await Promise.all([
      prisma.proposal.count({ where }),
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: "desc" },
        include: {
          studentProfile: {
            select: {
              userId: true,
              department: true,
              yearOfStudy: true,
              skills: true,
              institution: { select: { name: true, city: true } },
            },
          },
        },
      }),
    ]);

    const serialized = proposals.map((p) =>
      serializeProposal(p, role, session.user.id)
    );

    return ok({
      data: serialized,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/challenges/[id]/proposals]", err);
    return serverError();
  }
}

/**
 * POST /api/challenges/[id]/proposals
 * Student only — submit a proposal.
 * One proposal per student per challenge enforced by DB unique constraint.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();
    if (session.user.role !== "STUDENT") {
      return forbidden("Only students can submit proposals");
    }

    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return notFound("Challenge not found");
    if (challenge.status !== "OPEN") {
      return badRequest("This challenge is not open for submissions");
    }
    if (new Date() > challenge.deadline) {
      return badRequest("The deadline for this challenge has passed");
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!studentProfile) {
      return badRequest("Student profile not found — please complete registration");
    }

    // Check for duplicate
    const existing = await prisma.proposal.findUnique({
      where: {
        challengeId_studentProfileId: {
          challengeId: id,
          studentProfileId: studentProfile.id,
        },
      },
    });
    if (existing) {
      return conflict("You have already submitted a proposal for this challenge");
    }

    const body = await req.json();
    const parsed = ProposalCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const proposal = await prisma.proposal.create({
      data: {
        challengeId: id,
        studentProfileId: studentProfile.id,
        summary: parsed.data.summary,
        approachDoc: parsed.data.approachDoc,
        status: "SUBMITTED",
      },
    });

    // Get industry user via industry profile
    const industryProfile = await prisma.industryProfile.findUnique({
      where: { id: challenge.industryProfileId },
      select: { userId: true },
    });

    if (industryProfile) {
      await prisma.notification.create({
        data: {
          userId: industryProfile.userId,
          title: "New Proposal Received",
          body: `A new proposal has been submitted for your challenge: "${challenge.title}"`,
          link: `/api/challenges/${id}/proposals/${proposal.id}`,
        },
      });
    }

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "PROPOSAL_SUBMITTED",
      entityType: "Proposal",
      entityId: proposal.id,
      newValue: { challengeId: id, status: "SUBMITTED" },
      ipAddress,
      userAgent,
    });

    return created(proposal);
  } catch (err) {
    console.error("[POST /api/challenges/[id]/proposals]", err);
    return serverError();
  }
}
