/**
 * ============================================================================
 * WEBSITE CONTENT & TEXTS — SINGLE SOURCE OF TRUTH (`lib/data.ts`)
 * ============================================================================
 *
 * HOW TO EDIT YOUR WEBSITE TEXT:
 * Every heading, subtitle, button label, bio paragraph, project description,
 * skill, research topic, certificate, and link shown on the website lives here,
 * organized in the exact top-to-bottom order of the page:
 *
 *   00. Site Metadata & Branding (Browser tab title, logo text, contact links)
 *   01. Navigation Bar & Fullscreen Menu
 *   02. Hero Section (Top screen)
 *   03. Manifesto (Scroll-to-reveal quote)
 *   04. Section 01 — About & Education
 *   05. Section 02 — Technical Skills
 *   06. Section 03 — Project Portfolio
 *   07. Section 04 — Research & Development
 *   08. Section 05 — Certifications
 *   09. Section 06 — Leadership & Extracurriculars
 *   10. Section 07 — Contact
 *   11. Footer
 *   12. Internal Verification Checklist (Private notes, not displayed on page)
 *
 * Edit the text inside quotation marks ("...") and save the file.
 * ============================================================================
 */

import type {
  Certificate,
  ExperienceItem,
  NavLink,
  Project,
  ProjectCategory,
  ProjectStatus,
  ResearchTopic,
  SkillCategory,
  SkillItem,
  SocialLink,
} from "@/lib/types";

export type {
  Certificate,
  ExperienceItem,
  NavLink,
  Project,
  ProjectCategory,
  ProjectStatus,
  ResearchTopic,
  SkillCategory,
  SkillItem,
  SocialLink,
};

/* ========================================================================== */
/* 00. SITE METADATA, CORE PROFILE & VERIFIED LINKS                           */
/* ========================================================================== */

export const SITE_METADATA = {
  browserTitle: "Kaustubh Chamankar | Computer Science Engineering Student",
  browserDescription:
    "First-year B.Tech Computer Science Engineering student at ITM Skills University exploring AI/ML, Generative AI, research and development, web development, and entrepreneurship.",
  logoText: "Kaustubh",
  logoAriaLabel: "Kaustubh Chamankar - Back to top",
};

export const PERSONAL_INFO = {
  name: "Kaustubh Chamankar",
  initials: "KC",
  title: "Computer Science Engineering Student",
  role: "First-Year B.Tech CSE Student • ITM Skills University",
  institution: "ITM Skills University",
  degree: "B.Tech in Computer Science Engineering",
  currentStage: "First Year",
  expectedGraduation: "2030 (subject to confirmation)",
  email: "btech2026.kaustubhc@isu.ac.in",
  github: "https://github.com/kaustubhchamankar16-pixel",
  linkedin: "https://www.linkedin.com/in/kaustubh-c-14b1443b9/",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/kaustubhchamankar16-pixel",
      handle: "kaustubhchamankar16-pixel",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/kaustubh-c-14b1443b9/",
      handle: "Kaustubh Chamankar",
    },
  ] satisfies SocialLink[],
};

/* ========================================================================== */
/* 01. NAVIGATION BAR & FULLSCREEN MENU                                       */
/* ========================================================================== */

export const NAVIGATION_CONTENT = {
  topBadge: "EXPLORING AI, RESEARCH & CODE",
  topSubBadge: "B.Tech CSE • First Year",
  openMenuAriaLabel: "Open navigation menu",
  closeButtonText: "Close",
  closeMenuAriaLabel: "Close navigation menu",
  directInquiriesLabel: "Direct Inquiries",
};

