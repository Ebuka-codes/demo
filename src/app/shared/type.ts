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
  questionOptions: string[];
  options: Array<optionType>;
  requiredSkills: string[];
}

export interface optionType {
  id: string;
  code: string;
  description: string;
  questionType: string;
  options: [];
}
