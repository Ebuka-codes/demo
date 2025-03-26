import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../shared/candidate.service';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Observable } from 'rxjs';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-candidate-schedule-date',
  templateUrl: './candidate-schedule-date.component.html',
  styleUrls: ['./candidate-schedule-date.component.scss'],
})
export class CandidateScheduleDateComponent implements OnInit {
  @Input() candidateId!: string;
  @Input() ViewCandidateId!: string;
  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  scheduledDateForm!: FormGroup;
  submitted: boolean = false;
  isLoading$!: Observable<boolean>;
  interviewer!: any[];

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) {
    this.scheduledDateForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      interviewers: ['', Validators.required],
      scheduledDescription: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getInterviewers();
  }
  get scheduledDate() {
    return this.scheduledDateForm.get('scheduledDate');
  }

  get scheduledTime() {
    return this.scheduledDateForm.get('scheduledTime');
  }

  get interviewers() {
    return this.scheduledDateForm.get('interviewers');
  }

  get description() {
    return this.scheduledDateForm.get('scheduledDescription');
  }
  resetScheduleForm() {
    this.scheduledDateForm.reset();
    this.closeModal();
  }
  closeModal() {
    const scheduleModal =
      Modal.getInstance(
        document.getElementById('scheduleModal') as HTMLDivElement
      ) ||
      new Modal(document.getElementById('scheduleModal') as HTMLDivElement);
    scheduleModal.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
  getInterviewers() {
    return this.candidateService.getInterviewer().subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.interviewer = response.data;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }
  createScheduleDate(data: any) {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.candidateService.scheduleCandidateById(data).subscribe({
      next: (response: any) => {
        this.submitted = false;
        this.toastService.success(response.message);
        this.scheduledDateForm.reset();
        this.closeModal();
        this.candidateUpdate.emit();
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
        this.closeModal();
        this.candidateUpdate.emit();
      },
    });
  }
  onSubmit() {
    const data = new Date(this.scheduledDateForm.get('scheduledDate')?.value);
    const year = data.getFullYear();
    const month = data.getMonth() + 1;
    const day = data.getDate();
    const dataFormate = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;

    if (this.scheduledDateForm.valid) {
      this.createScheduleDate({
        ...this.scheduledDateForm.value,
        scheduledDate: dataFormate,
        candidateId: this.candidateId,
      });
    } else {
      this.scheduledDateForm.markAllAsTouched();
    }
  }
}