export const NAV_LINKS: NavLink[] = [
  { name: "About & Education", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Research", href: "#research" },
  { name: "Certificates", href: "#certificates" },
  { name: "Experience", href: "#beyond" },
  { name: "Contact", href: "#contact" },
];

/* ========================================================================== */
/* 02. HERO SECTION (TOP OF PAGE)                                             */
/* ========================================================================== */

export const HERO_CONTENT = {
  eyebrow: `${PERSONAL_INFO.name} • ${PERSONAL_INFO.title}`,
  headlinePrefix: "Exploring AI, Research, and the",
  headlineHighlight: "Possibilities of Code.",
  subtitle:
    "I’m a Computer Science Engineering student at ITM Skills University, building my technical foundations while exploring Artificial Intelligence, Generative AI, research, and software development through practical learning and project work.",
  primaryButtonText: "Explore My Projects",
  primaryButtonHref: "#projects",
  secondaryButtonText: "Connect With Me",
  secondaryButtonHref: "#contact",
  githubLabel: "GitHub",
  linkedinLabel: "LinkedIn",
  scrollCueText: "Scroll to explore",
  cornerCardLine1: "First-Year B.Tech CSE",
  cornerCardLine2: PERSONAL_INFO.institution,
};

/* ========================================================================== */
/* 03. MANIFESTO (SCROLL-TO-REVEAL SECTION)                                   */
/* ========================================================================== */

export const MANIFESTO_CONTENT = {
  eyebrow: "Approach & Perspective",
  text: "Understanding how ideas become real, usable things — building foundations in Computer Science while exploring Artificial Intelligence, structured research, and practical problem-solving.",
  highlightWords: [
    "ideas",
    "usable",
    "foundations",
    "Artificial",
    "Intelligence",
    "research",
    "problem-solving",
  ],
  scrollHint: "Scroll to reveal",
};

/* ========================================================================== */
/* 04. SECTION 01 — ABOUT ME & EDUCATION                                      */
/* ========================================================================== */

export const ABOUT_CONTENT = {
  eyebrow: "01 // About & Education",
  heading: "curious about how ideas become real, usable things.",
  photoAlt: PERSONAL_INFO.name,
  fallbackSubtitle: "ITM Skills University • B.Tech CSE",
  photoCaptionLeft: PERSONAL_INFO.institution,
  photoCaptionRight: PERSONAL_INFO.currentStage,
  bioParagraphs: [
    "I am curious about technology and interested in understanding how ideas can become real, usable things. Coding has become an interesting way for me to explore creativity and build something from scratch. I enjoy the idea of having control over what I create and learning how different pieces work together.",
    "As a first-year B.Tech Computer Science Engineering student at ITM Skills University, I am open to exploring new subjects and technologies. I do not want to limit myself to one specialization before I have had enough experience to understand where I perform best.",
    "I want to learn through practical work, research, experimentation, and solving real problems — whether that means investigating how generative AI can be made more reliable, building web interfaces, or studying how technology applies to agriculture and campus operations.",
  ],
  educationCard: {
    eyebrow: "Education",
    degree: PERSONAL_INFO.degree,
    institutionLabel: "Institution",
    institutionValue: PERSONAL_INFO.institution,
    stageLabel: "Current Stage",
    stageValue: PERSONAL_INFO.currentStage,
    graduationLabel: "Expected Graduation",
    graduationValue: PERSONAL_INFO.expectedGraduation,
    learningAreasLabel: "Relevant Learning Areas",
    learningAreas: [
      "Python programming",
      "Web Fundamentals (HTML, CSS, JavaScript)",
    ],
  },
  interestsCard: {
    heading: "Current Areas of Interest",
    items: [
      "Artificial Intelligence & Machine Learning",
      "Generative AI",
      "AI Reliability, RAG & AI Guardrails",
      "Research & Development",
      "Python Programming",
      "Web Development",
      "Entrepreneurship & Tech Problem-Solving",
      "AgriTech & Sustainability",
    ],
  },
};

/* ========================================================================== */
/* 05. SECTION 02 — TECHNICAL SKILLS                                          */
/* ========================================================================== */

export const SKILLS_CONTENT = {
  eyebrow: "02 // Technical Skills",
  heading: "foundations & learning.",
  subtitle:
    "An honest overview of the programming languages, AI concepts, research topics, and tools I am currently learning and exploring as a first-year engineering student.",
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "programming-web",
    title: "Programming & Web",
    subtitle: "Foundational Learning",
    description:
      "Building core programming logic and front-end web structure through coursework, guided assignments, and hands-on practice.",
    iconName: "Code2",
    items: [
      { name: "Python", stage: "Learning & developing fundamentals" },
      { name: "HTML", stage: "Learning & applying foundational concepts" },
      { name: "CSS", stage: "Learning" },
      { name: "JavaScript", stage: "Learning & exploring" },
      { name: "Git & GitHub", stage: "Learning tools" },
      { name: "VS Code", stage: "Development environment" },
    ],
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    subtitle: "Concepts & Research Topics",
    description:
      "Studying how generative models work, where they fail, and how retrieval and policy verification can improve reliability.",
    iconName: "Brain",
    items: [
      { name: "Generative AI Fundamentals", stage: "Exploring" },
      { name: "AI Use Cases & Limitations", stage: "Studying" },
      { name: "AI Tools & Applications", stage: "Familiarity" },
      { name: "Retrieval-Augmented Generation (RAG)", stage: "Research topic" },
      { name: "AI Policy Verification & Guardrails", stage: "R&D topic" },
    ],
  },
  {
    id: "ai-tools",
    title: "AI Tools Explored",
    subtitle: "Prompting & Comparison",
    description:
      "Tools explored during coursework, structured prompt comparisons, fact-checking exercises, and workflow experimentation.",
    iconName: "Sparkles",
    items: [
      { name: "ChatGPT", stage: "Explored" },
      { name: "Gemini", stage: "Explored" },
      { name: "Claude", stage: "Explored" },
      { name: "Microsoft Copilot", stage: "Explored in coursework" },
      { name: "Perplexity & NotebookLM", stage: "Explored for research" },
      { name: "Gamma & Canva", stage: "Explored for presentations" },
    ],
  },
  {
    id: "domains-explored",
    title: "Problem Spaces",
    subtitle: "Inquiry & Planning",
    description:
      "Domains explored through research problem statements, university coursework, and early-stage venture planning.",
    iconName: "Compass",
    items: [
      { name: "Research & Literature Review", stage: "Developing methodology" },
      { name: "Scientific Data Visualization", stage: "Problem exploration" },
      { name: "Entrepreneurship & Business Models", stage: "Coursework & planning" },
      { name: "AgriTech & Circular Economy", stage: "Concept exploration" },
    ],
  },
];

