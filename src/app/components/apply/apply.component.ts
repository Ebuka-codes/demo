import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { jobType } from 'src/app/shared/type';
import { Notyf } from 'notyf';
@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],

  providers: [],
})
export class ApplyComponent implements OnInit {
  @ViewChild('resumeInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stepper') stepper!: MatStepper;
  personalFormGroup!: FormGroup;
  questionsFormGroup!: FormGroup;
  experienceFormGroup!: FormGroup;
  supportingFormGroup!: FormGroup;
  isSubmitting: boolean = false;
  selectedResumeFile!: string | null;
  selectedCoverLetterFile!: string | null;
  isLoading: boolean = false;
  isLoadingQuestion: boolean = false;
  data!: jobType;
  id: string | null = '';
  candidateEmail: string | null = '';
  workHistories: any[] = [];
  educationHistories: any[] = [];
  skillHisories: any[] = [];
  selectedYear: number | null = null;
  formControls: any = {};
  resumeValue: string = '';
  coverLetterValue: string = '';
  //prettier-ignore
  months: string[] = ['January','February','March','April','May','June','July','August','September','October','November','December',
  ];
  //prettier-ignore
  educationLevels: string[] = ["High School","Associate Degree","Bachelor's Degree","Master's Degree","Doctorate (PhD)","Diploma", "Certificate", "Postgraduate Diploma"
  ];
  //prettier-ignore
  nigeriaStates: string[] = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", 
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
    "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory (FCT)"
  ];
  private notyf = new Notyf();
  constructor(private fb: FormBuilder, private _jobService: JobRecruitService) {
    this.personalFormGroup = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      countryName: [''],
      state: [''],
      address: [''],
      city: [''],
      linkedinProfile: [''],
    });

    this.experienceFormGroup = this.fb.group({
      companyName: [''],
      jobTitle: [''],
      startDate: [''],
      endDate: [''],
      jobDescription: [''],
      degree: [''],
      major: [''],
      institutionName: [''],
      schoolStartDate: [''],
      schoolEndDate: [''],
      fieldOfStudy: [''],
      educationLevel: [''],
      skillName: [''],
      proficiencyLevel: [''],
      yearsOfExperience: [''],
    });
    this.supportingFormGroup = this.fb.group({
      resume: [''],
      coverLetter: [''],
    });
  }

  ngOnInit(): void {
    this.id = this._jobService.getJobDetailId();
    this.isLoadingQuestion = true;
    this._jobService.getJobDetailsById(this.id).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.data = response.data;
          this.isLoadingQuestion = false;
          this.getQuestions();
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
    this.getCandidateInfo();
  }

  validatePhone(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^\+?\d{0,10}$/.test(value);
      return valid ? null : { invalidPhone: { value: control.value } };
    };
  }
  ValidateEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/.test(
        value
      );
      return valid ? null : { invalidEmail: control.value };
    };
  }

  getQuestions() {
    let formControls: any = {};
    this.data.questionOptions.forEach((question: any) => {
      formControls[question.id] = new FormControl('');
    });
    this.questionsFormGroup = this.fb.group(formControls);
  }
  addWorkHistory() {
    const startDateValue = this.experienceFormGroup.get('startDate')?.value;
    const endDateValue = this.experienceFormGroup.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const data = {
      companyName: this.experienceFormGroup.get('companyName')?.value,
      jobTitle: this.experienceFormGroup.get('jobTitle')?.value,
      startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
      endDate: `${startDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`,
      jobDescription: this.experienceFormGroup.get('jobDescription')?.value,
    };
    this.workHistories.push(data);
    this.resetWorkHistoryForm();
  }
  removeWorkHistory(index: number): void {
    this.workHistories.splice(index, 1);
  }
  resetWorkHistoryForm() {
    this.experienceFormGroup.get('companyName')?.reset();
    this.experienceFormGroup.get('jobTitle')?.reset();
    this.experienceFormGroup.get('startDate')?.reset();
    this.experienceFormGroup.get('endDate')?.reset();
    this.experienceFormGroup.get('jobDescription')?.reset();
  }

  addEducationHistory() {
    const startDateValue =
      this.experienceFormGroup.get('schoolStartDate')?.value;
    const endDateValue = this.experienceFormGroup.get('schoolEndDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const data = {
      degree: this.experienceFormGroup.get('degree')?.value,
      major: this.experienceFormGroup.get('major')?.value,
      institutionName: this.experienceFormGroup.get('institutionName')?.value,
      startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
      endDate: `${startDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`,

      fieldOfStudy: this.experienceFormGroup.get('fieldOfStudy')?.value,
      educationLevel: this.experienceFormGroup.get('educationLevel')?.value,
    };
    this.educationHistories.push(data);
    this.resetEducationHistoryForm();
  }
  removeEducationHistory(index: number): void {
    this.educationHistories.splice(index, 1);
  }
  resetEducationHistoryForm() {
    this.experienceFormGroup.get('degree')?.reset(),
      this.experienceFormGroup.get('major')?.reset(),
      this.experienceFormGroup.get('institutionName')?.reset(),
      this.experienceFormGroup.get('schoolStartDate')?.reset(),
      this.experienceFormGroup.get('schoolEndDate')?.reset(),
      this.experienceFormGroup.get('fieldOfStudy')?.reset(),
      this.experienceFormGroup.get('educationLevel')?.reset();
  }

  removeSkills(index: number) {
    this.skillHisories.splice(index, 1);
  }

  addSkillHistory() {
    const data = {
      skillName: this.experienceFormGroup.get('skillName')?.value,
      proficiencyLevel: this.experienceFormGroup.get('proficiencyLevel')?.value,
      noOfYears: Number(
        this.experienceFormGroup.get('yearsOfExperience')?.value
      ),
    };
    this.skillHisories.push(data);
    this.resetSkillForm();
  }
  resetSkillForm() {
    this.experienceFormGroup.get('skillName')?.reset(),
      this.experienceFormGroup.get('proficiencyLevel')?.reset();
    this.experienceFormGroup.get('yearsOfExperience')?.reset();
  }

  formatMonth(value: string) {
    const date = new Date(value);
    return `${this.months[date.getMonth()]} ${date.getFullYear()}`;
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  triggerCoverInput() {
    this.coverInput.nativeElement.click();
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedResumeFile = file.name;
      this.convertFillToBase64(file, file.name);
      input.value = '';
    }
  }
  onCoverLetterFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedCoverLetterFile = file.name;
    }
  }
  handleRemoveResumeFile(): void {
    this.selectedResumeFile = null;
    this.personalFormGroup.patchValue({ resumeFile: null });
    this.personalFormGroup.get('resumeFile')?.updateValueAndValidity();
  }
  handleRemoveCoverLetter(): void {
    this.selectedCoverLetterFile = null;
    this.personalFormGroup.patchValue({ coverLetter: null });
    this.personalFormGroup.get('coverLetter')?.updateValueAndValidity();
  }

  convertFillToBase64(file: File, name: string): void {
    console.log(file, file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this._jobService.convertFileToBase64(data).subscribe(
        (response: any) => {
          if (response.valid && response.data) {
          }
        },
        (err) => {}
      );
    };
  }

  //Post Job-Application

  submitJobApplication(jobApplication: any) {
    this.isLoading = true;
    this._jobService.submitJobApplication(jobApplication).subscribe({
      next: () => {
        this.notyf.success({
          message: 'Submitted successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.isLoading = false;
        this.personalFormGroup.reset();
        this.experienceFormGroup.reset();
        this.questionsFormGroup.reset();
        this.supportingFormGroup.reset();
        this.skillHisories = [];
        this.workHistories = [];
        this.educationHistories = [];
        this.selectedResumeFile = null;
        this.selectedCoverLetterFile = null;
      },
      error: (error) => {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.isLoading = false;
      },
    });
  }
  getCandidateInfo() {
    this.candidateEmail = this._jobService.getCandidateEmail();
    this._jobService
      .getCandidateInfo(this.candidateEmail)
      .subscribe((candidateDate) => {
        if (candidateDate.valid && candidateDate.data) {
          const fullName = candidateDate.data?.name?.split(' ');
          this.personalFormGroup.patchValue({
            ...candidateDate.data,
            firstName: fullName[0],
            lastName: fullName[1],
          });
        } else {
          this.notyf.error({
            message: 'Error occur!',
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
        }
      });
  }
  onSubmit(): void {
    const formValues = this.questionsFormGroup?.value;
    let questionOption;
    if (formValues) {
      questionOption = Object.keys(formValues).map((key) => ({
        questionOptionId: key,
        answer: formValues[key],
      }));
    }
    const data = {
      name: `${this.personalFormGroup.get('firstName')?.value} ${
        this.personalFormGroup.get('lastName')?.value
      }`,
      address: this.personalFormGroup.get('address')?.value,
      phone: this.personalFormGroup.get('phone')?.value,
      email: this.personalFormGroup.get('email')?.value,
      countryName: this.personalFormGroup.get('countryName')?.value,
      city: this.personalFormGroup.get('city')?.value,
      state: this.personalFormGroup.get('state')?.value,
      educationHistories: this.educationHistories,
      workHistories: this.workHistories,
      skills: this.skillHisories,
      questionOptionAnswersDTO: questionOption,
      resume: this.supportingFormGroup.get('resume')?.value,
      coverLetter: this.supportingFormGroup.get('coverLetter')?.value,
    };
    this.submitJobApplication(data);
  }
}
