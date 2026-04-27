const INTERVIEW_KEYWORDS = [
  "interview",
  "job",
  "role",
  "position",
  "candidate",
  "hiring",
  "behavioral",
  "competency",
  "competencies",
  "assessment",
  "screening",
  "experience",
  "responsibilities",
  "requirements",
  "qualifications",
  "skills",
  "duties",
  "day-to-day",
  "full-time",
  "part-time",
  "contract",
  "internship",
  "resume",
  "cv",
  "curriculum vitae",
  "cover letter",
  "employment",
  "work history",
  "work experience",
  "professional experience",
  "career",
];

const JOB_DESCRIPTION_KEYWORDS = [
  "must have",
  "nice to have",
  "years",
  "responsible for",
  "we are looking for",
  "requirements",
  "qualifications",
  "preferred",
];

const CV_KEYWORDS = [
  "worked at",
  "experience",
  "projects",
  "education",
  "skills",
  "summary",
  "certifications",
];

const MIN_GUARDRAIL_SCORE = 2;

export class InterviewScopeError extends Error {
  constructor(message = "Please provide interview-related CV and job description content.") {
    super(message);
    this.name = "InterviewScopeError";
  }
}

function countKeywordHits(text: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => (text.includes(keyword) ? score + 1 : score), 0);
}

export function assertInterviewScope(input: { cv: string; jobDescription: string }) {
  const normalizedCv = input.cv.toLowerCase();
  const normalizedJd = input.jobDescription.toLowerCase();
  const combined = `${normalizedCv}\n${normalizedJd}`;

  const interviewSignal = countKeywordHits(combined, INTERVIEW_KEYWORDS);
  const jdSignal = countKeywordHits(normalizedJd, JOB_DESCRIPTION_KEYWORDS);
  const cvSignal = countKeywordHits(normalizedCv, CV_KEYWORDS);

  // Require at least one explicit interview/job signal plus one structural CV/JD signal.
  const score = interviewSignal + (jdSignal > 0 ? 1 : 0) + (cvSignal > 0 ? 1 : 0);
  if (interviewSignal === 0 || score < MIN_GUARDRAIL_SCORE) {
    throw new InterviewScopeError();
  }
}