/* ========================================================================== */
/* 06. SECTION 03 — PROJECT PORTFOLIO                                         */
/* ========================================================================== */

export const PROJECTS_CONTENT = {
  eyebrow: "03 // Project Portfolio",
  heading: "projects & explorations.",
  subtitle:
    "Research inquiries, coursework assignments, web development, and early-stage venture concepts — each labeled with its current stage of progress.",
  allFilterLabel: "All",
  filterCategories: [
    "AI & Research",
    "Web Development",
    "Entrepreneurship",
    "Academic Work",
    "Event Planning",
  ] satisfies ProjectCategory[],
  labels: {
    viewDetails: "View Details",
    hideDetails: "Hide Details",
    contributionPrefix: "My Contribution So Far:",
    objectivesHeading: "Objectives & Scope",
    deliverablesHeading: "Planned Deliverables",
    nextStepsHeading: "Potential Next Steps",
    verificationNoteHeading: "Current Stage & Verification Note",
  },
};

export const PROJECTS: Project[] = [
  {
    id: "ocean-data-visualization",
    number: "01",
    title: "Interactive Ocean Data Visualization Platform",
    category: "AI & Research",
    domain: "Scientific Data Visualization • Marine Science • Web Development",
    status: "Research & Planning",
    summary:
      "A concept for an interactive 3D web platform integrating numerical ocean-model outputs with in-situ observations, focusing on the Bay of Bengal.",
    contribution:
      "Explored the problem statement (connected to Smart India Hackathon ocean-data research), selected the Bay of Bengal as the focus region, and investigated data and visualization requirements.",
    objectives: [
      "Explore oceanographic variables by location and timestamp.",
      "Compare numerical ocean-model outputs with observed in-situ measurements.",
      "Investigate physical, chemical, and biological ocean variables.",
      "Explore connections between ocean conditions and marine ecosystems.",
    ],
    nextSteps: [
      "Identify reliable oceanographic datasets.",
      "Define the underlying data structure and schema.",
      "Select appropriate web visualization technologies.",
      "Build and validate an initial prototype.",
    ],
    accuracyNote:
      "Related to Smart India Hackathon ocean-data research. Research and planning have been discussed; implementation and testing are not yet confirmed.",
  },
  {
    id: "rag-hallucination-reduction",
    number: "02",
    title: "Reducing Hallucinations in Generative AI Using RAG",
    category: "AI & Research",
    domain: "Generative AI • Information Retrieval • Research",
    status: "Research Development",
    summary:
      "An investigation into whether Retrieval-Augmented Generation (RAG) can improve factual accuracy, evidence grounding, and reliability in generative AI responses.",
    contribution:
      "Selected the research topic and began exploring its scope and previously published research literature.",
    plannedDeliverables: [
      "Focused research paper",
      "Verified literature review",
      "Structured research methodology",
      "Potential experimental evaluation",
    ],
    nextSteps: [
      "Verify and catalog primary literature sources.",
      "Narrow the specific research question.",
      "Establish clear evaluation criteria.",
      "Determine a feasible experimental methodology.",
    ],
    accuracyNote:
      "Currently in research development. A completed paper and original experimental findings are not yet confirmed; published literature findings are kept strictly distinct from future personal experiments.",
  },
  {
    id: "ai-policy-verification",
    number: "03",
    title: "Automated Policy Verification for Generative AI Customer Support",
    category: "AI & Research",
    domain: "AI Safety • Guardrails • Policy Compliance • R&D",
    status: "Research & Prototype Planning",
    summary:
      "Investigating a verification mechanism that checks AI-generated customer-support responses against approved business policies to prevent unauthorized promises regarding refunds, discounts, or deliveries.",
    contribution:
      "Developed the problem statement and outlined a research-first approach covering published research review, gap identification, prototype design, and testing with free tools.",
    plannedDeliverables: [
      "Research source register",
      "Technical design document",
      "Baseline prototype",
      "Policy compliance test cases and evaluation results",
    ],
    nextSteps: [
      "Review relevant literature on AI guardrails and policy compliance.",
      "Define sample business policies and edge cases.",
      "Create structured test cases.",
      "Implement a baseline and verification mechanism and evaluate performance.",
    ],
    accuracyNote:
      "Research and prototype planning have been discussed. A working guardrail system, implementation, and test results are not yet confirmed.",
  },
  {
    id: "rika-cashew-venture",
    number: "04",
    title: "RIKA — Cashew and Cashew-Apple Venture",
    category: "Entrepreneurship",
    domain: "Entrepreneurship • Agriculture • Supply Chains • Food Processing",
    status: "Concept & Coursework Explored",
    summary:
      "A business concept exploring cashew production, cashew-apple collection, potential value-added products, collection logistics, market access, and regulatory feasibility.",
    contribution:
      "Explored the venture concept and worked across business-planning topics including market research, business models, e-commerce, logistics, marketing, startup finance, legal considerations, and business-plan/pitch-deck preparation.",
    objectives: [
      "Analyze cashew and cashew-apple collection logistics and supply chains.",
      "Evaluate value-added product possibilities (including exploration of Urak and Feni, subject to applicable licensing and regulatory requirements).",
      "Structure e-commerce, market access, and financial planning frameworks.",
    ],
    accuracyNote:
      "Explored as a business concept and coursework project. Operational launch, regulatory licensing, and commercial results are not confirmed; RIKA is not an operating company.",
  },
  {
    id: "freshloop-agritech",
    number: "05",
    title: "FreshLoop — Farmer Advisory & Agricultural Waste Recovery",
    category: "Entrepreneurship",
    domain: "AgriTech • Circular Economy • Entrepreneurship",
    status: "Business Planning Discussed",
    summary:
      "A proposed venture concept combining farmer crop-health advisory services and connections to nearby retailers with agricultural-waste collection and resale to biofuel extractors.",
    contribution:
      "Explored the venture concept, proposed revenue streams, and outlined business-planning deliverables.",
    objectives: [
      "Proposed annual farmer advisory fee of ₹1,500 (unvalidated proposal).",
      "Proposed connections between farmers and nearby retailers.",
      "Proposed purchase and collection of discarded wet or farm waste.",
      "Proposed resale of collected agricultural waste to biofuel extractors.",
    ],
    plannedDeliverables: [
      "Business report and presentation",
      "Business model canvas",
      "Logistics plan",
      "Prototype demonstration concept",
    ],
    accuracyNote:
      "All pricing and revenue streams are proposed concepts for business planning, not market-validated figures. A working prototype, customers, partners, and operational results are not confirmed.",
  },
  {
    id: "personal-portfolio-website",
    number: "06",
    title: "Personal Portfolio Website",
    category: "Web Development",
    domain: "Web Development • Personal Branding",
    status: "Work in Progress",
    summary:
      "This website — built to present my academic background, learning stages, research topics, coursework projects, and career direction accurately.",
    contribution:
      "Planned the portfolio structure, organized verified profile and project documentation, and iterated on the Next.js interface.",
    objectives: [
      "Present accurate, evidence-based student profile and project records.",
      "Organize research interests, skills in progress, and coursework clearly.",
      "Maintain a centralized, easy-to-edit content file for ongoing updates.",
    ],
    accuracyNote:
      "Implemented using Next.js, TypeScript, and Tailwind CSS.",
  },
  {
    id: "college-information-webpage",
    number: "07",
    title: "College Information Webpage",
    category: "Academic Work",
    domain: "Academic Work • HTML • Web Development",
    status: "Assignment Discussed",
    summary:
      "A foundational web-development assignment focused on structuring a college information page using semantic HTML and clean document formatting.",
    contribution:
      "Worked through the assignment requirements using guided instruction to understand foundational HTML elements, page structure, and indentation.",
    objectives: [
      "College heading and introductory overview",
      "Listing of five academic courses",
      "Four navigation links",
      "Two images with descriptive captions",
      "A structured HTML table containing five records",
      "Semantic HTML formatting and clean indentation",
    ],
    accuracyNote:
      "Assignment structure and concepts were worked through with guided instruction; final standalone code submission is not confirmed in this repository.",
  },
  {
    id: "genai-tools-comparative-study",
    number: "08",
    title: "Comparative Study of Generative AI Tools",
    category: "Academic Work",
    domain: "Generative AI • Prompt Engineering • Academic Work",
    status: "Assignment Preparation Discussed",
    summary:
      "A structured coursework comparison of contemporary generative AI platforms across prompting workflows, output quality, and fact-checking.",
    contribution:
      "Worked on structured responses, fact-checking outputs, and organizing assignment material alongside prompt screenshots across ChatGPT, Gemini, Claude, Copilot, Perplexity, NotebookLM, Gamma, and Canva.",
    plannedDeliverables: [
      "Structured written comparison answers",
      "Annotated prompt screenshots",
      "Compiled Google Doc report",
    ],
    accuracyNote:
      "Assignment preparation and tool comparisons have been discussed; final completion and submission are not yet confirmed.",
  },
  {
    id: "campuspulse-bottleneck-detector",
    number: "09",
    title: "CampusPulse — Campus Operations Bottleneck Detector",
    category: "Entrepreneurship",
    domain: "Campus Technology • Operational Analytics • Entrepreneurship",
    status: "Idea Explored",
    summary:
      "An early-stage idea for a platform that helps colleges identify recurring operational inefficiencies across room allocation, timetables, service counters, administrative workflows, and campus facilities.",
    contribution:
      "Explored the core problem space, potential software solution, and possible campus-technology opportunity.",
    nextSteps: [
      "Interview students, faculty, and staff to understand recurring pain points.",
      "Select one specific operational bottleneck to focus on.",
      "Validate the problem with real campus scheduling or counter scenarios.",
      "Develop a small, focused proof of concept.",
    ],
    accuracyNote:
      "Currently at the idea-exploration stage. Implementation and user/customer validation are not confirmed.",
  },
  {
    id: "campus-movie-night-proposal",
    number: "10",
    title: "Movie Night — College Event Proposal",
    category: "Event Planning",
    domain: "Event Management • Budgeting • Marketing • Campus Engagement",
    status: "Proposal Discussed",
    summary:
      "A campus event proposal designed for approximately 600 students at ITM Skills University, prepared in the context of a Cultural / Fun & Cultural Club application.",
    contribution:
      "Explored event budgeting, campus facility usage, seating and atmosphere logistics, vendor stall concepts, and student-led promotional ideas.",
    objectives: [
      "Avoid an additional entry charge for attending students.",
      "Use existing campus space and available college audiovisual equipment.",
      "Design floor seating with warm lighting for a cinema-inspired atmosphere.",
      "Explore optional food stalls in coordination with vendors.",
      "Promote via Instagram Reels and voluntary student collaborations.",
    ],
    accuracyNote:
      "Prepared as a club application proposal. Event approval, execution, final expenditure, and actual attendance are not confirmed.",
  },
];

