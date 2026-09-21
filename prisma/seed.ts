/**
 * Demo data seed.
 *
 * Creates a demo account with a realistic, fully-populated job search:
 * jobs across every status, interviews, notes, tags, a complete resume,
 * a cover letter, tasks, activities, a question bank and an automation
 * with discovered jobs. Safe to re-run — the demo user is wiped and
 * rebuilt each time, other accounts are never touched.
 *
 *   npm run db:seed
 *
 * Login:  demo@jobsync.dev / demo1234
 * (override with DEMO_EMAIL / DEMO_PASSWORD / DEMO_NAME)
 */
// Load .env when running locally; harmless if dotenv is absent.
try {
  require("dotenv").config();
} catch {}
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, setHours, setMinutes, subDays, subYears } from "date-fns";

const prisma = new PrismaClient();

export const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "demo@jobsync.dev";
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "demo1234";
const DEMO_NAME = process.env.DEMO_NAME ?? "Ayesha Khan";

const now = new Date();
const at = (daysAgo: number, hour = 10, minute = 0) =>
  setMinutes(setHours(subDays(now, daysAgo), hour), minute);
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const JOB_STATUSES = [
  { label: "Draft", value: "draft" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
  { label: "Archived", value: "archived" },
];

const JOB_SOURCES = [
  { label: "Indeed", value: "indeed" },
  { label: "Linkedin", value: "linkedin" },
  { label: "Monster", value: "monster" },
  { label: "Glassdoor", value: "glassdoor" },
  { label: "Company Career page", value: "careerpage" },
  { label: "Google", value: "google" },
  { label: "ZipRecruiter", value: "ziprecruiter" },
  { label: "Job Street", value: "jobstreet" },
  { label: "Other", value: "other" },
];

const COMPANIES = [
  "Stripe",
  "Shopify",
  "Notion",
  "Vercel",
  "Figma",
  "Atlassian",
  "Canva",
  "Spotify",
  "Airbnb",
  "GitLab",
  "Cloudflare",
  "Datadog",
  "HubSpot",
  "Zapier",
  "Linear",
  "Supabase",
  "Wise",
  "Careem",
  // Resume employers
  "Techlogix",
  "Arbisoft",
  "Systems Limited",
];

const LOCATIONS: {
  label: string;
  stateProv?: string;
  country: string;
}[] = [
  { label: "Remote", country: "Worldwide" },
  { label: "Toronto", stateProv: "ON", country: "Canada" },
  { label: "Vancouver", stateProv: "BC", country: "Canada" },
  { label: "San Francisco", stateProv: "CA", country: "United States" },
  { label: "New York", stateProv: "NY", country: "United States" },
  { label: "London", country: "United Kingdom" },
  { label: "Berlin", country: "Germany" },
  { label: "Dubai", country: "United Arab Emirates" },
  { label: "Lahore", stateProv: "Punjab", country: "Pakistan" },
];

const JOB_TITLES = [
  "Frontend Engineer",
  "Full-Stack Developer",
  "Senior Software Engineer",
  "Backend Engineer",
  "React Developer",
  "Software Engineer II",
  "Product Engineer",
  "DevOps Engineer",
  "Junior Software Engineer",
  "Software Engineer",
];

const TAGS = [
  "react",
  "typescript",
  "nextjs",
  "nodejs",
  "postgresql",
  "aws",
  "graphql",
  "remote",
  "fintech",
  "startup",
  "referral",
  "dream-job",
  "urgent",
  "system-design",
  "behavioral",
  "algorithms",
  "docker",
  "tailwind",
  "prisma",
  "python",
];

const ACTIVITY_TYPES = [
  { label: "Job Search", value: "job-search", description: "Browsing boards, tailoring applications" },
  { label: "Interview Prep", value: "interview-prep", description: "Mock interviews, system design, DSA" },
  { label: "Learning", value: "learning", description: "Courses, docs, tutorials" },
  { label: "Networking", value: "networking", description: "Coffee chats, meetups, LinkedIn outreach" },
  { label: "Side Project", value: "side-project", description: "Portfolio and open-source work" },
];

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

type SeedJob = {
  title: string;
  company: string;
  location: string;
  status: string;
  source: string;
  daysAgo: number;
  type: "Full-time" | "Contract" | "Part-time";
  salary: string; // SALARY_RANGES id
  tags: string[];
  url?: string;
  description: string;
  notes?: string[];
  interviewers?: { name: string; email: string; daysAgo: number }[];
};

const JOBS: SeedJob[] = [
  {
    title: "Senior Software Engineer",
    company: "Stripe",
    location: "Remote",
    status: "offer",
    source: "linkedin",
    daysAgo: 42,
    type: "Full-time",
    salary: "14",
    tags: ["typescript", "fintech", "remote", "dream-job"],
    url: "https://stripe.com/jobs",
    description:
      "Join the Payments Experience team to build the checkout surfaces used by millions of businesses. You'll own features end-to-end across a TypeScript/React frontend and Ruby/Go services, with a strong focus on reliability, accessibility and performance.\n\nRequirements: 4+ years building production web apps, deep React/TypeScript experience, comfort working across the stack, and a track record of shipping high-quality, well-tested code.",
    notes: [
      "Referred by Sara from the Toronto meetup. Recruiter screen went great — they liked the CareerTrack project.",
      "Onsite loop: 2 coding rounds, 1 system design (designed a webhook delivery system), 1 behavioral.",
      "Offer received: base + equity, 4 weeks vacation. Deadline to respond is next Friday. Negotiating base.",
    ],
    interviewers: [
      { name: "Daniel Reyes", email: "daniel.reyes@stripe.com", daysAgo: 30 },
      { name: "Mei Tanaka", email: "mei.tanaka@stripe.com", daysAgo: 22 },
    ],
  },
  {
    title: "Full-Stack Developer",
    company: "Shopify",
    location: "Toronto",
    status: "offer",
    source: "careerpage",
    daysAgo: 38,
    type: "Full-time",
    salary: "12",
    tags: ["react", "graphql", "nodejs"],
    url: "https://www.shopify.com/careers",
    description:
      "Build merchant-facing features on the Shopify admin using React, Remix and GraphQL. You'll pair with product and design to ship weekly, and contribute to Polaris, our open-source design system.",
    notes: [
      "Take-home: built a small order-management UI with Remix. Feedback was very positive.",
      "Offer is slightly below Stripe. Using it as leverage.",
    ],
    interviewers: [{ name: "Priya Nair", email: "priya.nair@shopify.com", daysAgo: 24 }],
  },
  {
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    status: "interview",
    source: "linkedin",
    daysAgo: 20,
    type: "Full-time",
    salary: "13",
    tags: ["nextjs", "react", "remote", "dream-job"],
    url: "https://vercel.com/careers",
    description:
      "Work on the Vercel dashboard and the Next.js developer experience. We're looking for engineers who care about fast, delightful UIs and who have shipped Next.js apps at scale.",
    notes: [
      "Phone screen done. Next: pairing session on a real dashboard bug (90 min).",
      "Brush up on React Server Components and streaming.",
    ],
    interviewers: [{ name: "Lukas Weber", email: "lukas@vercel.com", daysAgo: 9 }],
  },
  {
    title: "Product Engineer",
    company: "Linear",
    location: "Remote",
    status: "interview",
    source: "other",
    daysAgo: 17,
    type: "Full-time",
    salary: "13",
    tags: ["react", "typescript", "startup", "remote"],
    url: "https://linear.app/careers",
    description:
      "Linear is looking for product engineers who can own features from idea to launch. Small team, high ownership, strong design culture. Stack: React, TypeScript, Node, Postgres, sync engine.",
    notes: ["Founder call scheduled. They asked me to bring a product I'd improve and why."],
    interviewers: [{ name: "Karri Saarinen", email: "karri@linear.app", daysAgo: 6 }],
  },
  {
    title: "Software Engineer II",
    company: "Atlassian",
    location: "Vancouver",
    status: "interview",
    source: "glassdoor",
    daysAgo: 25,
    type: "Full-time",
    salary: "11",
    tags: ["react", "typescript"],
    description:
      "Join the Jira Cloud team building collaborative planning features. You'll work in a React + TypeScript monorepo backed by Java/Kotlin microservices on AWS.",
    notes: ["Values interview next week — prepare STAR stories around 'Open company, no bullshit'."],
    interviewers: [{ name: "Hannah Lee", email: "hlee@atlassian.com", daysAgo: 12 }],
  },
  {
    title: "Backend Engineer",
    company: "Wise",
    location: "London",
    status: "interview",
    source: "linkedin",
    daysAgo: 15,
    type: "Full-time",
    salary: "11",
    tags: ["nodejs", "postgresql", "fintech"],
    description:
      "Help build the money-movement platform that powers Wise transfers in 160+ countries. Node.js/TypeScript services, Kafka, Postgres, strong emphasis on correctness and observability.",
    interviewers: [{ name: "Tomasz Nowak", email: "tomasz.nowak@wise.com", daysAgo: 4 }],
  },
  {
    title: "Full-Stack Developer",
    company: "Supabase",
    location: "Remote",
    status: "interview",
    source: "careerpage",
    daysAgo: 11,
    type: "Full-time",
    salary: "12",
    tags: ["postgresql", "react", "startup", "remote"],
    url: "https://supabase.com/careers",
    description:
      "Build the Supabase Studio dashboard and the platform APIs behind it. Deep Postgres knowledge is a big plus. Fully remote, async-first team.",
    notes: ["First round was a 45-min technical chat about Postgres RLS and connection pooling."],
    interviewers: [{ name: "Ant Wilson", email: "ant@supabase.io", daysAgo: 3 }],
  },
  {
    title: "React Developer",
    company: "Canva",
    location: "Remote",
    status: "interview",
    source: "indeed",
    daysAgo: 9,
    type: "Contract",
    salary: "10",
    tags: ["react", "typescript", "remote"],
    description:
      "6-month contract on the Canva editor team. Build high-performance canvas UI components in React and TypeScript; experience with rendering performance and profiling is essential.",
  },
  // Applied
  {
    title: "Frontend Engineer",
    company: "Notion",
    location: "San Francisco",
    status: "applied",
    source: "careerpage",
    daysAgo: 6,
    type: "Full-time",
    salary: "13",
    tags: ["react", "typescript", "dream-job"],
    url: "https://www.notion.so/careers",
    description:
      "Notion is hiring frontend engineers to work on the core editor and collaboration features. You'll tackle hard problems around real-time editing, performance and offline sync.",
    notes: ["Tailored resume to emphasize editor/rich-text work from Arbisoft."],
  },
  {
    title: "Senior Software Engineer",
    company: "Figma",
    location: "New York",
    status: "applied",
    source: "linkedin",
    daysAgo: 5,
    type: "Full-time",
    salary: "14",
    tags: ["typescript", "react"],
    description:
      "Build FigJam and Figma's multiplayer editing features. Strong TypeScript, WebGL or canvas rendering experience preferred.",
  },
  {
    title: "Full-Stack Developer",
    company: "Zapier",
    location: "Remote",
    status: "applied",
    source: "linkedin",
    daysAgo: 4,
    type: "Full-time",
    salary: "12",
    tags: ["react", "python", "remote"],
    description:
      "Ship integrations and the Zap editor UI. Python/Django backend, React frontend, 100% remote across 40+ countries.",
  },
  {
    title: "Software Engineer",
    company: "Cloudflare",
    location: "Toronto",
    status: "applied",
    source: "careerpage",
    daysAgo: 3,
    type: "Full-time",
    salary: "12",
    tags: ["typescript", "nodejs"],
    description:
      "Work on the Cloudflare dashboard and Workers developer platform. TypeScript across the stack, edge computing, a strong culture of technical blogging.",
  },
  {
    title: "Backend Engineer",
    company: "Datadog",
    location: "New York",
    status: "applied",
    source: "glassdoor",
    daysAgo: 2,
    type: "Full-time",
    salary: "13",
    tags: ["nodejs", "aws", "docker"],
    description:
      "Build high-throughput ingestion services for logs and traces. Go/Java, Kafka, Kubernetes. Scale matters here: trillions of events per day.",
  },
  {
    title: "Product Engineer",
    company: "HubSpot",
    location: "Remote",
    status: "applied",
    source: "indeed",
    daysAgo: 2,
    type: "Full-time",
    salary: "11",
    tags: ["react", "remote"],
    description:
      "Join the CRM platform team building the objects and pipelines UI. React + TypeScript frontend, Java backend, great mentorship culture.",
  },
  {
    title: "Frontend Engineer",
    company: "Spotify",
    location: "London",
    status: "applied",
    source: "linkedin",
    daysAgo: 1,
    type: "Full-time",
    salary: "11",
    tags: ["react", "typescript"],
    description:
      "Build the Spotify for Artists web app. React, TypeScript, GraphQL, with a heavy focus on data visualisation and accessibility.",
  },
  {
    title: "Full-Stack Developer",
    company: "GitLab",
    location: "Remote",
    status: "applied",
    source: "careerpage",
    daysAgo: 8,
    type: "Full-time",
    salary: "12",
    tags: ["remote", "docker"],
    description:
      "All-remote company. Work on GitLab CI/CD UI and APIs: Vue.js frontend, Ruby on Rails backend, Go for runners.",
  },
  {
    title: "Software Engineer II",
    company: "Airbnb",
    location: "San Francisco",
    status: "applied",
    source: "linkedin",
    daysAgo: 10,
    type: "Full-time",
    salary: "14",
    tags: ["react", "graphql"],
    description:
      "Guest experience team. React + GraphQL frontend on a Java/Kotlin service mesh. Strong emphasis on experimentation and metrics.",
  },
  {
    title: "DevOps Engineer",
    company: "Careem",
    location: "Dubai",
    status: "applied",
    source: "linkedin",
    daysAgo: 12,
    type: "Full-time",
    salary: "9",
    tags: ["aws", "docker"],
    description:
      "Own the CI/CD pipelines and Kubernetes clusters that power Careem's super-app. AWS, Terraform, ArgoCD, observability with Prometheus/Grafana.",
  },
  {
    title: "React Developer",
    company: "Techlogix",
    location: "Lahore",
    status: "applied",
    source: "careerpage",
    daysAgo: 14,
    type: "Full-time",
    salary: "4",
    tags: ["react", "referral"],
    description: "Frontend developer role on enterprise banking dashboards for regional clients.",
  },
  {
    title: "Software Engineer",
    company: "Systems Limited",
    location: "Lahore",
    status: "applied",
    source: "linkedin",
    daysAgo: 13,
    type: "Full-time",
    salary: "4",
    tags: ["nodejs", "react"],
    description: "Full-stack role building e-commerce platforms for retail clients using MERN stack.",
  },
  {
    title: "Frontend Engineer",
    company: "Wise",
    location: "Remote",
    status: "applied",
    source: "google",
    daysAgo: 16,
    type: "Full-time",
    salary: "11",
    tags: ["react", "fintech", "remote"],
    description: "Own the onboarding and verification flows in the Wise web app. React, TypeScript, strong a11y focus.",
  },
  {
    title: "Software Engineer",
    company: "Linear",
    location: "Remote",
    status: "applied",
    source: "other",
    daysAgo: 19,
    type: "Full-time",
    salary: "13",
    tags: ["typescript", "startup"],
    description: "Sync engine team. Work on the local-first data layer that makes Linear feel instant.",
  },
  // Rejected
  {
    title: "Senior Software Engineer",
    company: "Airbnb",
    location: "Remote",
    status: "rejected",
    source: "linkedin",
    daysAgo: 55,
    type: "Full-time",
    salary: "14",
    tags: ["react"],
    description: "Payments platform team. React and Java, strong distributed systems fundamentals required.",
    notes: ["Rejected after the system design round. Feedback: go deeper on consistency trade-offs."],
    interviewers: [{ name: "Chris Okafor", email: "c.okafor@airbnb.com", daysAgo: 45 }],
  },
  {
    title: "Backend Engineer",
    company: "Spotify",
    location: "Berlin",
    status: "rejected",
    source: "glassdoor",
    daysAgo: 50,
    type: "Full-time",
    salary: "11",
    tags: ["nodejs"],
    description: "Podcast platform backend. Java/Scala services on GCP.",
    notes: ["Automated rejection — probably the Java/Scala requirement."],
  },
  {
    title: "Frontend Engineer",
    company: "Datadog",
    location: "New York",
    status: "rejected",
    source: "careerpage",
    daysAgo: 48,
    type: "Full-time",
    salary: "12",
    tags: ["react", "typescript"],
    description: "Build dashboards and visualisations for the Datadog web app. React, TypeScript, D3.",
    notes: ["Failed the live-coding round (ran out of time on the second question). Practice timed problems."],
    interviewers: [{ name: "Elena Rossi", email: "elena.rossi@datadoghq.com", daysAgo: 40 }],
  },
  {
    title: "Software Engineer",
    company: "Figma",
    location: "San Francisco",
    status: "rejected",
    source: "linkedin",
    daysAgo: 60,
    type: "Full-time",
    salary: "13",
    tags: ["typescript"],
    description: "Plugins & developer platform team.",
  },
  {
    title: "Full-Stack Developer",
    company: "HubSpot",
    location: "Toronto",
    status: "rejected",
    source: "indeed",
    daysAgo: 44,
    type: "Full-time",
    salary: "10",
    tags: ["react"],
    description: "Marketing Hub team. React, Java, MySQL.",
  },
  {
    title: "Junior Software Engineer",
    company: "Arbisoft",
    location: "Lahore",
    status: "rejected",
    source: "other",
    daysAgo: 62,
    type: "Full-time",
    salary: "3",
    tags: ["python"],
    description: "Django/React role on an ed-tech client project.",
  },
  // Draft
  {
    title: "Senior Software Engineer",
    company: "Notion",
    location: "Remote",
    status: "draft",
    source: "careerpage",
    daysAgo: 1,
    type: "Full-time",
    salary: "14",
    tags: ["typescript", "dream-job"],
    description: "Infrastructure team — build the platform that Notion's product engineers ship on.",
    notes: ["Need to write a cover letter before applying — mention the sync engine work."],
  },
  {
    title: "Full-Stack Developer",
    company: "Canva",
    location: "Remote",
    status: "draft",
    source: "linkedin",
    daysAgo: 0,
    type: "Full-time",
    salary: "11",
    tags: ["react", "remote"],
    description: "Canva Teams — collaboration features for enterprise customers.",
  },
  {
    title: "Frontend Engineer",
    company: "Cloudflare",
    location: "London",
    status: "draft",
    source: "google",
    daysAgo: 0,
    type: "Full-time",
    salary: "11",
    tags: ["react", "typescript"],
    description: "Zero Trust dashboard team.",
  },
  {
    title: "Software Engineer",
    company: "Supabase",
    location: "Remote",
    status: "draft",
    source: "other",
    daysAgo: 2,
    type: "Contract",
    salary: "10",
    tags: ["postgresql", "remote"],
    description: "Short-term contract to build the new Auth dashboard pages.",
  },
  // Expired / Archived
  {
    title: "React Developer",
    company: "Zapier",
    location: "Remote",
    status: "expired",
    source: "ziprecruiter",
    daysAgo: 70,
    type: "Contract",
    salary: "9",
    tags: ["react"],
    description: "3-month contract building internal tooling.",
  },
  {
    title: "Software Engineer II",
    company: "GitLab",
    location: "Remote",
    status: "expired",
    source: "monster",
    daysAgo: 66,
    type: "Full-time",
    salary: "12",
    tags: ["docker", "remote"],
    description: "Package registry team.",
  },
  {
    title: "Part-time Frontend Developer",
    company: "Techlogix",
    location: "Lahore",
    status: "archived",
    source: "jobstreet",
    daysAgo: 75,
    type: "Part-time",
    salary: "2",
    tags: ["react"],
    description: "Part-time maintenance of a legacy Angular dashboard. Decided not to pursue.",
  },
];

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

const RESUME = {
  title: "Full-Stack Developer — 2026",
  contact: {
    firstName: "Ayesha",
    lastName: "Khan",
    headline: "Full-Stack Developer · React, Next.js, Node.js, PostgreSQL",
    email: DEMO_EMAIL,
    phone: "+1 (416) 555-0142",
    address: "Toronto, ON, Canada",
    url1: "https://github.com/bushraa09",
    url1Label: "GitHub",
    url2: "https://www.linkedin.com/in/ayesha-khan",
    url2Label: "LinkedIn",
  },
  summary:
    "Full-stack developer with 5+ years of experience building and scaling web products for fintech, e-commerce and SaaS teams. I specialise in React/Next.js frontends backed by Node.js and PostgreSQL, and I care deeply about performance, accessibility and clean, well-tested code. Recently led the migration of a monolithic dashboard to a Next.js App Router architecture, cutting page load times by 45% and onboarding three new engineers onto the codebase.",
  skills: {
    Frontend: ["react", "nextjs", "typescript", "tailwind"],
    Backend: ["nodejs", "graphql", "prisma", "python"],
    "Data & Infra": ["postgresql", "aws", "docker"],
  },
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Arbisoft",
      location: "Lahore",
      startYearsAgo: 2.5,
      endYearsAgo: null,
      description:
        "• Lead engineer on a multi-tenant SaaS analytics platform (Next.js, Node.js, PostgreSQL) serving 40k monthly users.\n• Migrated the legacy dashboard to the Next.js App Router with React Server Components, improving LCP by 45%.\n• Designed a background job pipeline with BullMQ and Redis that processes 2M+ events per day.\n• Mentored 3 junior engineers and introduced a code-review and testing culture (Vitest, Playwright).",
    },
    {
      title: "Software Engineer",
      company: "Systems Limited",
      location: "Lahore",
      startYearsAgo: 4.5,
      endYearsAgo: 2.5,
      description:
        "• Built customer-facing e-commerce features in React and Express for retail clients across the Middle East.\n• Implemented a GraphQL gateway that consolidated 6 REST services and cut frontend data-fetching code by 30%.\n• Owned CI/CD on GitHub Actions and Docker-based deployments to AWS ECS.",
    },
    {
      title: "Junior Software Engineer",
      company: "Techlogix",
      location: "Lahore",
      startYearsAgo: 6,
      endYearsAgo: 4.5,
      description:
        "• Developed internal banking dashboards with React and .NET Core APIs.\n• Wrote automated regression tests that reduced release QA time from 3 days to 1.",
    },
  ],
  education: {
    institution: "University of the Punjab",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    startYear: 2016,
    endYear: 2020,
    location: "Lahore",
    description: "Graduated with distinction. Final-year project: real-time collaborative code editor.",
  },
  certifications: [
    {
      title: "AWS Certified Developer – Associate",
      organization: "Amazon Web Services",
      issueYearsAgo: 1,
      expiresInYears: 2,
      credentialUrl: "https://www.credly.com/",
    },
    {
      title: "Meta Front-End Developer Professional Certificate",
      organization: "Coursera",
      issueYearsAgo: 2,
      expiresInYears: null,
      credentialUrl: "https://www.coursera.org/",
    },
  ],
  projects: [
    {
      title: "JobSync — AI-powered job search tracker",
      content:
        "Open-source Next.js 15 app to track applications, manage resumes and match jobs using LLMs. Prisma + SQLite, NextAuth, Vercel AI SDK, MCP server integration for AI agents.",
    },
    {
      title: "Ledgerly — personal finance dashboard",
      content:
        "React + Node.js app that imports bank statements, categorises transactions with a rules engine and visualises spending with Nivo charts.",
    },
  ],
};

