import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('modal1', { static: false }) modal1Element!: ElementRef;
  @ViewChild('modal2', { static: false }) modal2Element!: ElementRef;
  @ViewChild('modal3', { static: false }) modal3Element!: ElementRef;
  private modals: { [key: number]: Modal } = {};

  personalFormGroup!: FormGroup;
  questionsFormGroup!: FormGroup;
  educationFormGroup!: FormGroup;
  workFormGroup!: FormGroup;
  skillFormGroup!: FormGroup;
  supportingFormGroup!: FormGroup;
  workEducationAndSkill!: FormGroup;
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
  workErrorMessage = '';
  educationErrorMessage = '';
  submitted: boolean = false;
  questionData!: job;
  jobId: string | null = localStorage.getItem('JobId');

  constructor(
    private fb: FormBuilder,
    private jobService: JobRecruitService,
    private route: ActivatedRoute,
    private dateFormatPicker: DateFormatService,
    private location: Location,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private routes: Router
  ) {
    this.personalFormGroup = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, this.ValidateEmail()]],
      phone: ['', [Validators.required, this.validatePhone()]],
      countryName: ['', [Validators.required]],
      state: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      linkedinProfile: [''],
    });

    this.workEducationAndSkill = this.fb.group({
      stepCheck: [
        '',
        () =>
          this.atLeastOneFillValidator(
            this.workHistories,
            this.educationHistories
          ),
      ],
    });
    this.workFormGroup = this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });
    this.educationFormGroup = this.fb.group({
      degree: ['', Validators.required],
      major: ['', Validators.required],
      institutionName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      educationLevel: ['', Validators.required],
    });
    this.skillFormGroup = this.fb.group({
      skillName: ['', Validators.required],
      proficiencyLevel: ['', Validators.required],
      noOfYears: ['', Validators.required],
    });
    this.supportingFormGroup = this.fb.group({
      resume: ['', Validators.required],
      coverLetter: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCandidateInfo();
    this.getQuestionsByJobDetail(this.jobId);
  }

  ngAfterViewInit() {
    this.modals[1] = new Modal(this.modal1Element?.nativeElement);
    this.modals[2] = new Modal(this.modal2Element?.nativeElement);
    this.modals[3] = new Modal(this.modal3Element?.nativeElement);
  }

  getCandidateInfo() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.jobService.setLoading(true);
      this.isLoading = this.jobService.isLoading$;
      this.jobService
        .getCandidatesInfo(this.route.snapshot.paramMap.get('id'))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              const { name, email, phone, countryName, state, address, city } =
                response.data;
              this.personalFormGroup.patchValue({
                firstName: name?.split(' ')[0] || '',
                lastName: name?.split(' ')[1] || '',
                email,
                phone,
                countryName,
                state,
                address,
                city,
              });
            }
            this.jobService.setLoading(false);
            this.isLoading = this.jobService.isLoading$;

            this.personalFormGroup.updateValueAndValidity();
            this.cdr.detectChanges();
          },
          error: () => {
            this.toastService.error('Error occur');
            this.jobService.setLoading(false);
            this.isLoading = this.jobService.isLoading$;
          },
        });
    }
  }

  get firstName() {
    return this.personalFormGroup.get('firstName');
  }

  get lastName() {
    return this.personalFormGroup.get('lastName');
  }

  get email() {
    return this.personalFormGroup.get('email');
  }

  get phone() {
    return this.personalFormGroup.get('phone');
  }

  get countryName() {
    return this.personalFormGroup.get('countryName');
  }

  get state() {
    return this.personalFormGroup.get('state');
  }

  get address() {
    return this.personalFormGroup.get('address');
  }

  get city() {
    return this.personalFormGroup.get('city');
  }

  get companyName() {
    return this.workFormGroup.get('companyName');
  }

  get jobTitle() {
    return this.workFormGroup.get('jobTitle');
  }

  get startDate() {
    return this.workFormGroup.get('startDate');
  }

  get endDate() {
    return this.workFormGroup.get('endDate');
  }

  get jobDescription() {
    return this.workFormGroup.get('jobDescription');
  }

  get degree() {
    return this.educationFormGroup.get('degree');
  }

  get major() {
    return this.educationFormGroup.get('major');
  }

  get institutionName() {
    return this.educationFormGroup.get('institutionName');
  }

  get educationStartDate() {
    return this.educationFormGroup.get('startDate');
  }

  get educationEndDate() {
    return this.educationFormGroup.get('endDate');
  }

  get schoolStartDate() {
    return this.educationFormGroup.get('startDate');
  }

  get schoolEndDate() {
    return this.educationFormGroup.get('endDate');
  }

  get fieldOfStudy() {
    return this.educationFormGroup.get('fieldOfStudy');
  }

  get educationLevel() {
    return this.educationFormGroup.get('educationLevel');
  }

  get skillName() {
    return this.skillFormGroup.get('skillName');
  }

  get proficiencyLevel() {
    return this.skillFormGroup.get('proficiencyLevel');
  }

  get noOfYears() {
    return this.skillFormGroup.get('noOfYears');
  }

  get resume() {
    return this.supportingFormGroup.get('resume');
  }

  get coverLetter() {
    return this.supportingFormGroup.get('coverLetter');
  }

  goToNextStep() {
    if (this.personalFormGroup.valid) {
      this.stepper.next();
    } else {
      this.personalFormGroup.markAllAsTouched();
    }
  }

  goToNextStep2() {
    if (this.workEducationAndSkill.valid) {
      this.stepper.next();
    } else {
      this.educationErrorMessage = 'Please add education history';
      this.workErrorMessage = 'Please add work history';
    }
  }

  validatePhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const valid = /^\+?\d{11}$/.test(control.value);
      return valid ? null : { invalidPhone: control.value };
    };
  }
  ValidateEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const valid = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/.test(
        control.value
      );
      return valid ? null : { invalidEmail: control.value };
    };
  }
  atLeastOneFillValidator(
    workHistory: any[],
    educationHistory: any[]
  ): ValidationErrors | null {
    return workHistory.length > 0 && educationHistory.length
      ? null
      : { required: true };
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

  openModal(modalNumber: number) {
    this.modals[modalNumber].show();
  }
  closeModal(modalNumber: number) {
    this.modals[modalNumber].hide();
    this.removeBackdrop();
    this.workFormGroup.reset();
    this.educationFormGroup.reset();
    this.skillFormGroup.reset();
    this.isEditModalOpen = false;
    this.workFormGroup.markAsUntouched();
    this.educationFormGroup.markAsUntouched();
    this.skillFormGroup.markAsUntouched();
  }
  removeBackdrop() {
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
      document.body.classList.remove('.modal-open');
    }, 300);
  }
  addWorkHistory(id: number) {
    const startDateValue = this.workFormGroup.get('startDate')?.value;
    const endDateValue = this.workFormGroup.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    if (this.workFormGroup.valid) {
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
        this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
      } else {
        this.workHistories.push(data);
        this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
      }
      this.editId = -1;
      this.closeModal(id);
    } else {
      this.workFormGroup.markAllAsTouched();
    }
  }

  removeWorkHistory(index: number): void {
    this.workHistories.splice(index, 1);
    this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
  }
  resetWorkHistoryForm() {
    this.workFormGroup.reset();
  }

  handleEditWorkHistory(modalId: number, id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      this.editId = id;
      const workHistory = this.workHistories[id];
      if (workHistory) {
        this.workFormGroup.setValue(workHistory);
      }
      this.isEditModalOpen = true;
    }
    this.openModal(modalId);
  }

  addEducationHistory(id: number) {
    const startDateValue = this.educationFormGroup.get('startDate')?.value;
    const endDateValue = this.educationFormGroup.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (this.educationFormGroup.valid) {
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

        this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
      } else {
        this.educationHistories.push(data);
        this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
      }
      this.editId = -1;
      this.closeModal(id);
    } else {
      this.educationFormGroup.markAllAsTouched();
    }
  }
  removeEducationHistory(index: number): void {
    this.educationHistories.splice(index, 1);
    this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
  }

  handleEditEducation(modalId: number, id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      this.editId = id;
      const educationHistory = this.educationHistories[id];
      if (educationHistory) {
        this.educationFormGroup.setValue(educationHistory);
      }
      this.openModal(modalId);
      this.isEditModalOpen = true;
    }
  }

  resetEducationHistoryForm() {
    this.educationFormGroup.reset();
  }

  addSkillHistory(id: number) {
    if (this.skillFormGroup.valid) {
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
      this.closeModal(id);
    } else {
      this.skillFormGroup.markAllAsTouched();
    }
  }
  handleEditSkill(modalId: number, id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      this.editId = id;
      const skillHistory = this.skillHisories[id];
      if (skillHistory) {
        this.skillFormGroup.setValue(skillHistory);
      }
      this.isEditModalOpen = true;
      this.openModal(modalId);
    }
  }
  resetSkillForm() {
    this.skillFormGroup.reset();
  }

  removeSkills(index: number) {
    this.skillHisories.splice(index, 1);
  }

  preventInvalidKeys(event: KeyboardEvent) {
    if (
      event.key === '0' ||
      event.key === 'e' ||
      event.key === 'E' ||
      event.key === '+' ||
      event.key === '-'
    ) {
      event.preventDefault();
      event.preventDefault();
    }
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
      this.jobService.convertFileToBase64(data).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.resumeValue = response.data;
            this.supportingFormGroup
              .get('resume')
              ?.setValue(response.data.path);
            this.jobService.setLoading(false);
          }
        },
        error: (err: any) => {
          this.toastService.error('Error occur');
          this.selectedResumeFile = '';
          this.jobService.setLoading(false);
        },
      });
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
            this.supportingFormGroup
              .get('coverLetter')
              ?.setValue(response.data.path);
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
    this.supportingFormGroup.get('resume')?.setValue('');
    this.selectedResumeFile = '';
  }
  handleRemoveCoverLetter(): void {
    this.supportingFormGroup.get('coverLetter')?.setValue('');
    this.selectedCoverLetterFile = '';
  }
  getQuestionsByJobDetail(id: string | null) {
    this.jobService.setLoading(true);
    this.isLoading = this.jobService.isLoading$;
    this.jobService.getJobDetails(id).subscribe((response: any) => {
      if (response.valid && response.data) {
        this.jobService.setLoading(false);
        this.isLoading = this.jobService.isLoading$;
        this.questionData = response.data;
        let formControl: any = {};
        this.questionData.questionOptions.forEach((question: any) => {
          formControl[question.id] = new FormControl('', Validators.required);
          this.questionsFormGroup = this.fb.group(formControl);
        });
      }
    });
  }
  preventInvalidKey(event: KeyboardEvent) {
    if (
      event.key === '0' ||
      event.key === 'e' ||
      event.key === 'E' ||
      event.key === '+' ||
      event.key === '-'
    ) {
      event.stopPropagation();
      event.preventDefault();
    }
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
        this.supportingFormGroup.reset();
        this.questionsFormGroup?.reset();
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
        answer: String(formValues[key]),
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
      resume: this.supportingFormGroup.get('resume')?.value,
      coverLetter: this.supportingFormGroup.get('coverLetter')?.value,
      jobDetailId: localStorage.getItem('JobId'),
    };
    if (
      this.personalFormGroup.valid &&
      this.workEducationAndSkill.valid &&
      this.supportingFormGroup.valid &&
      (this.questionData?.questionOptions.length === 0 ||
        this.questionsFormGroup.valid)
    ) {
      this.submitJobApplication(data);
    } else {
      this.submitted = true;
      this.questionsFormGroup.markAllAsTouched();
    }
  }
}