/* ========================================================================== */
/* 07. SECTION 04 — RESEARCH & DEVELOPMENT INTERESTS                          */
/* ========================================================================== */

export const RESEARCH_CONTENT = {
  eyebrow: "04 // Research & Development",
  heading: "research interests.",
  subtitle:
    "Early-stage research questions and literature explorations — presented separately from completed research outputs or published papers.",
  focusBoxHeading: "Focus Areas Under Exploration",
  fieldLabels: {
    researchQuestion: "Research Question",
    literatureReviewed: "Published Literature Reviewed",
    ownAnalysis: "My Own Analysis",
    proposedMethodology: "Proposed Methodology",
    experimentsConducted: "Experiments Conducted",
    verifiedFindings: "Verified Findings",
    futureWork: "Future Work",
  },
};

export const RESEARCH_INTERESTS: string[] = [
  "RAG and hallucination reduction in generative AI",
  "AI-generated response verification and policy compliance",
  "Scientific data visualization and oceanographic datasets",
  "Evidence-based evaluation of technology-based solutions",
];

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    id: "rag-reliability",
    title: "Retrieval-Augmented Generation & Hallucination Reduction",
    domain: "Generative AI • Information Retrieval",
    status: "Topic Selected & Literature Exploration",
    researchQuestion:
      "How effectively can Retrieval-Augmented Generation (RAG) ground LLM outputs in external evidence and reduce factual hallucinations across domain-specific queries?",
    literatureReviewed:
      "Initial scoping of foundational RAG literature and survey papers on hallucination taxonomies in large language models (formal source register in progress).",
    ownAnalysis:
      "Examining why standalone language models generate plausible-sounding but unverified claims when queried outside their reliable training distribution.",
    proposedMethodology:
      "Compare baseline LLM responses against retrieval-grounded responses using a controlled set of factual queries and explicit citation-grounding checks.",
    experimentsConducted:
      "No personal experiments conducted yet — currently in literature review and methodology definition.",
    verifiedFindings:
      "No original experimental findings confirmed yet; insights so far reflect published literature under review.",
    futureWork:
      "Compile a verified literature review, narrow the evaluation dataset, define scoring rubrics, and run a small-scale reproducible comparison.",
  },
  {
    id: "policy-verification-guardrails",
    title: "Automated Policy Verification for Customer-Support AI",
    domain: "AI Safety • Guardrails • Policy Compliance",
    status: "Problem Statement & Research Design",
    researchQuestion:
      "Can an automated verification layer reliably detect and block AI-generated customer-support replies that violate explicit business policies on refunds, discounts, or delivery commitments?",
    literatureReviewed:
      "Exploring published work on LLM guardrails, rule-based verification, and natural-language inference for policy compliance.",
    ownAnalysis:
      "Identified the risk of conversational support agents making unauthorized commitments when prompted with edge-case customer requests.",
    proposedMethodology:
      "Draft a set of sample business policies, construct adversarial and routine customer test prompts, and evaluate a lightweight verification check using free tools.",
    experimentsConducted:
      "No experiments conducted yet — test cases and baseline architecture are in planning.",
    verifiedFindings:
      "None confirmed yet — working guardrail system and benchmark metrics are not yet implemented.",
    futureWork:
      "Build a research source register, formalize sample policy rules, assemble test cases, and prototype a verification step.",
  },
  {
    id: "ocean-data-visualization-research",
    title: "Oceanographic Model & In-Situ Observation Visualization",
    domain: "Scientific Data Visualization • Marine Science",
    status: "Problem Scoping (SIH Context)",
    researchQuestion:
      "How can numerical ocean-model outputs and in-situ sensor observations in the Bay of Bengal be aligned and visualized interactively to support marine ecosystem analysis?",
    literatureReviewed:
      "Reviewed Smart India Hackathon problem requirements and background material on oceanographic variables (physical, chemical, and biological).",
    ownAnalysis:
      "Investigated the challenge of comparing gridded simulation outputs with sparse point-based observations across space and time.",
    proposedMethodology:
      "Identify open oceanographic datasets for the Bay of Bengal, define a common spatiotemporal schema, and prototype an interactive web view.",
    experimentsConducted:
      "None conducted yet — currently at the requirements and dataset identification stage.",
    verifiedFindings:
      "None confirmed yet — prototype implementation and validation have not begun.",
    futureWork:
      "Select verified public datasets, design the data pipeline, and evaluate web-based 3D/2D rendering approaches.",
  },
];

