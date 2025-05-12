import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Modal } from 'bootstrap';
import { QuillEditorComponent } from 'ngx-quill';
import { DetailsType, QuestionTypeOptions } from 'src/app/shared/type';
import * as bootstrap from 'bootstrap';
import { finalize, map, Observable, startWith } from 'rxjs';
import { job, KeyValuePair } from '../shared/job';
import { JobService } from '../shared/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/service/loader.service';
import Quill from 'quill';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss'],
})
export class JobEditComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;
  @ViewChild('newEmpType') newEmpType!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobTitle') newJobTitle!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobLocation') newJobLocation!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobSkill') newJobSkill!: ElementRef<HTMLInputElement>;
  @ViewChild('myQuestionModal') modalElement!: ElementRef;
  @ViewChild(QuillEditorComponent) quillEditor!: QuillEditorComponent;
  @ViewChild('editor') editor!: QuillEditorComponent;
  private quill!: Quill;
  modalInstance!: Modal;
  workmode = new Array<KeyValuePair>(
    {
      key: 'HYBRID',
      value: 'Hybrid',
    },
    { key: 'REMOTE', value: 'Remote' },
    { key: 'ON_SITE', value: 'On-site' }
  );
  selectedWorkmode: number | null = null;
  isSubmitted: boolean = false;
  isSubmittedQuestion: boolean = false;
  isLoadingQuestion: boolean = false;
  form!: FormGroup;
  questionForm!: FormGroup;
  loading: boolean = false;
  froalaEditorInstance: any;
  questions: any;
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
  text: string = '';
  isEditOpen: boolean = false;
  editId: string = '';
  viewQuestionData: any;
  minEndDate!: Date;
  description: string = '';
  selectedValue: string = '';
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.minLength(3)]],
      jobId: ['', Validators.required],
      jobLocation: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobSalary: ['', [Validators.required, this.amountValidator()]],
      jobType: ['', Validators.required],
      workMode: ['', Validators.required],
      companyName: [''],
      requiredSkills: [[]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionOptions: [[]],
      jobDescription: ['', Validators.required],
    });
  }
  onEditorCreated(quillInstance: Quill) {
    this.quill = quillInstance;
  }
  ngOnInit() {
    this.fetchData();
    this.getJobDetailByType();
    this.getAllQuestion();
    this.loaderService.setLoading(true);
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
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

  get questionOption(): FormArray {
    return this.form.get('questionOptions') as FormArray;
  }

  fetchData() {
    this.jobService
      .getJobById(this.route.snapshot.paramMap.get('id'))
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.data) {
            console.log(
              response.data.employmentType.charAt(0).toUpperCase() +
                response.data.employmentType.slice(1)
            );
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
            this.form.get('questionOptions')?.setValue(id);
            setTimeout(() => {
              if (this.quill) {
                this.quill.setContents(
                  this.quill.clipboard.convert({
                    html: response.data.jobDescription,
                  })
                );
              }
            }, 1000);
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

  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === '') {
        return null;
      }
      const valid = /^\d+$/.test(value);
      return valid ? null : { invalidAmount: { value: control.value } };
    };
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

          this.isLoading = false;
        }
        this.filterForm();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.toastService.error(error.message);
      },
    });
  }
  getAllQuestion() {
    this.jobService.getAllQuestions().subscribe({
      next: (response: any) => {
        if (response.valid && response?.data) {
          this.questionTypeDropdown = response.data;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }
  updateQuestion() {
    this.getAllQuestion();
  }

  onDeleteQuestion(id: string) {
    this.loaderService.setLoading(true);
    this.jobService
      .deleteQuestionsById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
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
  selectSkill(skill: string | undefined) {
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
            this.toastService.success(response.message);
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error: any) => {
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
  addNewData(value: string, type: string) {
    if (value) {
      this.createNewQueryDetails({
        type: type,
        description: value,
      });
      this.newEmpType.nativeElement.value = '';
      this.newJobSkill.nativeElement.value = '';
      this.newJobTitle.nativeElement.value = '';
      this.newJobLocation.nativeElement.value = '';
      this.selectedSkills = [];
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
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.getJobDetailByType();
              this.selectedValue = '';
              this.isEditOpen = false;
              this.form.get(`${type}`)?.setValue('');
              this.toastService.success(response.message);
            }
          },
          error: (err) => {
            this.toastService.error(err.message);
            this.selectedValue = '';
            this.isEditOpen = false;
          },
        });
    }
    keyboardEvent.stopPropagation();
    keyboardEvent.preventDefault();
  }

  handleDeleteQuery(id: string, type: string, value: string) {
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
  }

  handleEditJob(id: string | null, editedJob: job) {
    this.loading = true;
    this.loaderService.setLoading(true);
    this.jobService
      .editJob(id, editedJob)
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
    const startDateValue = this.form.get('startDate')?.value;
    const endDateValue = this.form.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (this.form.valid) {
      this.handleEditJob(this.route.snapshot.paramMap.get('id'), {
        ...this.form.value,
        startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${startDate
          .getDate()
          .toString()
          .padStart(2, '0')}`,
        endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`,
        employmentType: this.form.get('employmentType')?.value.toUpperCase(),
        jobType: this.form.get('jobType')?.value,
        jobSalary: Number(this.form.get('jobSalary')?.value),
      });
    } else {
      this.isSubmitted = true;
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
  onNavigateBack() {
    this.router.navigate(['/job']);
  }
}