const COVER_LETTER = {
  title: "Frontend / Full-Stack — general",
  content: `Dear Hiring Team,

I'm a full-stack developer with five years of experience shipping React and Node.js products, and I'm excited to apply for this role. Over the past two years at Arbisoft I led the migration of our analytics dashboard to the Next.js App Router, improving load times by 45% while mentoring three junior engineers.

I'm drawn to teams that own problems end-to-end and care about the craft of building fast, accessible interfaces. I'd love to bring that energy to your team.

Thank you for your time — I look forward to speaking with you.

Warm regards,
Ayesha Khan`,
};

// ---------------------------------------------------------------------------
// Tasks, activities, questions
// ---------------------------------------------------------------------------

const TASKS = [
  { title: "Respond to Stripe offer", description: "Counter on base salary; ask about the relocation stipend.", status: "in-progress", priority: 10, percent: 60, dueInDays: 3, type: "job-search" },
  { title: "Prepare Vercel pairing session", description: "Review RSC streaming, Suspense boundaries and the dashboard repo's conventions.", status: "in-progress", priority: 9, percent: 40, dueInDays: 2, type: "interview-prep" },
  { title: "Write cover letter for Notion infra role", status: "in-progress", priority: 7, percent: 0, dueInDays: 4, type: "job-search" },
  { title: "System design: rate limiter & webhook delivery", description: "Practice on a whiteboard, 45 min each.", status: "in-progress", priority: 8, percent: 50, dueInDays: 5, type: "interview-prep" },
  { title: "Follow up with Priya at Shopify", status: "needs-attention", priority: 6, percent: 0, dueInDays: -1, type: "networking" },
  { title: "Update LinkedIn headline & about section", status: "complete", priority: 4, percent: 100, dueInDays: -6, type: "networking" },
  { title: "Finish Postgres performance course", description: "Chapters 7–10 remaining.", status: "in-progress", priority: 5, percent: 70, dueInDays: 10, type: "learning" },
  { title: "Publish JobSync v1.2 release notes", status: "complete", priority: 3, percent: 100, dueInDays: -3, type: "side-project" },
  { title: "Apply to Canva Teams role", status: "in-progress", priority: 6, percent: 20, dueInDays: 1, type: "job-search" },
  { title: "Mock interview with Hamza", description: "Behavioral + one LeetCode medium.", status: "cancelled", priority: 5, percent: 0, dueInDays: -2, type: "interview-prep" },
];

