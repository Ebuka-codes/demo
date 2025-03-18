import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { job } from 'src/app/shared/type';
import { Moment } from 'moment';

import { DateFormatService } from 'src/app/shared/service/date-format.service';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  educationLevels,
  months,
  nigeriaStates,
} from 'src/app/shared/constants';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/shared/service/toast.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class ApplyComponent implements OnInit {
  @ViewChild('resumeInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('matSelectPanel') matSelectPanel!: ElementRef;
  @ViewChild('deleteIcon') deleteIcon!: ElementRef<SVGAElement>;
  @ViewChild('listItem') listItem!: ElementRef<HTMLUListElement>;
  personalFormGroup!: FormGroup;
  questionsFormGroup!: FormGroup;
  educationFormGroup!: FormGroup;
  workFormGroup!: FormGroup;
  skillFormGroup!: FormGroup;
  supportingFormGroup!: FormGroup;
  isSubmitting: boolean = false;
  selectedResumeFile!: string | null;
  selectedCoverLetterFile!: string | null;
  isLoading!: Observable<any>;
  isLoadingQuestion: boolean = false;
  data!: job;
  editId!: number;
  candidateEmail: string | null = '';
  workHistories: any[] = [];
  educationHistories: any[] = [];
  skillHisories: any[] = [];
  selectedYear: number | null = null;
  formControls: any = {};
  resumeValue: any;
  coverLetterValue: any;
  nigeriaStates = nigeriaStates;
  educationLevels = educationLevels;
  isEditModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private jobService: JobRecruitService,
    private route: ActivatedRoute,
    private dateFormatPicker: DateFormatService,
    private location: Location,
    private toastService: ToastService
  ) {
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

    this.workFormGroup = this.fb.group({
      companyName: [''],
      jobTitle: [''],
      startDate: [''],
      endDate: [''],
      jobDescription: [''],
    });
    this.educationFormGroup = this.fb.group({
      degree: [''],
      major: [''],
      institutionName: [''],
      startDate: [''],
      endDate: [''],
      fieldOfStudy: [''],
      educationLevel: [''],
    });
    this.skillFormGroup = this.fb.group({
      skillName: [''],
      proficiencyLevel: [''],
      noOfYears: [''],
    });
    this.supportingFormGroup = this.fb.group({
      resume: [''],
      coverLetter: [''],
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.jobService.setLoading(true);
      this.isLoading = this.jobService.isLoading$;
      this.jobService
        .getCandidatesInfo(this.route.snapshot.paramMap.get('id'))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.data = response.data;
              this.personalFormGroup.patchValue({
                firstName: response.data.name.split(' ')[0],
                lastName: response.data.name.split(' ')[1],
                email: response.data.email,
                phone: response.data.phone,
                countryName: response.data.countryName,
                state: response.data.state,
                address: response.data.address,
                city: response.data.city,
              });
            }
            this.jobService.setLoading(false);
            this.isLoading = this.jobService.isLoading$;
          },
          error: () => {
            this.toastService.error('Error occur');
            this.jobService.setLoading(false);
            this.isLoading = this.jobService.isLoading$;
          },
        });
    }

    this.getQuestions();
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

  onMonthYearWorkSelect(
    event: Moment,
    formControlName: string,
    datePicker: MatDatepicker<Moment>
  ) {
    this.dateFormatPicker.setMonthAndYear(
      this.workFormGroup,
      formControlName,
      event,
      datePicker
    );
  }

  onMonthYearEductionSelect(
    event: Moment,
    formControlName: string,
    datePicker: MatDatepicker<Moment>
  ) {
    this.dateFormatPicker.setMonthAndYear(
      this.educationFormGroup,
      formControlName,
      event,
      datePicker
    );
  }

  addWorkHistory() {
    const startDateValue = this.workFormGroup.get('startDate')?.value;
    const endDateValue = this.workFormGroup.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const data = {
      companyName: this.workFormGroup.get('companyName')?.value,
      jobTitle: this.workFormGroup.get('jobTitle')?.value,
      startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-01`,
      endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-01`,
      jobDescription: this.workFormGroup.get('jobDescription')?.value,
    };
    if (this.editId >= 0 && this.editId < this.workHistories.length) {
      this.workHistories[this.editId] = {
        ...this.workHistories[this.editId],
        ...data,
      };
    } else {
      this.workHistories.push(data);
    }
    this.editId = -1;

    this.resetWorkHistoryForm();
  }
  showWorkHistoryModal() {
    this.isEditModalOpen = false;
  }
  removeWorkHistory(index: number): void {
    this.workHistories.splice(index, 1);
  }
  resetWorkHistoryForm() {
    this.workFormGroup.get('companyName')?.reset();
    this.workFormGroup.get('jobTitle')?.reset();
    this.workFormGroup.get('startDate')?.reset();
    this.workFormGroup.get('endDate')?.reset();
    this.workFormGroup.get('jobDescription')?.reset();
  }

  handleEditWorkHistory(id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      const workHistoryModal =
        Modal.getInstance(
          document.getElementById('workHistoryModal') as HTMLDivElement
        ) ||
        new Modal(
          document.getElementById('workHistoryModal') as HTMLDivElement
        );
      workHistoryModal?.show();

      const backdrop = document.querySelector('.modal-backdrop');
      backdrop?.classList.add('show');

      this.editId = id;
      const workHistory = this.workHistories[id];
      if (workHistory) {
        this.workFormGroup.setValue(workHistory);
      }
      this.isEditModalOpen = true;
    }
  }

  addEducationHistory() {
    const startDateValue = this.educationFormGroup.get('startDate')?.value;
    const endDateValue = this.educationFormGroup.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const data = {
      degree: this.educationFormGroup.get('degree')?.value,
      major: this.educationFormGroup.get('major')?.value,
      institutionName: this.educationFormGroup.get('institutionName')?.value,
      startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-01`,
      endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-01`,
      fieldOfStudy: this.educationFormGroup.get('fieldOfStudy')?.value,
      educationLevel: this.educationFormGroup.get('educationLevel')?.value,
    };

    if (this.editId >= 0 && this.editId < this.educationHistories.length) {
      this.educationHistories[this.editId] = {
        ...this.workHistories[this.editId],
        ...data,
      };
    } else {
      this.educationHistories.push(data);
    }
    this.editId = -1;
    this.resetEducationHistoryForm();
  }
  removeEducationHistory(index: number): void {
    this.educationHistories.splice(index, 1);
  }
  showEducationModal() {
    this.isEditModalOpen = false;
  }

  handleEditEducation(id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      const educationModal =
        Modal.getInstance(
          document.getElementById('educationHistoryModal') as HTMLDivElement
        ) ||
        new Modal(
          document.getElementById('educationHistoryModal') as HTMLDivElement
        );
      educationModal?.show();

      const backdrop = document.querySelector('.modal-backdrop');
      backdrop?.classList.add('show');
      this.editId = id;
      const educationHistory = this.educationHistories[id];
      if (educationHistory) {
        this.educationFormGroup.setValue(educationHistory);
      }
      this.isEditModalOpen = true;
    }
  }

  resetEducationHistoryForm() {
    this.educationFormGroup.get('degree')?.reset(),
      this.educationFormGroup.get('major')?.reset(),
      this.educationFormGroup.get('institutionName')?.reset(),
      this.educationFormGroup.get('startDate')?.reset(),
      this.educationFormGroup.get('endDate')?.reset(),
      this.educationFormGroup.get('fieldOfStudy')?.reset(),
      this.educationFormGroup.get('educationLevel')?.reset();
  }

  removeSkills(index: number) {
    this.skillHisories.splice(index, 1);
  }

  addSkillHistory() {
    const data = {
      skillName: this.skillFormGroup.get('skillName')?.value,
      proficiencyLevel: this.skillFormGroup.get('proficiencyLevel')?.value,
      noOfYears: Number(this.skillFormGroup.get('noOfYears')?.value),
    };

    if (this.editId >= 0 && this.editId < this.skillHisories.length) {
      this.skillHisories[this.editId] = {
        ...this.skillHisories[this.editId],
        ...data,
      };
    } else {
      this.skillHisories.push(data);
    }
    this.editId = -1;
    this.resetSkillForm();
  }
  handleEditSkill(id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      const skillModal =
        Modal.getInstance(
          document.getElementById('skillModal') as HTMLDivElement
        ) || new Modal(document.getElementById('skillModal') as HTMLDivElement);
      skillModal?.show();
      const backdrop = document.querySelector('.modal-backdrop');
      backdrop?.classList.add('show');
      this.editId = id;

      const skillHistory = this.skillHisories[id];
      console.log(skillHistory);
      if (skillHistory) {
        this.skillFormGroup.setValue(skillHistory);
      }
      this.isEditModalOpen = true;
    }
  }
  showSkillModal() {
    this.isEditModalOpen = false;
  }

  resetSkillForm() {
    this.skillFormGroup.get('skillName')?.reset(),
      this.skillFormGroup.get('proficiencyLevel')?.reset();
    this.skillFormGroup.get('noOfYears')?.reset();
  }
  endDateFilter(date: Date | null): boolean {
    return this.workFormGroup.get('startDate')?.value
      ? date! >= this.workFormGroup.get('startDate')?.value
      : false;
  }

  formatDate(value: string) {
    const date = new Date(value);
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
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
      this.convertResumeToBase64(file, file.name);
      input.value = '';
    }
  }
  onCoverLetterFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedCoverLetterFile = file.name;
      this.convertCoverLetterFileToBase64(file, file.name);
      input.value = '';
    }
  }
  convertResumeToBase64(file: File, name: string): void {
    this.jobService.setLoading(true);
    this.isLoading = this.jobService.isLoading$;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.jobService.convertFileToBase64(data).subscribe(
        (response: any) => {
          if (response.valid && response.data) {
            this.resumeValue = response.data;
            this.jobService.setLoading(false);
          }
        },
        (err) => {
          this.toastService.error('Error occur');
          this.selectedResumeFile = '';
          this.jobService.setLoading(false);
        }
      );
    };
  }
  convertCoverLetterFileToBase64(file: File, name: string): void {
    this.jobService.setLoading(true);
    this.isLoading = this.jobService.isLoading$;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.jobService.convertFileToBase64(data).subscribe(
        (response: any) => {
          if (response.valid && response.data) {
            this.coverLetterValue = response.data;
            this.jobService.setLoading(false);
          }
        },
        (err) => {
          this.toastService.error('Error occur');
          this.selectedCoverLetterFile = '';
          this.jobService.setLoading(false);
        }
      );
    };
  }

  handleRemoveResumeFile(): void {
    this.selectedResumeFile = null;
    this.resumeValue = '';
  }
  handleRemoveCoverLetter(): void {
    this.selectedCoverLetterFile = null;
    this.coverLetterValue = '';
  }

  getQuestions() {
    let formControls: any = {};
    this.data?.questionOptions.forEach((question: any) => {
      formControls[question.id] = new FormControl('');
    });
    this.questionsFormGroup = this.fb.group(formControls);
  }
  //Post Job-Application
  submitJobApplication(jobApplication: any) {
    this.jobService.setLoading(true);
    this.isLoading = this.jobService.getLoading();
    this.isSubmitting = true;

    this.jobService.submitJobApplication(jobApplication).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.personalFormGroup.reset();
        this.educationFormGroup.reset();
        this.workFormGroup.reset();
        this.skillFormGroup.reset();
        this.questionsFormGroup.reset();
        this.supportingFormGroup.reset();
        this.skillHisories = [];
        this.workHistories = [];
        this.educationHistories = [];
        this.selectedResumeFile = null;
        this.selectedCoverLetterFile = null;
        this.jobService.setLoading(false);
        this.isLoading = this.jobService.getLoading();
        this.toastService.success('Submitted successfully!');
        setTimeout(() => {
          this.location.back();
        }, 3000);
      },
      error: () => {
        this.toastService.error('Error occur');
        this.isSubmitting = false;
        this.jobService.setLoading(false);
        this.isLoading = this.jobService.getLoading();
      },
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
      questionOptionAnswersDTO: questionOption ? questionOption : [],
      resume: this.resumeValue ? this.resumeValue.path : '',
      coverLetter: this.coverLetterValue ? this.coverLetterValue.path : '',
      jobDetailId: localStorage.getItem('JobId'),
    };
    this.submitJobApplication(data);
  }
}
