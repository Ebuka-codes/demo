import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  Input,
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
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { Moment } from 'moment';
import { DateFormatService } from 'src/app/shared/service/date-format.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { Modal } from 'bootstrap';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import { CandidateService } from 'src/app/shared/service/candidate.service';
import { Candidate } from 'src/app/dashboard/candidate/shared/candidate';
import { ToastService } from 'src/app/core/service/toast.service';
import { UtilService } from 'src/app/core/service/util.service';
import { CORP_URL_KEY, JOB_ID_KEY } from 'src/app/core/model/credential';
import {
  educationLevels,
  months,
  nigeriaStates,
} from 'src/app/shared/model/constants';
import { job, Question } from 'src/app/dashboard/job/shared/job';
import {
  EducationHistory,
  Skill,
  WorkHistory,
} from 'src/app/shared/model/job-model';
@Component({
  selector: 'erecruit-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class JobApplicationComponent implements OnInit {
  @ViewChild('resumeInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('matSelectPanel') matSelectPanel!: ElementRef;
  @ViewChild('deleteIcon') deleteIcon!: ElementRef<SVGAElement>;
  @ViewChild('listItem') listItem!: ElementRef<HTMLUListElement>;
  @ViewChild('modal1', { static: false }) modal1Element!: ElementRef;
  @ViewChild('modal2', { static: false }) modal2Element!: ElementRef;
  @ViewChild('modal3', { static: false }) modal3Element!: ElementRef;
  @Input() jobData!: any;
  private modals: { [key: number]: Modal } = {};
  personalFormGroup!: FormGroup;
  questionsFormGroup!: FormGroup;
  educationFormGroup!: FormGroup;
  workFormGroup!: FormGroup;
  skillFormGroup!: FormGroup;
  supportingFormGroup!: FormGroup;
  workEducationAndSkill!: FormGroup;
  isSubmitting!: boolean;
  selectedResumeFile!: string | null;
  selectedCoverLetterFile!: string | null;
  isLoading$!: Observable<any>;
  isLoadingQuestion: boolean = false;
  data!: job;
  editId!: number;
  candidateEmail: string | null = '';
  workHistories: Array<WorkHistory> = [];
  educationHistories: Array<EducationHistory> = [];
  skillHisories: Array<Skill> = [];
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
  questionData!: Question;
  jobId: string | null = localStorage.getItem('JobId');
  candidateData!: Candidate;
  isResumeData!: boolean;
  isCoverLetterData!: boolean;
  isUploadingResume: boolean = false;
  isUploadingCoverLetter: boolean = false;
  encodeUrl!: string | null;
  description: string = '';
  maxLength: number = 1000;

  constructor(
    private fb: FormBuilder,
    private jobService: JobRecruitService,
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private dateFormatPicker: DateFormatService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private utilService: UtilService
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
      skillName: [''],
      proficiencyLevel: [''],
      noOfYears: [''],
    });
    this.supportingFormGroup = this.fb.group({
      resume: ['', Validators.required],
      coverLetter: ['', Validators.required],
    });

    this.isLoading$ = this.jobService.isLoading$;
  }

  ngOnInit(): void {
    this.getCandidateInfo();
    this.jobService.jobDetailData$.subscribe((job) => {
      this.jobData = job;
      this.getQuestionsByJobDetail(job.id);
    });
    const endcode = localStorage.getItem(CORP_URL_KEY);
    if (endcode) {
      this.encodeUrl = encodeURIComponent(endcode);
    }
  }

  ngAfterViewInit() {
    this.modals[1] = Modal.getOrCreateInstance(
      this.modal1Element.nativeElement
    );
    this.modal1Element.nativeElement.addEventListener('hidden.bs.modal', () => {
      // Ensure the cleanup happens after hide()
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    });

    this.modals[2] = Modal.getOrCreateInstance(
      this.modal2Element.nativeElement
    );
    this.modal2Element.nativeElement.addEventListener('hidden.bs.modal', () => {
      // Ensure the cleanup happens after hide()
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    });

    this.modals[3] = Modal.getOrCreateInstance(
      this.modal3Element.nativeElement
    );
    this.modal3Element.nativeElement.addEventListener('hidden.bs.modal', () => {
      // Ensure the cleanup happens after hide()
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    });
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

  getCandidateInfo() {
    if (this.route.snapshot.paramMap.get('candidateId')) {
      this.candidateService
        .getCandidatesInfo(this.route.snapshot.paramMap.get('candidateId'))
        .pipe(finalize(() => this.jobService.setLoading(false)))
        .subscribe({
          next: (response) => {
            if (response.valid && response.data) {
              this.prefillCandidateForm(response.data);
              console.log(response.data);
              this.candidateService.setCandidateData(response?.data);

              this.cdr.detectChanges();
            } else {
            }
          },
        });
    } else {
      const existingData = this.candidateService.getCandidateData();
      if (existingData) {
        this.prefillCandidateForm(existingData);
      }
    }
  }

  prefillCandidateForm(data: Candidate) {
    //prettier-ignore
    const {name, email,phone,countryName,state,address,city,resume,coverLetter} = data;
    //prettier-ignore
    this.personalFormGroup.patchValue({firstName: name?.split(' ')[0] || '',lastName: name?.split(' ')[1] || '',email, phone,countryName, state,address,city,});
    this.workHistories = data.workHistories;
    this.educationHistories = data.educationHistories;
    this.skillHisories = data.skills;
    this.personalFormGroup.updateValueAndValidity();
    this.workEducationAndSkill.get('stepCheck')?.updateValueAndValidity();
    this.supportingFormGroup.patchValue({
      resume: resume,
      coverLetter: coverLetter,
    });
    this.supportingFormGroup.updateValueAndValidity();
    this.isResumeData = true;
    this.isCoverLetterData = true;
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
    this.workFormGroup.reset();
    this.educationFormGroup.reset();
    this.skillFormGroup.reset();
    this.isEditModalOpen = false;
    this.workFormGroup.markAsUntouched();
    this.educationFormGroup.markAsUntouched();
    this.skillFormGroup.markAsUntouched();
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
      console.log(this.workHistories[id]);
      const workHistory = this.workHistories[id];
      if (workHistory) {
        this.workFormGroup.patchValue(workHistory);
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
        this.educationFormGroup.patchValue(educationHistory);
      }
      this.openModal(modalId);
      this.isEditModalOpen = true;
    }
  }

  resetEducationHistoryForm() {
    this.educationFormGroup.reset();
  }

  addSkillHistory(id: number) {
    if (
      this.skillName?.value &&
      this.proficiencyLevel?.value &&
      this.noOfYears?.value
    ) {
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
    }
    this.closeModal(id);
  }
  handleEditSkill(modalId: number, id: number) {
    if (this.listItem.nativeElement.contains(this.deleteIcon.nativeElement)) {
      this.editId = id;
      const skillHistory = this.skillHisories[id];
      if (skillHistory) {
        this.skillFormGroup.patchValue(skillHistory);
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
    this.isUploadingResume = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.utilService
        .unprotectedFileBase64(data)
        .pipe(
          finalize(() => {
            this.isUploadingResume = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.resumeValue = response.data;
              this.supportingFormGroup
                .get('resume')
                ?.setValue(response.data.path);
              this.isResumeData = false;
            }
          },
          error: (err: any) => {
            this.toastService.error(err.message);
            this.selectedResumeFile = '';
            this.isResumeData = false;
          },
        });
    };
  }
  convertCoverLetterFileToBase64(file: File, name: string): void {
    this.isUploadingCoverLetter = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.utilService
        .unprotectedFileBase64(data)
        .pipe(
          finalize(() => {
            this.isUploadingCoverLetter = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe(
          (response: any) => {
            if (response.valid && response.data) {
              this.coverLetterValue = response.data;
              this.supportingFormGroup
                .get('coverLetter')
                ?.setValue(response.data.path);
              this.isCoverLetterData = false;
            }
          },
          (err) => {
            this.toastService.error(err.message);
            this.selectedCoverLetterFile = '';
            this.isCoverLetterData = false;
          }
        );
    };
  }
  handleRemoveResume(): void {
    this.supportingFormGroup.get('resume')?.setValue('');
    this.selectedResumeFile = '';
  }
  handleRemoveCoverLetter(): void {
    this.supportingFormGroup.get('coverLetter')?.setValue('');
    this.selectedCoverLetterFile = '';
  }
  getQuestionsByJobDetail(id: string | null) {
    this.jobService.getJobDetailsById(id).subscribe((response: any) => {
      if (response.valid && response.data) {
        this.questionData = response.data;
        let formControl: any = {};
        this.questionData.questionOptions.forEach((question: any) => {
          formControl[question.id] = new FormControl('', Validators.required);
          this.questionsFormGroup = this.fb.group(formControl);
        });
      }
    });
  }

  validateNumberInput(event: any, acceptDecimal: boolean = false) {
    return this.utilService.isValidNumberInput(event, acceptDecimal);
  }

  //Post Job-Application
  submitJobApplication(payload: any) {
    this.isSubmitting = true;
    this.jobService
      .submitJobApplication(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.toastService.success(response.message);
            setTimeout(() => {
              this.router.navigate([`/job-listing/${this.encodeUrl}`]);
            }, 3500);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
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
      name: `${this.utilService.capitalizeFirstLetter(
        this.personalFormGroup.get('firstName')?.value
      )} ${this.utilService.capitalizeFirstLetter(
        this.personalFormGroup.get('lastName')?.value
      )}`,
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
      jobDetailId: localStorage.getItem(JOB_ID_KEY),
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
      this.questionsFormGroup.markAllAsTouched();
    }
  }
}