const ACTIVITY_NAMES: Record<string, string[]> = {
  "job-search": [
    "Browsed LinkedIn & Wellfound for React roles",
    "Tailored resume for Notion application",
    "Applied to 3 roles via company career pages",
    "Researched Vercel engineering blog",
    "Updated CareerTrack pipeline & notes",
  ],
  "interview-prep": [
    "LeetCode: 2 mediums (graphs)",
    "System design: designed a URL shortener",
    "Mock behavioral interview",
    "Reviewed React performance patterns",
    "Practiced explaining past projects (STAR)",
  ],
  learning: [
    "Postgres performance course — indexes",
    "Read Next.js caching docs",
    "Watched talk on React Server Components",
    "Kubernetes basics tutorial",
  ],
  networking: [
    "Coffee chat with ex-colleague at Shopify",
    "Toronto JS meetup",
    "LinkedIn outreach: 5 messages",
    "Replied to recruiter emails",
  ],
  "side-project": [
    "JobSync: built resume PDF export",
    "JobSync: fixed automation run history UI",
    "Ledgerly: bank CSV importer",
    "Wrote blog post on Prisma + SQLite",
  ],
};

const QUESTIONS = [
  {
    q: "Tell me about a time you had to make a trade-off between shipping quickly and code quality.",
    a: "At Arbisoft we had a customer deadline for a reporting feature. I shipped a simpler synchronous version behind a feature flag, documented the known limits, and scheduled the async job-queue version for the next sprint. The client got value on time and we replaced it two weeks later without incident.",
    tags: ["behavioral"],
  },
  {
    q: "How would you design a rate limiter for a public API?",
    a: "Token bucket per API key stored in Redis with a Lua script for atomic check-and-decrement. Return 429 with Retry-After. For multi-region, accept eventual consistency with per-region buckets sized by traffic share, or use a sliding-window log for strict limits at higher cost.",
    tags: ["system-design"],
  },
  {
    q: "Explain how React Server Components differ from SSR.",
    a: "SSR renders client components to HTML on the server and then hydrates them; RSC renders on the server and never ships component code to the client. RSCs can access the backend directly, stream, and reduce bundle size; client components are still used for interactivity.",
    tags: ["react", "nextjs"],
  },
  {
    q: "Given an array of intervals, merge all overlapping intervals.",
    a: "Sort by start, then iterate keeping a current interval; if the next start ≤ current end, extend the end, else push and start a new one. O(n log n).",
    tags: ["algorithms"],
  },
  {
    q: "How do you keep a Postgres query fast as a table grows to hundreds of millions of rows?",
    a: "Right indexes (composite, partial, covering), avoid SELECT *, keyset pagination instead of OFFSET, partitioning by time for append-only data, and EXPLAIN ANALYZE in CI for critical queries.",
    tags: ["postgresql", "system-design"],
  },
  {
    q: "What's the difference between optimistic and pessimistic locking?",
    a: "Optimistic: read a version, write only if the version is unchanged, retry on conflict — good for low contention. Pessimistic: take a lock (SELECT ... FOR UPDATE) before writing — good for high contention or when retries are expensive.",
    tags: ["postgresql"],
  },
  {
    q: "Describe a disagreement with a teammate and how you resolved it.",
    a: "A colleague wanted to adopt a new state library mid-project. I proposed we time-box a spike, compare bundle size and DX on one feature, and decide with data. The spike showed marginal gains, so we deferred it — and the process became our default for tooling changes.",
    tags: ["behavioral"],
  },
  {
    q: "How would you design a webhook delivery system with retries?",
    a: "Persist events in an outbox table, a worker pool pulls with SKIP LOCKED, POSTs with HMAC signatures, exponential backoff with jitter (up to ~24h), dead-letter after N attempts, idempotency keys so consumers can dedupe, and a dashboard to replay.",
    tags: ["system-design", "nodejs"],
  },
  {
    q: "Explain the event loop and how it handles async I/O in Node.js.",
    a: "Single-threaded JS runs on the call stack; libuv handles I/O on a thread pool/OS async APIs. Completed callbacks queue into phases (timers, poll, check), with microtasks (promises) drained between each macrotask.",
    tags: ["nodejs"],
  },
  {
    q: "Why do you want to work here?",
    a: "Tailor per company: product I use daily, engineering blog/culture, specific team problems that overlap with my experience, growth path.",
    tags: ["behavioral"],
  },
];