/* ========================================================================== */
/* 08. SECTION 05 — CERTIFICATIONS                                            */
/* ========================================================================== */

export const CERTIFICATES_CONTENT = {
  eyebrow: "05 // Coursework & Credentials",
  heading: "certifications.",
  subtitle:
    "Introductory coursework completed in generative AI fundamentals, prompt design, and foundational German language study.",
};

export const CERTIFICATES: Certificate[] = [
  {
    id: "german-for-beginners",
    title: "German for Beginners",
    focusArea: "Foundational Vocabulary & Introductory Grammar",
    description:
      "Introductory study of basic German phrases, pronunciation, sentence structure, and everyday conversational expressions.",
    internalStatus: "Details to be verified",
  },
  {
    id: "intro-to-generative-ai",
    title: "Introduction to Generative AI",
    focusArea: "Core Generative AI Concepts & Model Types",
    description:
      "Overview of how generative AI models operate, how they differ from traditional discriminative machine-learning approaches, and responsible usage considerations.",
    internalStatus: "Details to be verified",
  },
  {
    id: "intro-to-generative-ai-studio",
    title: "Introduction to Generative AI Studio",
    focusArea: "Prompt Design & Model Configuration",
    description:
      "Exploration of generative AI studio interfaces, prompt structuring, parameter tuning, and basic prototyping workflows.",
    internalStatus: "Details to be verified",
  },
  {
    id: "generative-ai-for-beginners",
    title: "Generative AI for Beginners",
    focusArea: "Generative AI Foundations & Practical Use Cases",
    description:
      "Foundational coursework covering large language models, prompt formulation, practical applications, and known limitations of generative systems.",
    internalStatus: "Details to be verified",
  },
];

