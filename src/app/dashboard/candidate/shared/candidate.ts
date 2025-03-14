interface QuestionOption {
  id: string;
  createdAt: string;
  code: string;
  description: string;
  questionType: 'DATE' | 'DROPDOWN' | 'TEXT';
  options: {
    id: string;
    createdAt: string;
    description: string;
  }[];
  jobDetail: string;
}

interface EducationHistory {
  id: string;
  createdAt: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  major: string;
  educationLevel: string;
  startDate: string;
  endDate: string;
}

interface WorkHistory {
  id: string;
  createdAt: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  jobDescription: string;
}

interface Skill {
  id: string;
  createdAt: string;
  skillName: string;
  proficiencyLevel: string;
  noOfYears: number;
}

interface QuestionAnswer {
  id: string;
  createdAt: string;
  questionOption: QuestionOption;
  answer: string;
  questionType: string;
}

interface JobDetail {
  id: string;
  createdAt: string;
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  jobLocation: string;
  jobSalary: number;
  status: string;
  jobType: string;
  companyName: string;
  workMode: string;
  startDate: string;
  endDate: string;
  questionOptions: QuestionOption[];
  requiredSkills: {
    id: string;
    createdAt: string;
    description: string;
  }[];
}

export interface Candidate {
  id: string;
  createdAt: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  countryName: string;
  city: string;
  state: string;
  educationHistories: EducationHistory[];
  workHistories: WorkHistory[];
  skills: Skill[];
  questionAnswers: QuestionAnswer[];
  resume: string;
  coverLetter: string;
  yearsOfExperience: number;
  jobDetail: JobDetail;
  status: string;
  scheduledDate: string;
}
