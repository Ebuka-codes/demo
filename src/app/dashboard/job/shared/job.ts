export interface job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  jobLocation: string;
  jobSalary: number;
  jobStatus: string;
  jobType: string;
  startDate: string;
  endDate: string;
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

export interface KeyValuePair {
  key: string;
  value: any;
}
