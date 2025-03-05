export interface jobType {
  id: string;
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  jobLocation: string;
  jobSalary: number;
  jobStatus: string;
  jobType: string;
  companyName: string;
  workMode: string;
  questionOptions: Array<optionType>;
  requiredSkills: string[];
}
export interface optionType {
  id: string;
  code: string;
  description: string;
  questionType: string;
  options: [
    {
      id: string;
      description: string;
    }
  ];
}

export interface Corporate {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  code: string;
  hmCode: string;
}
export interface DetailsType {
  id?: string;
  description: string;
  type: string;
}

export interface KeyValuePair {
  key: string;
  value: any;
}
export interface QuestionTypeOptions {
  id?: string;
  description: string;
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

interface EducationHistory {
  institutionName: string;
  degree: string;
  major: string;
  educationLevel: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface WorkHistory {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  startDate: string;
  endDate: string;
}
interface Skill {
  skillName: string;
  proficiencyLevel: string;
  noOfYears: number;
}
interface QuestionOptionAnswer {
  questionOptionId: string;
  answer: string;
}
export interface file {
  base64String: 'string';
  fileName: 'string';
}
export interface CandidateInfo {
  id: string;
  name: string;
  createdAt: string;
  address: string;
  phone: string;
  email: string;
  countryName: string;
  city: string;
  state: string;
  resume: string;
  coverLetter: string;

  jobDetail: {
    jobTitle: string;
    workMode: string;
    jobType: string;
    employmentType: string;
  };
}
