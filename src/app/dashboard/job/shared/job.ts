export interface job {
  id: string;
  jobTitle: string;
  jobId: string;
  jobDescription: string;
  employmentType: string;
  jobLocation: string;
  jobSalary: number;
  jobSalaryTo: number;
  status: string;
  jobType: string;
  startDate: string;
  endDate: string;
  companyName: string;
  workMode: string;
  questionOptions: Array<optionType>;
  requiredSkills: Array<skillOption>;
  createdAt: string;
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
  isQualifyQuestion: boolean;
}
export interface QuestionTypeOptions {
  id: string;
  description: string;
}

export interface Question {
  questionOptions: Array<optionType>;
  options: QuestionTypeOptions[];
  isQualifyQuestion: boolean;
  operator: 'GREATER' | string;
  qualifyValue: string;
}

export interface DetailsType {
  id?: string;
  description: string;
  type: string;
}
export interface skillOption {
  id: string;
  createdAt: string;
  description: string;
  type: string;
}
export interface KeyValuePair {
  key: string;
  value: any;
}

export interface jobFilterPayload {
  jobType?: string;
  workMode?: string;
  status?: string;
}