/* ========================================================================== */
/* 09. SECTION 06 — LEADERSHIP & EXTRACURRICULAR EXPERIENCE                   */
/* ========================================================================== */

export const EXPERIENCE_CONTENT = {
  eyebrow: "06 // Leadership & Extracurriculars",
  heading: "leadership & participation.",
  subtitle:
    "School leadership roles, athletic participation, event coordination, and community volunteering.",
};

export const LEADERSHIP_EXPERIENCE: ExperienceItem[] = [
  {
    id: "class-representative",
    role: "Class Representative",
    context: "Singhania School • Classes 5–8 (3 Years)",
    category: "School Leadership",
    description:
      "Assisted with classroom coordination, student-teacher communication, and day-to-day class responsibilities across three school years.",
  },
  {
    id: "sports-captain",
    role: "Sports Captain",
    context: "Singhania School • Classes 6–8 (2 Years)",
    category: "School Leadership",
    description:
      "Supported house sports organization, team participation, and peer encouragement during school athletic activities.",
  },
  {
    id: "track-sprinting",
    role: "House Track Sprinter (Air House)",
    context: "VIBGYOR High • Classes 8–10",
    category: "Athletics & House Participation",
    description:
      "Participated in school sprinting heats representing Air House during middle and high school sports meets.",
  },
  {
    id: "event-farewell-trip-planning",
    role: "School Event & Trip Planning Support",
    context: "Classes 8–12 • Farewell, Faculty Trip & Class Gatherings",
    category: "Event Coordination",
    description:
      "Contributed ideas and logistical help for senior farewell gifts, flowers, and decorations, assisted in planning a faculty trip to Imagica, and participated in organizing class parties.",
  },
  {
    id: "society-volunteering-anchoring",
    role: "Society Volunteering & Event Anchoring",
    context: "Community & Cultural Activities",
    category: "Volunteering & Community",
    description:
      "Participated in residential society volunteering initiatives and hosted community events as an anchor.",
  },
];

