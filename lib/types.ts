/**
 * TypeScript Definitions for Portfolio Content
 *
 * Separating these types keeps `lib/data.ts` clean and easy to read
 * when editing website text.
 */

export type ProjectCategory =
  | "AI & Research"
  | "Web Development"
  | "Entrepreneurship"
  | "Academic Work"
  | "Event Planning";

export type ProjectStatus =
  | "Idea Explored"
  | "Research & Planning"
  | "Research Development"
  | "Research & Prototype Planning"
  | "Concept & Coursework Explored"
  | "Business Planning Discussed"
  | "Assignment Discussed"
  | "Assignment Preparation Discussed"
  | "Proposal Discussed"
  | "Work in Progress";

export interface Project {
  id: string;
  number: string;
  title: string;
  category: ProjectCategory;
  domain: string;
  status: ProjectStatus;
  summary: string;
  contribution: string;
  objectives?: string[];
  plannedDeliverables?: string[];
  nextSteps?: string[];
  accuracyNote?: string;
  repositoryUrl?: string; // Only populated when a public repository is verified
}

export interface SkillItem {
  name: string;
  stage: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: "Code2" | "Brain" | "Sparkles" | "Compass";
  items: SkillItem[];
}

export interface Certificate {
  id: string;
  title: string;
  focusArea: string;
  description: string;
  issuer?: string; // Only shown if verified
  date?: string; // Only shown if verified
  url?: string; // Only linked if verified
  internalStatus: "Details to be verified";
}

export interface ResearchTopic {
  id: string;
  title: string;
  domain: string;
  status: string;
  researchQuestion: string;
  literatureReviewed: string;
  ownAnalysis: string;
  proposedMethodology: string;
  experimentsConducted: string;
  verifiedFindings: string;
  futureWork: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  context: string;
  category:
    | "School Leadership"
    | "Athletics & House Participation"
    | "Event Coordination"
    | "Volunteering & Community";
  description: string;
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
}

export interface NavLink {
  name: string;
  href: string;
}

