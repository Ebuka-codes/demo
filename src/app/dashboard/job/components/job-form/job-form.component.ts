import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Modal } from 'bootstrap';
import { QuillEditorComponent } from 'ngx-quill';
import * as bootstrap from 'bootstrap';
import { finalize, map, Observable, startWith } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { MatSelect } from '@angular/material/select';
import { UtilService } from 'src/app/core/service/util.service';
import { JobService } from '../../shared/job.service';
import {
  DetailsType,
  job,
  KeyValuePair,
  QuestionTypeOptions,
} from '../../shared/job';
import Quill from 'quill';
import { JobQuestionModalComponent } from '../job-question-modal/job-question-modal.component';

@Component({
  selector: 'erecruit-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;
  @ViewChild('newEmpType') newEmpType!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobTitle') newJobTitle!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobLocation') newJobLocation!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobSkill') newJobSkill!: ElementRef<HTMLInputElement>;
  @ViewChild('myQuestionModal') modalElement!: ElementRef;
  @ViewChild('questionSelect') questionSelect!: MatSelect;
  @ViewChild('editor') editor!: QuillEditorComponent;

  @ViewChild(JobQuestionModalComponent)
  JobQuestionModalComponent!: JobQuestionModalComponent;

  private quill!: Quill;
  modalInstance!: Modal;

  selectedWorkmode: number | null = null;
  workmode = new Array<KeyValuePair>(
    {
      key: 'HYBRID',
      value: 'Hybrid',
    },
    { key: 'REMOTE', value: 'Remote' },
    { key: 'ON_SITE', value: 'On-site' }
  );
  isSubmitted: boolean = false;
  isSubmittedQuestion: boolean = false;
  isLoadingQuestion: boolean = false;
  form: FormGroup;
  questionForm!: FormGroup;
  loading: boolean = false;
  froalaEditorInstance: any;
  questions: any;
  isEditModal!: boolean;
  froalaOptions: any = {
    placeholderText: 'Enter content here...',
    events: {
      initialized: (editor: any) => {
        this.froalaEditorInstance = editor;
      },
    },
  };
  jobTitleOption!: Observable<any[]>;
  jobLocationOption!: Observable<any[]>;
  jobEmploymentOption!: Observable<any[]>;
  jobSkillOption!: Observable<any[]>;
  jobTypeOption!: Observable<any[]>;
  filteredOptions: any;
  data: Array<DetailsType> = [];
  jobTitleData: any[] = [];
  jobEmploymentData: any = [];
  jobTypeData: any[] = [];
  jobLocationData: any[] = [];
  jobSkillData: any[] = [];
  typeValue: string = '';
  isLoading: boolean = false;
  questionTypeOptions: Array<QuestionTypeOptions> = [];
  questionTypeDropdown: Array<QuestionTypeOptions> = [];
  selectedSkills: string[] = [];
  isEditDate: boolean = true;
  selectedValue: string = '';
  isEditOpen: boolean = false;
  editId: string = '';
  viewQuestionData: any;
  minEndDate!: Date;
  mode!: string;
  isEditFormMode!: boolean;
  jobid!: string | null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.minLength(3)]],
      jobId: ['', Validators.required],
      jobLocation: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobSalary: ['', [Validators.required, this.amountValidator()]],
      jobSalaryTo: ['', [Validators.required, this.amountValidator()]],
      jobType: ['', Validators.required],
      companyName: [''],
      workMode: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionOptions: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });
  }
  onEditorCreated(quillInstance: Quill) {
    this.quill = quillInstance;
  }
  ngOnInit(): void {
    this.jobid = this.route.snapshot.paramMap.get('id');
    if (this.jobid) {
      this.mode = 'Edit Job';
      this.loadJob(this.jobid);
      this.isEditFormMode = true;
      this.isEditDate = false;
    } else {
      this.mode = 'Create Job';
      this.isEditFormMode = false;
    }
    this.getJobDetailByType();
    this.getAllQuestion();
    this.loaderService.setLoading(true);
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
  }

  loadJob(jobId: string) {
    this.jobService
      .getJobById(jobId)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.form.patchValue({
              ...response.data,
              employmentType:
                response.data.employmentType.charAt(0).toUpperCase() +
                response.data.employmentType.slice(1).toLowerCase(),
            });
            this.form.updateValueAndValidity();
            let selectedSkillIds = [];
            selectedSkillIds = response.data.requiredSkills;
            const selectedIds = selectedSkillIds.map((skill: any) => skill.id);
            this.form.get('requiredSkills')?.setValue(selectedIds);
            let selectedQuestionIds = [];
            selectedQuestionIds = response.data.questionOptions;
            const id = selectedQuestionIds.map((q: any) => q.id);
            setTimeout(() => {
              if (this.quill) {
                this.quill.setContents(
                  this.quill.clipboard.convert({
                    html: response.data.jobDescription,
                  })
                );
              }
            }, 1000);

            this.form.get('questionOptions')?.setValue(id);
          }
        },
        error: (err) => {
          this.toastService.error(err.message);
        },
      });
  }

  filterForm() {
    this.jobTitleOption = this.form.controls['jobTitle']?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobTitleData))
    );

    this.jobTypeOption = this.form.controls['jobType']?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobTypeData))
    );

    this.jobLocationOption = this.form.controls[
      'jobLocation'
    ]?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobLocationData))
    );
    this.jobEmploymentOption = this.form.controls[
      'employmentType'
    ]?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobEmploymentData))
    );

    this.jobSkillOption = this.form.controls['jobSkill']?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobSkillData))
    );
  }
  private _filter(value: string, type: any): string[] {
    const filterValue = value.toLowerCase();
    return type.filter((option: any) =>
      option?.description.toLowerCase().includes(filterValue)
    );
  }

  get jobTitle() {
    return this.form.get('jobTitle');
  }
  get jobId() {
    return this.form.get('jobId');
  }
  get jobDescription() {
    return this.form.get('jobDescription');
  }
  get employmentType() {
    return this.form.get('employmentType');
  }
  get jobLocation() {
    return this.form.get('jobLocation');
  }
  get jobSalary() {
    return this.form.get('jobSalary');
  }
  get jobSalaryTo() {
    return this.form.get('jobSalaryTo');
  }
  get jobType() {
    return this.form.get('jobType');
  }
  get companyName() {
    return this.form.get('companyName');
  }
  get workMode() {
    return this.form.get('workMode');
  }

  get requiredSkills() {
    return this.form.get('requiredSkills');
  }

  get jobStartDate() {
    return this.form.get('startDate');
  }
  get jobEndDate() {
    return this.form.get('endDate');
  }

  get questionOption() {
    return this.form.get('questionOptions');
  }

  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = /^\d+$/.test(value);
      return isValid ? null : { invalidAmount: true };
    };
  }

  validateNumberInput(event: any, acceptDecimal: boolean = false) {
    return this.utilService.isValidNumberInput(event, acceptDecimal);
  }

  getAllQuestion() {
    this.loaderService.setLoading(true);
    this.jobService
      .getAllQuestions()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response?.data) {
            this.questionTypeDropdown = response.data;
          }
        },
        error: (error: any) => {
          this.toastService.error(error.message);
        },
      });
  }
  updateQuestion() {
    this.getAllQuestion();
  }

  getJobDetailByType() {
    this.jobService.getQueryDetailsByType().subscribe({
      next: (response: any) => {
        if (response.valid && response?.data) {
          this.data = response.data;
          this.jobTitleData = this.data.filter(
            (item) => item.type.trim() === 'jobTitle'
          );
          this.jobLocationData = this.data?.filter(
            (item) => item.type.trim() === 'jobLocation'
          );

          this.jobEmploymentData = this.data?.filter(
            (item) => item.type.trim() === 'employmentType'
          );

          this.jobTypeData = this.data?.filter(
            (item) => item.type.trim() === 'jobType'
          );

          this.jobSkillData = this.data?.filter(
            (item) => item.type.trim() === 'jobSkill'
          );

          console.log(this.jobSkillData);
          this.isLoading = false;
        }
        this.filterForm();
      },
      error: (error: any) => {
        this.toastService.error(error.message);
        this.isLoading = false;
      },
    });
  }
  getQuestionsById(id: string) {
    this.loaderService.setLoading(true);
    this.jobService
      .getQuestionById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.viewQuestionData = response.data;
            this.form.patchValue(this.viewQuestionData);
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
  onAddQuestion() {
    this.editId = '';
    this.JobQuestionModalComponent.open();
  }
  onDeleteQuestion(id: string) {
    this.loaderService.setLoading(true);
    this.jobService
      .deleteQuestionsById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.getAllQuestion();
            this.toastService.success(response.message);
          } else {
            this.toastService.success(response.message);
          }
        },
        error: (error) => {
          this.toastService.success(error.message);
        },
      });
  }
  selectSkill(skill: any) {
    if (skill) {
      if (!this.selectedSkills.includes(skill)) {
        this.selectedSkills.push(skill);
      }
    }
    this.updateInputValue();
  }
  updateInputValue() {
    this.selectedSkills = this.selectedSkills.filter(
      (skill) => skill !== undefined
    );
    if (this.selectedSkills.length > 0) {
      this.form
        .get('requiredSkills')
        ?.setValue(this.selectedSkills.join(', '), {
          emitEvent: false,
        });
    } else {
      this.form.get('requiredSkills')?.setValue('');
    }
  }

  createNewQueryDetails(data: DetailsType) {
    this.loaderService.setLoading(true);
    this.jobService
      .createQueryDetails(data)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.getJobDetailByType();
            this.toastService.success('Created successfully!');
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
  openPanel() {
    setTimeout(() => {
      if (this.autoComplete) {
        this.autoComplete.openPanel();
      }
    }, 100);
  }
  handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.stopPropagation();
    }
  }
  addNewQueryData(event: Event, value: string, type: string) {
    const keyboardEvent = event as KeyboardEvent;
    if (value) {
      this.createNewQueryDetails({
        type: type,
        description: value,
      });
      this.newEmpType.nativeElement.value = '';
      this.newJobSkill.nativeElement.value = '';
      this.newJobTitle.nativeElement.value = '';
      this.newJobLocation.nativeElement.value = '';
      this.form.get('requiredSkills')?.setValue('');
    }
    keyboardEvent.stopPropagation();
    keyboardEvent.preventDefault();
  }
  handleEditQuery(event: any, id: string, value: string) {
    event.stopPropagation();
    this.selectedValue = value;
    this.editId = id;
    this.isEditOpen = true;
  }
  editQueryData(event: Event, value: string, type: string) {
    const keyboardEvent = event as KeyboardEvent;
    if (this.editId) {
      this.loaderService.setLoading(true);
      this.jobService
        .editQueryDetails(this.editId, {
          description: value,
          type: type,
        })
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.loaderService.setLoading(false);
              this.getJobDetailByType();
              this.selectedValue = '';
              this.isEditOpen = false;
              this.form.get(`${type}`)?.setValue('');
              this.toastService.success(response.message);
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
            this.selectedValue = '';
            this.isEditOpen = false;
          },
        });
    }
    keyboardEvent.stopPropagation();
    keyboardEvent.preventDefault();
  }

  handleDeleteQuery(id: string, type: string, value: string) {
    const keyboardEvent = event as KeyboardEvent;
    this.loaderService.setLoading(true);
    this.jobService.deleteQueryDetails(id).subscribe(
      (response: any) => {
        this.getJobDetailByType();
        this.loaderService.setLoading(false);
        this.toastService.success(response.message);
        this.form.get(`${type}`)?.setValue('');
        this.form.get('requiredSkills')?.setValue('');
        this.selectedValue = '';
      },
      (error) => {
        this.toastService.error(error.message);
        this.form.get(type)?.setValue('');
        this.loaderService.setLoading(false);
        this.selectedValue = '';
      }
    );
    keyboardEvent.stopPropagation();
    keyboardEvent.preventDefault();
  }

  createNewJob(payload: job) {
    this.loading = true;
    this.loaderService.setLoading(true);
    this.jobService
      .createJob(payload)
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.toastService.success(response.message);
            setTimeout(() => {
              this.router.navigate(['/job']);
            }, 1500);
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }

  updateJob(id: string | null, payload: job) {
    this.loading = true;
    this.loaderService.setLoading(true);
    this.jobService
      .editJob(id, payload)
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.toastService.success(response.message);
            setTimeout(() => {
              this.router.navigate(['/job']);
            }, 1500);
          }
        },
        error: (error: any) => {
          this.toastService.error(error.message);
        },
      });
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.isSubmitted = true;
      return;
    }

    const startDateValue = this.form.get('startDate')?.value;
    const endDateValue = this.form.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const data = {
      ...this.form.value,
      startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
      endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`,
      employmentType: this.form.get('employmentType')?.value.toUpperCase(),
      jobType: this.form.get('jobType')?.value,
      jobSalary: Number(this.form.get('jobSalary')?.value),
    };

    if (this.isEditFormMode) {
      this.updateJob(this.jobid, data);
    } else {
      this.createNewJob(data);
    }
  }
  onStartDateChange() {
    if (this.form.get('startDate')?.value) {
      let selectedDate = new Date(this.form.get('startDate')?.value);
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.minEndDate = selectedDate;
      this.isEditDate = false;
    }
  }
  onEditQuestion(id: string) {
    this.editId = null as any;
    setTimeout(() => {
      this.editId = id;
    });
    this.questionSelect.close();
    this.isEditModal = true;
    this.JobQuestionModalComponent.open();
  }

  onNavigateBack() {
    this.router.navigate(['/job']);
  }
}
