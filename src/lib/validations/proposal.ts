import { z } from "zod";

export const ProposalCreateSchema = z.object({
  summary: z
    .string()
    .min(20, "Summary must be at least 20 characters")
    .max(500, "Summary must be 500 characters or fewer"),
  approachDoc: z.string().optional(), // file URL/key — populated after upload
});

export const ProposalStatusUpdateSchema = z.object({
  status: z.enum([
    "UNDER_REVIEW",
    "REVISION_REQUESTED",
    "APPROVED",
    "REJECTED",
  ]),
  revisionNotes: z.string().optional(),
  feedbackByIndustry: z.string().optional(),
});

export const ProposalQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  status: z
    .enum([
      "SUBMITTED",
      "UNDER_REVIEW",
      "REVISION_REQUESTED",
      "APPROVED",
      "REJECTED",
    ])
    .optional(),
});
