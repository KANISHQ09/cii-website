// Types and models representing our database schema

export type Role = 'SUPER_ADMIN' | 'CII_ADMIN' | 'INSTITUTION_SPOC' | 'INDUSTRY_SPOC' | 'STUDENT';

export type CellTheme = 
  | 'FAMILY_BUSINESS' 
  | 'TALENT_READINESS' 
  | 'RESEARCH_INNOVATION' 
  | 'AI_IN_BUSINESS' 
  | 'AGRITECH' 
  | 'SKILL_DEVELOPMENT' 
  | 'STARTUP';

export type ChallengeStatus = 'DRAFT' | 'OPEN' | 'UNDER_REVIEW' | 'CLOSED' | 'ARCHIVED';

export type ProposalStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'REJECTED';

export type MessageType = 'QUERY' | 'RESPONSE' | 'SYSTEM_NOTICE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  studentProfile?: StudentProfile;
  industryProfile?: IndustryProfile;
  institutionProfile?: InstitutionProfile;
}

export interface StudentProfile {
  enrollmentNo: string;
  institutionId: string;
  department: string;
  yearOfStudy: number;
  skills: string[];
}

export interface IndustryProfile {
  companyName: string;
  industry: string;
  logoUrl?: string;
  websiteUrl?: string;
  isCIIMember: boolean;
}

export interface InstitutionProfile {
  institutionId: string;
  designation: string;
  department: string;
}

export interface Institution {
  id: string;
  name: string;
  city: string;
  state: string;
  logoUrl?: string;
  websiteUrl?: string;
  cellTheme?: CellTheme;
}

export interface CellDetails {
  theme: CellTheme;
  name: string;
  hostName: string;
  hostId: string;
  colorName: string;
  primaryColor: string; // CSS hex/tailwind style
  accentColor: string;
  softColor: string;
  imagePath: string;
  tagline: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string; // HTML/Markdown
  problemStatement: string; // plain text summary
  domain: CellTheme;
  status: ChallengeStatus;
  deadline: string;
  budgetRange: string; // e.g. "₹50K - ₹2L" (hidden from students)
  industryProfileId: string; // companyName
  attachmentUrls: string[];
  tags: string[];
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
}

