import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { Notyf } from 'notyf';
import {
  DetailsType,
  KeyValuePair,
  QuestionTypeOptions,
} from 'src/app/shared/type';
import { DashboardService } from '../../dashboard.service';
import * as bootstrap from 'bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { job } from '../shared/job';
import { JobService } from '../shared/job.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss'],
})
export class JobEditComponent {
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;
  @ViewChild('newEmpType') newEmpType!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobTitle') newJobTitle!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobLocation') newJobLocation!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobSkill') newJobSkill!: ElementRef<HTMLInputElement>;
  @ViewChild('myQuestionModal') modalElement!: ElementRef;
  @ViewChild(QuillEditorComponent) quillEditor!: QuillEditorComponent;
  modalInstance!: Modal;
  workmode: string[] = ['HYBRID', 'REMOTE', 'ON_SITE'];
  selectedWorkmode: number | null = null;
  isSubmitted: boolean = false;
  isSubmittedQuestion: boolean = false;
  isLoadingQuestion: boolean = false;
  form: FormGroup;
  questionForm!: FormGroup;
  formatAmountValue: string = '';
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
  private notyf = new Notyf();
  questionTypeOptions: Array<QuestionTypeOptions> = [];
  questionTypeDropdown: Array<QuestionTypeOptions> = [];
  selectedSkills: string[] = [];
  isEditDate: boolean = true;
  text: string = '';
  isEditOpen: boolean = false;
  editId: string = '';
  viewQuestionData: any;
  minEndDate!: Date;
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      jobTitle: [
        '',
        [Validators.required, Validators.minLength(3), this.nameValidator()],
      ],
      jobLocation: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobSalary: ['', [Validators.required, this.amountValidator()]],
      jobType: ['', Validators.required],
      companyName: ['', Validators.required],
      workMode: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionOptions: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.froalaEditorInstance) {
      this.froalaEditorInstance.edit.off();
      this.froalaEditorInstance.$el.attr('contenteditable', 'false');
    }
    this.getJobDetailByType();
    this.getAllQuestion();
    this.dashboardService.setLoading(false);

    this.jobService
      .getJobById(this.route.snapshot.paramMap.get('id'))
      .subscribe((response) => {
        this.form.patchValue(response);
      });
  }

  filterForm() {
    this.jobTitleOption = this.form.controls['jobTitle'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobTitleData))
    );

    this.jobTypeOption = this.form.controls['jobType'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobTypeData))
    );

    this.jobLocationOption = this.form.controls[
      'jobLocation'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobLocationData))
    );
    this.jobEmploymentOption = this.form.controls[
      'employmentType'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.jobEmploymentData))
    );

    this.jobSkillOption = this.form.controls['jobSkill'].valueChanges.pipe(
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

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  get jobTitle() {
    return this.form.get('jobTitle');
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

  get questionOption() {
    return this.form.get('questionOptions');
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^[a-zA-Z\s]*$/.test(value);
      return valid ? null : { invalidName: { value: control.value } };
    };
  }
  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (value == '') {
        return null;
      }
      const valid = /^\d+$/.test(value);
      return valid ? null : { invalidAmount: { value: control.value } };
    };
  }
  formatAmount(amount: Event) {
    const salary = amount.target as HTMLInputElement;
    if (amount) {
      this.formatAmountValue = salary.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      this.formatAmountValue = '';
    }
  }

  getAllQuestion() {
    this.jobService.getAllQuestions().subscribe({
      next: (response: any) => {
        if (response.valid && response?.data) {
          this.questionTypeDropdown = response.data;
        }
      },
      error: (error: any) => {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
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

          this.isLoading = false;
        }
        this.filterForm();
      },
      error: (error: any) => {
        console.log('error', error.message);
        this.isLoading = false;
      },
    });
  }

  getQuestionsById(id: string) {
    this.dashboardService.setLoading(true);
    this.jobService.getQuestionsById(id).subscribe((response: any) => {
      if (response.valid && response.data) {
        this.viewQuestionData = response.data;
        this.form.patchValue(this.viewQuestionData);
        this.dashboardService.setLoading(false);
      } else {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.dashboardService.setLoading(false);
      }
    });
  }
  deleteQuestionsById(id: string) {
    this.dashboardService.setLoading(true);
    this.jobService.deleteQuestionsById(id).subscribe((response: any) => {
      if (response.valid) {
        this.dashboardService.setLoading(false);
        this.getAllQuestion();

        this.notyf.error({
          message: 'Deleted successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
      } else {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.dashboardService.setLoading(false);
      }
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
    this.dashboardService.setLoading(true);
    this.jobService.createQueryDetails(data).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.getJobDetailByType();
          this.notyf.success({
            message: 'Created successfully!',
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
        }
        this.dashboardService.setLoading(false);
      },
      error: (error: any) => {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });

        this.dashboardService.setLoading(false);
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
  createNewJob(newJob: job) {
    this.loading = true;
    this.dashboardService.setLoading(true);
    this.jobService.createJob(newJob).subscribe({
      next: () => {
        this.loading = false;
        this.notyf.success({
          message: 'Job created successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.form.reset();
        this.isSubmitted = false;
        this.dashboardService.setLoading(false);
        this.form.get('jobDescription')?.setValue(' ');
      },
      error: (error: any) => {
        this.loading = false;
        this.isSubmitted = false;
        this.form.enable();
        this.form.reset();
        this.form.get('jobDescription')?.setValue(' ');
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.dashboardService.setLoading(false);
      },
    });
  }

  onSubmit(): void {
    const startDateValue = this.form.get('startDate')?.value;
    const endDateValue = this.form.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (this.form.valid) {
      this.createNewJob({
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
        requiredSkills: this.selectedSkills,
        employmentType: this.form.get('employmentType')?.value.toUpperCase(),
        jobType: this.form.get('jobType')?.value,
        jobSalary: Number(this.form.get('jobSalary')?.value),
      });
      this.form.get('jobDescription')?.setValue(' ');
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

  handleEdit(event: any, id: string, value: string) {
    event.stopPropagation();
    this.text = value;
    this.editId = id;
    this.isEditOpen = true;
  }
  editData(value: string, type: string) {
    if (this.editId) {
      this.dashboardService.setLoading(true);
      this.jobService
        .editQueryDetails(this.editId, { description: value, type: type })
        .subscribe(
          () => {
            this.dashboardService.setLoading(false);
            this.getJobDetailByType();
            this.notyf.success({
              message: 'Edited successfully!',
              duration: 4000,
              position: { x: 'right', y: 'top' },
            });
            this.text = '';
            this.isEditOpen = false;
            this.form.get(`${type}`)?.setValue('');
          },
          (error) => {
            this.notyf.error({
              message: 'Error Occured',
              duration: 4000,
              position: { x: 'right', y: 'top' },
            });
            this.text = '';
            this.isEditOpen = false;
          }
        );
    }
  }
  handleDelete(id: string, type: string, value: string) {
    this.dashboardService.setLoading(true);
    this.jobService.deleteQueryDetails(id).subscribe(
      () => {
        this.dashboardService.setLoading(false);
        this.getJobDetailByType();
        this.notyf.success({
          message: 'Deleted successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.form.get(`${type}`)?.setValue('');
        this.form.get('requiredSkills')?.setValue('');
        this.text = '';
      },
      (error) => {
        this.notyf.error({
          message: 'Error Occured',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.form.get(type)?.setValue('');
        this.dashboardService.setLoading(false);
      }
    );
  }
}
