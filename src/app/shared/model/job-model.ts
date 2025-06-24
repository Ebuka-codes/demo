export interface KeyValuePair {
  key: string;
  value: any;
}

export interface JobApplication {
  id: string;
  personalInfo: PersonalInfo[];
  educationHistories: EducationHistory[];
  workHistories: WorkHistory[];
  skills: Skill[];
  questionOptionAnswersDTO: QuestionOptionAnswer[];
  resume: string;
  coverLetter: string;
  yearsOfExperience: number;
  jobDetailId: string;
  jobDetail: [];
}

export interface PersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  countryName: string;
  city: string;
  state: string;
  workMode: string;
}

export interface EducationHistory {
  institutionName: string;
  degree: string;
  major: string;
  educationLevel: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface WorkHistory {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  startDate: string;
  endDate: string;
}
export interface Skill {
  skillName: string;
  proficiencyLevel: string;
  noOfYears: number;
}
interface QuestionOptionAnswer {
  questionOptionId: string;
  answer: string;
}