export interface Proposal {
  id: string;
  challengeId: string;
  studentProfileId: string; // Student User ID
  studentName: string; // Anonymized or actual based on role
  studentInstitution: string;
  status: ProposalStatus;
  approachDoc: string; // file name
  summary: string;
  revisionNotes?: string;
  feedbackByIndustry?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  proposalId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  body: string;
  attachmentUrl?: string;
  isSystemMsg: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── SEED DATA ───────────────────────────────────────────────────────────────

export const SEED_INSTITUTIONS: Institution[] = [
  { id: "inst-1", name: "Jagran Lakecity University", city: "Bhopal", state: "Madhya Pradesh", cellTheme: "FAMILY_BUSINESS" },
  { id: "inst-2", name: "Infotech Education Society University", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-3", name: "Career College", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-4", name: "Oriental Institute of Science & Technology", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-5", name: "Rabindranath Tagore University (RNTU)", city: "Bhopal", state: "Madhya Pradesh", cellTheme: "AGRITECH" },
  { id: "inst-6", name: "Centre for Research & Industrial Staff Performance (CRISP)", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-7", name: "Institute of Hotel Management (IHM)", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-8", name: "Institute of Professional Education & Research (IPER)", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-9", name: "Vidhyapeeth Group of Institutions", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-10", name: "Lakshmi Narain College of Technology", city: "Bhopal", state: "Madhya Pradesh", cellTheme: "TALENT_READINESS" },
  { id: "inst-11", name: "Indian Institute of Forest Management (IIFM)", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-12", name: "Madhyanchal Professional University", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-13", name: "Ravishankar Group of Institutes", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-14", name: "BSSS Institute of Advanced Studies", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-15", name: "National Institute of Design", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-16", name: "MK Ponda College of Business and Management", city: "Bhopal", state: "Madhya Pradesh" },
  { id: "inst-17", name: "LNCT University", city: "Bhopal", state: "Madhya Pradesh", cellTheme: "RESEARCH_INNOVATION" },
  { id: "inst-18", name: "Oriental Group of Institutes", city: "Bhopal", state: "Madhya Pradesh", cellTheme: "AI_IN_BUSINESS" },
  { id: "inst-19", name: "Scope Global Skills University", city: "Bhopal", state: "Madhya Pradesh", cellTheme: "SKILL_DEVELOPMENT" },
  { id: "inst-20", name: "Vikrant Institute", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-21", name: "GSITS", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-22", name: "IPS", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-23", name: "Jaipuria", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-24", name: "Symbiosis", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-25", name: "Acropolis Institute of Technology & Research", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-26", name: "Shri Vaishnav Vidyapeeth Vishwavidyalaya", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-27", name: "Indian Institute of Management (IIM)", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-28", name: "IPS Academy", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-29", name: "Prestige Institute of Management & Research", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-30", name: "Shri Vaishnav Institute of Management", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-31", name: "Symbiosis University of Applied Sciences", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-32", name: "Jaipuria Institute of Management", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-33", name: "Prestige Institute of Engineering Management & Research", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-34", name: "Indian Institute of Technology (IIT)", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-35", name: "IITI Drishti CPS Foundation", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-36", name: "Malwa Institute of Science & Technology", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-37", name: "Sage University", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-38", name: "Medi Caps University", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-39", name: "Daly College of Business Management", city: "Indore", state: "Madhya Pradesh" },
  { id: "inst-40", name: "GH Raisoni", city: "Borgaon", state: "Madhya Pradesh" }
];

export const SEED_CELLS: Record<CellTheme, CellDetails> = {
  FAMILY_BUSINESS: {
    theme: 'FAMILY_BUSINESS',
    name: 'Family Business & Entrepreneurship',
    hostName: 'Jagran Lakecity University, Bhopal',
    hostId: "inst-1",
    colorName: 'Navy Blue',
    primaryColor: '#1B3A6B',
    accentColor: '#D4A017',
    softColor: '#EBF0FA',
    imagePath: '/cells/1.jpg',
    tagline: 'Preserving Legacy. Fueling Growth.'
  },
  TALENT_READINESS: {
    theme: 'TALENT_READINESS',
    name: 'Talent Readiness & Employability',
    hostName: 'Lakshmi Narain College of Technology, Bhopal',
    hostId: "inst-10",
    colorName: 'Forest Green',
    primaryColor: '#1A5E3A',
    accentColor: '#F5A623',
    softColor: '#EAF5EE',
    imagePath: '/cells/2.jpg',
    tagline: 'Bridging Skills. Shaping Professionals.'
  },
  RESEARCH_INNOVATION: {
    theme: 'RESEARCH_INNOVATION',
    name: 'Research & Innovation',
    hostName: 'LNCT University, Bhopal',
    hostId: "inst-17",
    colorName: 'Deep Purple',
    primaryColor: '#3D1A78',
    accentColor: '#D4A017',
    softColor: '#F0EAF9',
    imagePath: '/cells/3.jpg',
    tagline: 'Inquiring Minds. Breakthrough Discoveries.'
  },
  AI_IN_BUSINESS: {
    theme: 'AI_IN_BUSINESS',
    name: 'AI in Business',
    hostName: 'Oriental Group of Institutes, Bhopal',
    hostId: "inst-18",
    colorName: 'Burnt Orange',
    primaryColor: '#C0390A',
    accentColor: '#D4A017',
    softColor: '#FDF0EB',
    imagePath: '/cells/4.jpg',
    tagline: 'Intelligent Enterprise. Smart Ecosystems.'
  },
  AGRITECH: {
    theme: 'AGRITECH',
    name: 'AgriTech',
    hostName: 'Rabindranath Tagore University (RNTU), Bhopal',
    hostId: "inst-5",
    colorName: 'Earth Green',
    primaryColor: '#2E6B35',
    accentColor: '#8BC34A',
    softColor: '#EBF5EC',
    imagePath: '/cells/5.jpg',
    tagline: 'Sustainable Farming. Tech-Driven Yields.'
  },
  SKILL_DEVELOPMENT: {
    theme: 'SKILL_DEVELOPMENT',
    name: 'Skill Development',
    hostName: 'Scope Global Skills University, Bhopal',
    hostId: "inst-19",
    colorName: 'Royal Blue + Gold',
    primaryColor: '#1B3A6B',
    accentColor: '#D4A017',
    softColor: '#EBF0FA',
    imagePath: '/cells/6.jpg',
    tagline: 'Hands-on Learning. Global Capabilities.'
  },
  STARTUP: {
    theme: 'STARTUP',
    name: 'Startup Cell',
    hostName: 'Rabindranath Tagore University (RNTU), Bhopal',
    hostId: "inst-5",
    colorName: 'Navy + Red',
    primaryColor: '#0D1B2A',
    accentColor: '#E63B2E',
    softColor: '#FAEBEA',
    imagePath: '/cells/7.jpg',
    tagline: 'Ideate. Incubate. Scale.'
  }
};

export const SEED_USERS: User[] = [
  {
    id: "user-admin",
    email: "admin@ciisic.in",
    name: "CII Super Admin",
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "user-student",
    email: "student@lnct.ac.in",
    name: "Priya Sharma",
    role: "STUDENT",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    isActive: true,
    createdAt: new Date().toISOString(),
    studentProfile: {
      enrollmentNo: "LNCT/CS/2023/128",
      institutionId: "inst-10",
      department: "Computer Science & Engineering",
      yearOfStudy: 3,
      skills: ["React", "Python", "Data Analysis", "TypeScript", "Machine Learning"]
    }
  },
  {
    id: "user-industry",
    email: "spoc@netlink.com",
    name: "Rajesh Kulkarni",
    role: "INDUSTRY_SPOC",
    isActive: true,
    createdAt: new Date().toISOString(),
    industryProfile: {
      companyName: "Netlink Business Solutions",
      industry: "Information Technology",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
      websiteUrl: "https://netlink.com",
      isCIIMember: true
    }
  },
  {
    id: "user-industry2",
    email: "spoc@dilipbuildcon.co.in",
    name: "Vijay Singh",
    role: "INDUSTRY_SPOC",
    isActive: true,
    createdAt: new Date().toISOString(),
    industryProfile: {
      companyName: "Dilip Buildcon Ltd.",
      industry: "Infrastructure & Construction",
      logoUrl: "https://images.unsplash.com/photo-1590650154751-1018a6301f4e?w=150",
      websiteUrl: "https://dilipbuildcon.com",
      isCIIMember: true
    }
  },
  {
    id: "user-spoc",
    email: "spoc@lnct.ac.in",
    name: "Dr. Amit Bansal",
    role: "INSTITUTION_SPOC",
    isActive: true,
    createdAt: new Date().toISOString(),
    institutionProfile: {
      institutionId: "inst-10",
      designation: "Head of Department (HOD)",
      department: "Computer Science & Engineering"
    }
  }
];

export const SEED_CHALLENGES: Challenge[] = [
  {
    id: "chal-1",
    title: "AI-Powered Crop Disease Diagnosis",
    description: "<h3>Context & Objective</h3><p>Madhya Pradesh is a major agricultural hub, yet smallholder farmers lose over 25% of crops annually to pests and diseases that are misdiagnosed or detected too late. We want to design a lightweight AI model that can work on low-end smartphones without internet access to classify soy crop leaf diseases via photos.</p><h3>What we are looking for:</h3><ul><li>A compression framework for MobileNet or similar models.</li><li>An intuitive offline-first workflow.</li><li>Actionable biological remedies in Hindi language.</li></ul>",
    problemStatement: "Develop an offline-first mobile AI application to identify soybean crop leaf diseases using images and suggest organic remedies in Hindi.",
    domain: "AGRITECH",
    status: "OPEN",
    deadline: "2026-08-30T18:00:00.000Z",
    budgetRange: "₹2L - ₹5L",
    industryProfileId: "Netlink Business Solutions",
    attachmentUrls: ["crop_disease_dataset_spec.pdf", "mp_agri_remuneration_guide.docx"],
    tags: ["Machine Learning", "Offline AI", "AgriTech", "Hindi UI"],
    viewCount: 145,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  },
  {
    id: "chal-2",
    title: "Credit Scoring Engine for Micro-Businesses",
    description: "<h3>Context & Objective</h3><p>Traditional credit scoring models rely heavily on formal banking histories, which many rural micro-entrepreneurs in MP lack. We want a machine learning model that parses alternative data (e.g., utility bills, digital transactions, shop inventory records) to score and qualify family-owned retail shops for micro-loans.</p><h3>Scope:</h3><ul><li>Design a data model parsing transactional text messages.</li><li>Verify privacy and security of retail client details.</li><li>A clean dashboard displaying credit scores with reliability indices.</li></ul>",
    problemStatement: "Build an alternative credit scoring engine for small family business stores in Madhya Pradesh using alternative transactional data.",
    domain: "AI_IN_BUSINESS",
    status: "OPEN",
    deadline: "2026-07-25T18:00:00.000Z",
    budgetRange: "₹3L - ₹6L",
    industryProfileId: "Netlink Business Solutions",
    attachmentUrls: ["alternative_credit_spec.pdf"],
    tags: ["FinTech", "AI", "Credit Scoring", "Data Analytics"],
    viewCount: 210,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  },
  {
    id: "chal-3",
    title: "Succession Framework for Retail Family Businesses",
    description: "<h3>Problem</h3><p>Over 70% of family-owned retail businesses in MP shut down when transitioning to the next generation due to poor planning, lack of governance, or clash of business visions. We need a digital diagnostic tool and succession roadmap builder specifically tailored for multi-generational retail enterprises in MP.</p>",
    problemStatement: "Create an interactive digital tool that diagnoses family business governance structures and generates a succession readiness report.",
    domain: "FAMILY_BUSINESS",
    status: "OPEN",
    deadline: "2026-09-15T18:00:00.000Z",
    budgetRange: "₹1L - ₹2.5L",
    industryProfileId: "Dilip Buildcon Ltd.",
    attachmentUrls: ["family_business_standards.pdf"],
    tags: ["Business Strategy", "Governance", "Family Business", "Consulting Tool"],
    viewCount: 88,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  },
  {
    id: "chal-4",
    title: "Eco-Friendly Biomass Water Filter",
    description: "<h3>Challenge Statement</h3><p>We are seeking innovative materials engineering to design a low-cost, gravity-fed water filtration cartridge utilizing local agricultural waste products (e.g., coconut husks, rice husks, local MP clay) that can filter out heavy metals and pesticide runoffs in rural tube wells.</p>",
    problemStatement: "Design a domestic water filtration system using localized biological filter media for tube well water purification.",
    domain: "RESEARCH_INNOVATION",
    status: "OPEN",
    deadline: "2026-08-10T18:00:00.000Z",
    budgetRange: "₹1.5L - ₹3L",
    industryProfileId: "Dilip Buildcon Ltd.",
    attachmentUrls: [],
    tags: ["Biotech", "Research", "Water Filtration", "Material Science"],
    viewCount: 102,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
];

// ─── DB ENGINE CLASS ─────────────────────────────────────────────────────────

class MockDatabase {
  private isBrowser = typeof window !== 'undefined';

  constructor() {
    this.init();
  }

  private init() {
    if (!this.isBrowser) return;

    if (!localStorage.getItem('ciisic_users')) {
      localStorage.setItem('ciisic_users', JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem('ciisic_institutions')) {
      localStorage.setItem('ciisic_institutions', JSON.stringify(SEED_INSTITUTIONS));
    }
    if (!localStorage.getItem('ciisic_challenges')) {
      localStorage.setItem('ciisic_challenges', JSON.stringify(SEED_CHALLENGES));
    }
    if (!localStorage.getItem('ciisic_proposals')) {
      localStorage.setItem('ciisic_proposals', JSON.stringify([]));
    }
    if (!localStorage.getItem('ciisic_messages')) {
      localStorage.setItem('ciisic_messages', JSON.stringify([]));
    }
    if (!localStorage.getItem('ciisic_audit_logs')) {
      localStorage.setItem('ciisic_audit_logs', JSON.stringify([]));
    }
    if (!localStorage.getItem('ciisic_notifications')) {
      localStorage.setItem('ciisic_notifications', JSON.stringify([]));
    }
    // Set default session role
    if (!localStorage.getItem('ciisic_session_user')) {
      localStorage.setItem('ciisic_session_user', JSON.stringify(SEED_USERS[1])); // Default to Priya (Student)
    }
  }

  // Generic Getters/Setters
  private get<T>(key: string): T[] {
    if (!this.isBrowser) return [];
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  }

  private set<T>(key: string, data: T[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Session Management ---
  getCurrentUser(): User {
    if (!this.isBrowser) return SEED_USERS[1];
    const user = localStorage.getItem('ciisic_session_user');
    return user ? JSON.parse(user) : SEED_USERS[1];
  }

  setCurrentUser(user: User): void {
    if (!this.isBrowser) return;
    localStorage.setItem('ciisic_session_user', JSON.stringify(user));
    this.addAuditLog(user.id, `User logged in / switched role to ${user.role}`, 'User', user.id);
  }

  // --- Users ---
  getUsers(): User[] {
    return this.get<User>('ciisic_users');
  }

  addUser(email: string, name: string, role: Role, profileData: any): User | null {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return null;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    if (role === 'STUDENT') {
      newUser.studentProfile = {
        enrollmentNo: profileData.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
        institutionId: profileData.institutionId || 'inst-10',
        department: profileData.department || 'General',
        yearOfStudy: profileData.yearOfStudy || 1,
        skills: profileData.skills || []
      };
    } else if (role === 'INDUSTRY_SPOC') {
      newUser.industryProfile = {
        companyName: profileData.companyName || 'New Company',
        industry: profileData.industry || 'General',
        websiteUrl: profileData.websiteUrl || '',
        isCIIMember: profileData.isCIIMember || false
      };
    } else if (role === 'INSTITUTION_SPOC') {
      newUser.institutionProfile = {
        institutionId: profileData.institutionId || 'inst-1',
        designation: profileData.designation || 'Professor',
        department: profileData.department || 'General'
      };
    }

    users.push(newUser);
    this.set('ciisic_users', users);
    
    this.addAuditLog(newUser.id, `New user registered with role ${role}`, 'User', newUser.id);
    return newUser;
  }

  // --- Institutions ---
  getInstitutions(): Institution[] {
    return this.get<Institution>('ciisic_institutions');
  }

  addInstitution(name: string, city: string, cellTheme?: CellTheme): Institution {
    const insts = this.getInstitutions();
    const newInst: Institution = {
      id: `inst-${Date.now()}`,
      name,
      city,
      state: 'Madhya Pradesh',
      cellTheme
    };
    insts.push(newInst);
    this.set('ciisic_institutions', insts);
    return newInst;
  }

  // --- Challenges ---
  getChallenges(): Challenge[] {
    return this.get<Challenge>('ciisic_challenges');
  }

  getChallengeById(id: string): Challenge | undefined {
    return this.getChallenges().find(c => c.id === id);
  }

  addChallenge(title: string, problemStatement: string, description: string, domain: CellTheme, deadline: string, budgetRange: string, tags: string[], industryName: string): Challenge {
    const challenges = this.getChallenges();
    const newChallenge: Challenge = {
      id: `chal-${Date.now()}`,
      title,
      problemStatement,
      description,
      domain,
      status: 'OPEN',
      deadline,
      budgetRange,
      industryProfileId: industryName,
      attachmentUrls: [],
      tags,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    challenges.unshift(newChallenge);
    this.set('ciisic_challenges', challenges);

    const currentUser = this.getCurrentUser();
    this.addAuditLog(currentUser.id, `Created challenge: ${title}`, 'Challenge', newChallenge.id);

    // Trigger Notification for Students
    const users = this.getUsers();
    users.filter(u => u.role === 'STUDENT').forEach(st => {
      this.triggerNotification(
        st.id, 
        `New Challenge in ${SEED_CELLS[domain].name}`, 
        `"${title}" has been posted by ${industryName}. Apply before deadline!`,
        `/challenges/${newChallenge.id}`
      );
    });

    return newChallenge;
  }

  incrementViewCount(id: string): void {
    const chals = this.getChallenges();
    const chal = chals.find(c => c.id === id);
    if (chal) {
      chal.viewCount += 1;
      this.set('ciisic_challenges', chals);
    }
  }

  // --- Proposals ---
  getProposals(): Proposal[] {
    return this.get<Proposal>('ciisic_proposals');
  }

  getProposalById(id: string): Proposal | undefined {
    return this.getProposals().find(p => p.id === id);
  }

  submitProposal(challengeId: string, summary: string, approachDoc: string): Proposal {
    const proposals = this.getProposals();
    const currentUser = this.getCurrentUser();
    
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      challengeId,
      studentProfileId: currentUser.id,
      studentName: currentUser.name,
      studentInstitution: this.getInstitutions().find(inst => inst.id === currentUser.studentProfile?.institutionId)?.name || 'LNCT',
      status: 'SUBMITTED',
      approachDoc,
      summary,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    proposals.push(newProposal);
    this.set('ciisic_proposals', proposals);

    // Logs
    this.addAuditLog(currentUser.id, `Submitted proposal for challenge ${challengeId}`, 'Proposal', newProposal.id);

    // Create system message inside proposal thread
    this.addMessage(newProposal.id, 'system', `Proposal submitted by Student.`, true);

    // Notify Industry SPOC
    const chal = this.getChallengeById(challengeId);
    if (chal) {
      const users = this.getUsers();
      // Notify industry users who match the poster
      users.filter(u => u.role === 'INDUSTRY_SPOC' && u.industryProfile?.companyName === chal.industryProfileId).forEach(indUser => {
        this.triggerNotification(
          indUser.id,
          'New Proposal Received',
          `An anonymized student proposal was received for your challenge: "${chal.title}".`,
          `/dashboard/industry/challenges/${chal.id}/proposals/${newProposal.id}`
        );
      });
    }

    return newProposal;
  }

  updateProposalStatus(id: string, status: ProposalStatus, feedback?: string, revisionNotes?: string): void {
    const props = this.getProposals();
    const prop = props.find(p => p.id === id);
    if (!prop) return;

    const oldStatus = prop.status;
    prop.status = status;
    prop.updatedAt = new Date().toISOString();
    if (feedback) prop.feedbackByIndustry = feedback;
    if (revisionNotes) prop.revisionNotes = revisionNotes;

    this.set('ciisic_proposals', props);

    const currentUser = this.getCurrentUser();
    this.addAuditLog(currentUser.id, `Updated proposal ${id} status from ${oldStatus} to ${status}`, 'Proposal', id);
    
    // Add system message to the chat
    this.addMessage(id, 'system', `Proposal status changed to ${status.replace('_', ' ')}.`, true);

    // Notify Student
    this.triggerNotification(
      prop.studentProfileId,
      `Proposal Status Update`,
      `Your proposal for "${this.getChallengeById(prop.challengeId)?.title}" was updated to ${status.replace('_', ' ')}.`,
      `/dashboard/student/proposals/${prop.id}`
    );

    // If approved, notify Institution SPOC
    if (status === 'APPROVED') {
      const studentUser = this.getUsers().find(u => u.id === prop.studentProfileId);
      const studentInstId = studentUser?.studentProfile?.institutionId;
      if (studentInstId) {
        const users = this.getUsers();
        users.filter(u => u.role === 'INSTITUTION_SPOC' && u.institutionProfile?.institutionId === studentInstId).forEach(spoc => {
          this.triggerNotification(
            spoc.id,
            `Student Solution Approved!`,
            `A student from your institution (${studentUser.name}) had their proposal approved for: "${this.getChallengeById(prop.challengeId)?.title}".`,
            `/dashboard/institution`
          );
        });
      }
    }
  }

  // --- Messages / Chat ---
  getMessages(proposalId: string): Message[] {
    return this.get<Message>('ciisic_messages').filter(m => m.proposalId === proposalId);
  }

  addMessage(proposalId: string, senderId: string, body: string, isSystem: boolean = false, attachmentUrl?: string): Message {
    const messages = this.get<Message>('ciisic_messages');
    
    let senderName = 'System';
    let senderRole: Role = 'CII_ADMIN';

    if (senderId !== 'system') {
      const sender = this.getUsers().find(u => u.id === senderId);
      if (sender) {
        senderName = sender.name;
        senderRole = sender.role;
      }
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      proposalId,
      senderId,
      senderName,
      senderRole,
      body: this.censorContactInfo(body),
      attachmentUrl,
      isSystemMsg: isSystem,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    this.set('ciisic_messages', messages);

    // If not system message, notify the other party
    if (!isSystem) {
      const prop = this.getProposalById(proposalId);
      if (prop) {
        // Find recipient ID
        const recipientId = senderId === prop.studentProfileId 
          ? this.getUsers().find(u => u.role === 'INDUSTRY_SPOC' && u.industryProfile?.companyName === this.getChallengeById(prop.challengeId)?.industryProfileId)?.id
          : prop.studentProfileId;

        if (recipientId) {
          this.triggerNotification(
            recipientId,
            'New Message',
            `You received a new message regarding your proposal.`,
            senderRole === 'STUDENT'
              ? `/dashboard/industry/challenges/${prop.challengeId}/proposals/${prop.id}`
              : `/dashboard/student/proposals/${prop.id}`
          );
        }
      }
    }

    return newMessage;
  }

  private censorContactInfo(text: string): string {
    // Regex for email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    // Regex for 10-digit phone numbers
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    return text
      .replace(emailRegex, '[Email Redacted for Privacy]')
      .replace(phoneRegex, '[Phone Redacted for Privacy]');
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return this.get<AuditLog>('ciisic_audit_logs');
  }

  addAuditLog(userId: string, action: string, entityType: string, entityId: string): void {
    const logs = this.get<AuditLog>('ciisic_audit_logs');
    const user = this.getUsers().find(u => u.id === userId);
    
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      userId,
      userName: user ? user.name : 'Unknown User',
      userRole: user ? user.role : 'STUDENT',
      action,
      entityType,
      entityId,
      createdAt: new Date().toISOString()
    };

    logs.unshift(newLog);
    // Enforced append-only locally
    this.set('ciisic_audit_logs', logs);
  }

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    return this.get<Notification>('ciisic_notifications').filter(n => n.userId === userId);
  }

  triggerNotification(userId: string, title: string, body: string, link?: string): void {
    const notifications = this.get<Notification>('ciisic_notifications');
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      body,
      link,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNotification);
    this.set('ciisic_notifications', notifications);
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.get<Notification>('ciisic_notifications');
    const notif = notifs.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.set('ciisic_notifications', notifs);
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    const notifs = this.get<Notification>('ciisic_notifications');
    notifs.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.set('ciisic_notifications', notifs);
  }
}

export const mockDb = new MockDatabase();