/* ========================================================================== */
/* 10. SECTION 07 — CONTACT                                                   */
/* ========================================================================== */

export const CONTACT_CONTENT = {
  eyebrow: "07 // Connect",
  headingLine1: "let's connect &",
  headingLine2: "collaborate.",
  subtitle:
    "Open to connecting about AI/ML internships, student research projects, technical clubs, and collaborative software development.",
  copyButtonText: "Copy",
  copiedButtonText: "Copied",
  copyAriaLabel: "Copy email address",
};

/* ========================================================================== */
/* 11. FOOTER                                                                 */
/* ========================================================================== */

export const FOOTER_CONTENT = {
  roleLabel: PERSONAL_INFO.role,
  copyrightTagline: "Built with curiosity & precision.",
  backToTopText: "Top",
  backToTopAriaLabel: "Back to top of page",
};

/* ========================================================================== */
/* 12. PRIVATE / INTERNAL VERIFICATION CHECKLIST (NOT DISPLAYED ON WEBSITE)   */
/* ========================================================================== */

export const INTERNAL_VERIFICATION_CHECKLIST = {
  education: [
    "Confirm exact B.Tech graduation year (currently listed as 2030, subject to confirmation).",
    "Verify school history timeline before publishing detailed pre-university dates.",
  ],
  certificates: [
    "German for Beginners: confirm exact issuing platform, completion date, and credential URL.",
    "Introduction to Generative AI: confirm Simplilearn SkillUp / issuer details, completion date, and credential URL.",
    "Introduction to Generative AI Studio: confirm issuer, completion date, and credential URL.",
    "Generative AI for Beginners: confirm issuer, completion date, and credential URL.",
  ],
  projects: [
    "Confirm public GitHub repositories under github.com/kaustubhchamankar16-pixel before linking individual project repos.",
    "Update statuses as prototypes, literature reviews, or assignments transition from planning to verified completion.",
  ],
  leadership: [
    "Confirm exact calendar years and formal titles for Singhania School and VIBGYOR High roles if more granular detail is needed.",
  ],
};