// ---------------------------------------------------------------------------
// Automation (discovered jobs)
// ---------------------------------------------------------------------------

const DISCOVERED: {
  title: string;
  company: string;
  location: string;
  score: number;
  rec: "strong match" | "good match" | "partial match" | "weak match";
  status: "new" | "accepted" | "dismissed";
  daysAgo: number;
  description: string;
  body: string;
}[] = [
  {
    title: "Frontend Engineer",
    company: "Stripe",
    location: "Remote",
    score: 91,
    rec: "strong match",
    status: "new",
    daysAgo: 1,
    description: "Build the Stripe Dashboard's next-generation reporting UI in React and TypeScript.",
    body: "## Why this is a strong match\n\n- **React/TypeScript depth** — 5 years of production React matches the core requirement.\n- **Next.js App Router migration** maps directly to their dashboard modernisation work.\n- **Fintech context** from the Wise application and banking dashboards at Techlogix.\n\n## Gaps\n\n- Ruby exposure is light; mention willingness to ramp up.",
  },
  {
    title: "Full-Stack Developer",
    company: "Vercel",
    location: "Remote",
    score: 88,
    rec: "strong match",
    status: "new",
    daysAgo: 1,
    description: "Work across the Vercel platform: dashboard, deployment APIs and Next.js integrations.",
    body: "## Summary\n\nVery close fit. Next.js expertise and the JobSync side project are directly relevant. Highlight the RSC migration and performance results in the application.",
  },
  {
    title: "Senior Software Engineer",
    company: "Cloudflare",
    location: "Toronto",
    score: 76,
    rec: "good match",
    status: "new",
    daysAgo: 2,
    description: "Workers developer platform. TypeScript, Rust exposure a plus.",
    body: "## Summary\n\nGood match on TypeScript and platform work. Rust is a nice-to-have you don't have yet — position edge computing interest via Cloudflare Workers experiments.",
  },
  {
    title: "Backend Engineer",
    company: "Datadog",
    location: "New York",
    score: 62,
    rec: "partial match",
    status: "dismissed",
    daysAgo: 4,
    description: "Go services for metrics ingestion at massive scale.",
    body: "## Summary\n\nPartial match — the role is Go-heavy and infrastructure-focused; your strengths are product-facing full-stack work.",
  },
  {
    title: "Product Engineer",
    company: "Linear",
    location: "Remote",
    score: 85,
    rec: "strong match",
    status: "accepted",
    daysAgo: 17,
    description: "Product engineers who own features end to end.",
    body: "## Summary\n\nStrong match on ownership, React/TypeScript and startup pace. Accepted into the tracker.",
  },
  {
    title: "Software Engineer, Growth",
    company: "Notion",
    location: "San Francisco",
    score: 71,
    rec: "good match",
    status: "new",
    daysAgo: 3,
    description: "Experimentation and onboarding flows across web and mobile.",
    body: "## Summary\n\nGood match. Emphasise the A/B testing and analytics platform work at Arbisoft.",
  },
  {
    title: "Staff Engineer, Platform",
    company: "Shopify",
    location: "Toronto",
    score: 48,
    rec: "weak match",
    status: "new",
    daysAgo: 2,
    description: "Staff-level platform role; Ruby and large-scale infra leadership required.",
    body: "## Summary\n\nWeak match — seniority and Ruby/infra leadership requirements exceed current experience.",
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function resetDemoUser() {
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!existing) return;
  const userId = existing.id;

  console.log(`Removing existing demo account (${DEMO_EMAIL})…`);

  await prisma.user.update({ where: { id: userId }, data: { defaultResumeId: null } });

  // Automations & runs (runs cascade)
  await prisma.job.updateMany({ where: { userId }, data: { automationId: null } });
  await prisma.automation.deleteMany({ where: { userId } });

  // Jobs and their children
  const jobs = await prisma.job.findMany({ where: { userId }, select: { id: true } });
  const jobIds = jobs.map((j) => j.id);
  await prisma.note.deleteMany({ where: { userId } });
  await prisma.contact.deleteMany({ where: { createdBy: userId } });
  await prisma.interview.deleteMany({ where: { jobId: { in: jobIds } } });
  for (const id of jobIds) {
    await prisma.job.update({ where: { id }, data: { tags: { set: [] } } });
  }
  await prisma.job.deleteMany({ where: { userId } });

  // Activities & tasks
  await prisma.activity.deleteMany({ where: { userId } });
  await prisma.task.deleteMany({ where: { userId } });
  await prisma.activityType.deleteMany({ where: { createdBy: userId } });

  // Questions
  const questions = await prisma.question.findMany({ where: { createdBy: userId }, select: { id: true } });
  for (const q of questions) {
    await prisma.question.update({ where: { id: q.id }, data: { tags: { set: [] } } });
  }
  await prisma.question.deleteMany({ where: { createdBy: userId } });

  // Profile → resumes → sections
  const profiles = await prisma.profile.findMany({ where: { userId }, select: { id: true } });
  const profileIds = profiles.map((p) => p.id);
  const resumes = await prisma.resume.findMany({
    where: { profileId: { in: profileIds } },
    include: { ResumeSections: { select: { id: true, summaryId: true } } },
  });
  const resumeIds = resumes.map((r) => r.id);
  const sectionIds = resumes.flatMap((r) => r.ResumeSections.map((s) => s.id));
  const summaryIds = resumes
    .flatMap((r) => r.ResumeSections)
    .map((s) => s.summaryId)
    .filter((id): id is string => !!id);

  await prisma.skill.deleteMany({ where: { resumeSectionId: { in: sectionIds } } });
  await prisma.workExperience.deleteMany({ where: { resumeSectionId: { in: sectionIds } } });
  await prisma.education.deleteMany({ where: { resumeSectionId: { in: sectionIds } } });
  await prisma.licenseOrCertification.deleteMany({ where: { resumeSectionId: { in: sectionIds } } });
  await prisma.otherSection.deleteMany({ where: { resumeSectionId: { in: sectionIds } } });
  await prisma.resumeSection.deleteMany({ where: { id: { in: sectionIds } } });
  await prisma.summary.deleteMany({ where: { id: { in: summaryIds } } });
  await prisma.contactInfo.deleteMany({ where: { resumeId: { in: resumeIds } } });
  await prisma.resume.deleteMany({ where: { id: { in: resumeIds } } });
  await prisma.coverLetter.deleteMany({ where: { profileId: { in: profileIds } } });
  await prisma.profile.deleteMany({ where: { userId } });

  // Lookups & misc
  await prisma.tag.deleteMany({ where: { createdBy: userId } });
  await prisma.company.deleteMany({ where: { createdBy: userId } });
  await prisma.location.deleteMany({ where: { createdBy: userId } });
  await prisma.jobTitle.deleteMany({ where: { createdBy: userId } });
  await prisma.jobSource.deleteMany({ where: { createdBy: userId } });
  await prisma.mcpAccessToken.deleteMany({ where: { userId } });
  await prisma.apiKey.deleteMany({ where: { userId } });
  await prisma.userSettings.deleteMany({ where: { userId } });

  await prisma.user.delete({ where: { id: userId } });
}

async function main() {
  console.log("Seeding demo data…");
  await resetDemoUser();

  // Global statuses
  for (const status of JOB_STATUSES) {
    await prisma.jobStatus.upsert({ where: { value: status.value }, update: {}, create: status });
  }
  const statuses = await prisma.jobStatus.findMany();
  const statusId = new Map(statuses.map((s) => [s.value, s.id]));

  // User
  const user = await prisma.user.create({
    data: {
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: await bcrypt.hash(DEMO_PASSWORD, 10),
      createdAt: subDays(now, 80),
    },
  });
  const userId = user.id;

  // Lookups
  await prisma.jobSource.createMany({
    data: JOB_SOURCES.map((s) => ({ ...s, createdBy: userId })),
  });
  const sources = await prisma.jobSource.findMany({ where: { createdBy: userId } });
  const sourceId = new Map(sources.map((s) => [s.value, s.id]));

  await prisma.company.createMany({
    data: COMPANIES.map((label) => ({ label, value: slug(label), createdBy: userId })),
  });
  const companies = await prisma.company.findMany({ where: { createdBy: userId } });
  const companyId = new Map(companies.map((c) => [c.label, c.id]));

  await prisma.location.createMany({
    data: LOCATIONS.map((l) => ({
      label: l.label,
      value: slug(l.label),
      stateProv: l.stateProv ?? null,
      country: l.country,
      createdBy: userId,
    })),
  });
  const locations = await prisma.location.findMany({ where: { createdBy: userId } });
  const locationId = new Map(locations.map((l) => [l.label, l.id]));

  const allTitles = Array.from(
    new Set([...JOB_TITLES, ...JOBS.map((j) => j.title), ...DISCOVERED.map((d) => d.title)]),
  );
  await prisma.jobTitle.createMany({
    data: allTitles.map((label) => ({ label, value: slug(label), createdBy: userId })),
  });
  const titles = await prisma.jobTitle.findMany({ where: { createdBy: userId } });
  const titleId = new Map(titles.map((t) => [t.label, t.id]));

  await prisma.tag.createMany({
    data: TAGS.map((t) => ({ label: t, value: t, createdBy: userId })),
  });
  const tags = await prisma.tag.findMany({ where: { createdBy: userId } });
  const tagId = new Map(tags.map((t) => [t.value, t.id]));

  // Profile, resume, cover letter
  const profile = await prisma.profile.create({ data: { userId } });
  const resume = await prisma.resume.create({
    data: { profileId: profile.id, title: RESUME.title, createdAt: subDays(now, 70) },
  });
  await prisma.contactInfo.create({ data: { resumeId: resume.id, ...RESUME.contact } });

  const summary = await prisma.summary.create({ data: { content: RESUME.summary } });
  await prisma.resumeSection.create({
    data: { resumeId: resume.id, sectionTitle: "Summary", sectionType: "summary", summaryId: summary.id },
  });

  const skillsSection = await prisma.resumeSection.create({
    data: { resumeId: resume.id, sectionTitle: "Skills", sectionType: "skills" },
  });
  let order = 0;
  for (const [category, skills] of Object.entries(RESUME.skills)) {
    for (const s of skills) {
      await prisma.skill.create({
        data: { category, order: order++, tagId: tagId.get(s)!, resumeSectionId: skillsSection.id },
      });
    }
  }

  const expSection = await prisma.resumeSection.create({
    data: { resumeId: resume.id, sectionTitle: "Work Experience", sectionType: "experience" },
  });
  for (const e of RESUME.experience) {
    await prisma.workExperience.create({
      data: {
        companyId: companyId.get(e.company)!,
        jobTitleId: titleId.get(e.title)!,
        locationId: locationId.get(e.location)!,
        startDate: subDays(now, Math.round(e.startYearsAgo * 365)),
        endDate: e.endYearsAgo === null ? null : subDays(now, Math.round(e.endYearsAgo * 365)),
        description: e.description,
        resumeSectionId: expSection.id,
      },
    });
  }

  const eduSection = await prisma.resumeSection.create({
    data: { resumeId: resume.id, sectionTitle: "Education", sectionType: "education" },
  });
  await prisma.education.create({
    data: {
      institution: RESUME.education.institution,
      degree: RESUME.education.degree,
      fieldOfStudy: RESUME.education.fieldOfStudy,
      startDate: new Date(`${RESUME.education.startYear}-09-01`),
      endDate: new Date(`${RESUME.education.endYear}-06-01`),
      description: RESUME.education.description,
      locationId: locationId.get(RESUME.education.location)!,
      resumeSectionId: eduSection.id,
    },
  });

  const certSection = await prisma.resumeSection.create({
    data: { resumeId: resume.id, sectionTitle: "Certifications", sectionType: "certification" },
  });
  for (const c of RESUME.certifications) {
    await prisma.licenseOrCertification.create({
      data: {
        title: c.title,
        organization: c.organization,
        issueDate: subYears(now, c.issueYearsAgo),
        expirationDate: c.expiresInYears ? addDays(subYears(now, c.issueYearsAgo), c.expiresInYears * 365) : null,
        credentialUrl: c.credentialUrl,
        resumeSectionId: certSection.id,
      },
    });
  }

  const projSection = await prisma.resumeSection.create({
    data: { resumeId: resume.id, sectionTitle: "Projects", sectionType: "project" },
  });
  for (const p of RESUME.projects) {
    await prisma.otherSection.create({ data: { ...p, resumeSectionId: projSection.id } });
  }

  await prisma.user.update({ where: { id: userId }, data: { defaultResumeId: resume.id } });

  const coverLetter = await prisma.coverLetter.create({
    data: { profileId: profile.id, ...COVER_LETTER },
  });

  // Jobs
  const appliedStatuses = new Set(["applied", "interview", "offer", "rejected"]);
  let interviews = 0;
  let notes = 0;
  for (const j of JOBS) {
    const createdAt = at(j.daysAgo, 9, 30);
    const applied = appliedStatuses.has(j.status);
    const job = await prisma.job.create({
      data: {
        userId,
        jobUrl: j.url ?? null,
        description: j.description,
        jobType: j.type,
        createdAt,
        applied,
        appliedDate: applied ? addDays(createdAt, 1) : null,
        dueDate: addDays(createdAt, 21),
        statusId: statusId.get(j.status)!,
        jobTitleId: titleId.get(j.title)!,
        companyId: companyId.get(j.company)!,
        jobSourceId: sourceId.get(j.source) ?? sourceId.get("other")!,
        salaryRange: j.salary,
        locationId: locationId.get(j.location)!,
        resumeId: applied ? resume.id : null,
        coverLetterId: j.status === "offer" || j.status === "interview" ? coverLetter.id : null,
        tags: { connect: j.tags.map((t) => ({ id: tagId.get(t)! })) },
      },
    });

    for (const [i, content] of (j.notes ?? []).entries()) {
      await prisma.note.create({
        data: { jobId: job.id, userId, content, createdAt: addDays(createdAt, 2 + i * 5) },
      });
      notes++;
    }

    for (const iv of j.interviewers ?? []) {
      await prisma.interview.create({
        data: {
          jobId: job.id,
          createdAt: at(iv.daysAgo, 14),
          interviewers: {
            create: { name: iv.name, email: iv.email, createdAt: at(iv.daysAgo, 14), createdBy: userId },
          },
        },
      });
      interviews++;
    }
  }

  // Activity types, tasks, activities
  await prisma.activityType.createMany({
    data: ACTIVITY_TYPES.map((t) => ({ ...t, createdBy: userId })),
  });
  const activityTypes = await prisma.activityType.findMany({ where: { createdBy: userId } });
  const activityTypeId = new Map(activityTypes.map((t) => [t.value, t.id]));

  for (const t of TASKS) {
    await prisma.task.create({
      data: {
        userId,
        title: t.title,
        description: t.description ?? null,
        status: t.status,
        priority: t.priority,
        percentComplete: t.percent,
        dueDate: addDays(now, t.dueInDays),
        activityTypeId: activityTypeId.get(t.type)!,
        createdAt: subDays(now, 7),
      },
    });
  }

  // Deterministic pseudo-random spread of activities over the last 45 days
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const typeValues = ACTIVITY_TYPES.map((t) => t.value);
  let activities = 0;
  for (let day = 45; day >= 0; day--) {
    const isWeekend = subDays(now, day).getDay() % 6 === 0;
    const count = isWeekend ? Math.floor(rand() * 2) : 1 + Math.floor(rand() * 3);
    let hour = 9;
    for (let i = 0; i < count; i++) {
      const type = typeValues[Math.floor(rand() * typeValues.length)];
      const names = ACTIVITY_NAMES[type];
      const name = names[Math.floor(rand() * names.length)];
      const duration = 30 + Math.floor(rand() * 5) * 30; // 30–150 min
      const start = at(day, hour, 0);
      hour += Math.ceil(duration / 60) + 1;
      await prisma.activity.create({
        data: {
          userId,
          activityName: name,
          activityTypeId: activityTypeId.get(type)!,
          startTime: start,
          endTime: new Date(start.getTime() + duration * 60_000),
          duration,
          description: null,
        },
      });
      activities++;
    }
  }

  // Questions
  for (const [i, q] of QUESTIONS.entries()) {
    await prisma.question.create({
      data: {
        question: q.q,
        answer: q.a,
        createdBy: userId,
        createdAt: subDays(now, 40 - i * 3),
        tags: { connect: q.tags.map((t) => ({ id: tagId.get(t)! })) },
      },
    });
  }

  // Automation + runs + discovered jobs
  const automation = await prisma.automation.create({
    data: {
      userId,
      name: "Frontend & full-stack roles at top startups",
      jobBoard: "greenhouse",
      keywords: "react, typescript, next.js, node.js",
      location: "Remote, Toronto",
      sourceConfig: JSON.stringify({
        greenhouse: {
          companies: [
            { name: "Stripe", token: "stripe" },
            { name: "Vercel", token: "vercel" },
            { name: "Cloudflare", token: "cloudflare" },
            { name: "Notion", token: "notion" },
            { name: "Shopify", token: "shopify" },
          ],
          targetTitles: ["Frontend Engineer", "Full-Stack Developer", "Software Engineer"],
          keywords: ["react", "typescript", "next.js", "node.js"],
          locations: ["Remote", "Toronto"],
          strictLocation: false,
          topK: 8,
        },
      }),
      resumeId: resume.id,
      matchThreshold: 75,
      scheduleHour: 8,
      nextRunAt: setMinutes(setHours(addDays(now, 1), 8), 0),
      lastRunAt: at(1, 8),
      status: "active",
      createdAt: subDays(now, 20),
    },
  });

  const funnel = (fetched: number, fresh: number, relevant: number, analyzed: number, strong: number) =>
    JSON.stringify([
      { key: "fetched", label: "Fetched", count: fetched },
      { key: "dedup", label: "New", count: fresh },
      { key: "floor", label: "Relevant", count: relevant },
      { key: "analyzed", label: "Analyzed", count: analyzed },
      { key: "highlighted", label: "Strong match", count: strong },
    ]);

  const runs = [
    { daysAgo: 17, fetched: 212, fresh: 212, relevant: 31, analyzed: 8, strong: 2, saved: 3, status: "completed" },
    { daysAgo: 10, fetched: 219, fresh: 14, relevant: 6, analyzed: 4, strong: 1, saved: 1, status: "completed" },
    { daysAgo: 4, fetched: 224, fresh: 9, relevant: 4, analyzed: 3, strong: 1, saved: 2, status: "completed" },
    { daysAgo: 3, fetched: 0, fresh: 0, relevant: 0, analyzed: 0, strong: 0, saved: 0, status: "failed", error: "Greenhouse board 'notion' returned 429 Too Many Requests" },
    { daysAgo: 1, fetched: 230, fresh: 11, relevant: 5, analyzed: 5, strong: 2, saved: 3, status: "completed" },
  ];
  for (const r of runs) {
    const startedAt = at(r.daysAgo, 8);
    await prisma.automationRun.create({
      data: {
        automationId: automation.id,
        jobsSearched: r.fetched,
        jobsDeduplicated: r.fresh,
        jobsProcessed: r.analyzed,
        jobsMatched: r.strong,
        jobsSaved: r.saved,
        status: r.status,
        errorMessage: r.error ?? null,
        funnelStats: r.status === "completed" ? funnel(r.fetched, r.fresh, r.relevant, r.analyzed, r.strong) : null,
        startedAt,
        completedAt: new Date(startedAt.getTime() + (r.status === "failed" ? 20_000 : 4 * 60_000)),
      },
    });
  }

  for (const d of DISCOVERED) {
    const discoveredAt = at(d.daysAgo, 8, 5);
    await prisma.job.create({
      data: {
        userId,
        description: d.description,
        jobType: "Full-time",
        createdAt: discoveredAt,
        applied: false,
        statusId: statusId.get("draft")!,
        jobTitleId: titleId.get(d.title)!,
        companyId: companyId.get(d.company)!,
        jobSourceId: sourceId.get("careerpage")!,
        locationId: locationId.get(d.location)!,
        jobUrl: `https://boards.greenhouse.io/${slug(d.company)}`,
        resumeId: resume.id,
        automationId: automation.id,
        matchScore: d.score,
        matchData: JSON.stringify({
          matchScore: d.score,
          recommendation: d.rec,
          body: d.body,
          resumeId: resume.id,
          resumeTitle: RESUME.title,
          matchedAt: discoveredAt.toISOString(),
          provider: "openai",
          model: "gpt-4o-mini",
          analyzed: true,
          prerankScore: Math.round(d.score * 0.9),
        }),
        discoveryStatus: d.status,
        discoveredAt,
      },
    });
  }

  console.log(`
Demo account ready.

  Email:     ${DEMO_EMAIL}
  Password:  ${DEMO_PASSWORD}

  ${JOBS.length} jobs · ${interviews} interviews · ${notes} notes
  1 resume · 1 cover letter · ${TASKS.length} tasks · ${activities} activities
  ${QUESTIONS.length} questions · 1 automation · ${DISCOVERED.length} discovered jobs
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
