import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../shared/candidate.service';
import { Modal } from 'bootstrap';
import { finalize, Observable } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { InterviewerService } from 'src/app/dashboard/interviewer/shared/interviewer.service';
import { UtilService } from 'src/app/core/service/util.service';

@Component({
  selector: 'erecruit-candidate-schedule-date',
  templateUrl: './candidate-schedule-date.component.html',
  styleUrls: ['./candidate-schedule-date.component.scss'],
})
export class CandidateScheduleDateComponent implements OnInit {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Input() candidateId!: string;

  @Input() ViewCandidateId!: string;

  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();

  scheduledDateForm!: FormGroup;
  isLoading: boolean = false;
  interviewer!: any[];

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private interviewerService: InterviewerService,
    private toastService: ToastService,
    private utilService: UtilService
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
    document.documentElement.style.overflowY = 'hidden';
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

  ngAfterViewInit() {
    this.modalInstance = Modal.getOrCreateInstance(
      this.modalElementRef.nativeElement
    );
    this.modalElementRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        // Ensure the cleanup happens after hide()
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    );
  }

  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
    this.scheduledDateForm.reset();
    this.isLoading = false;
  }

  getInterviewers() {
    return this.interviewerService.getInterviewer().subscribe({
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
    this.isLoading = true;
    this.candidateService.scheduleCandidateById(data).subscribe({
      next: (response) => {
        this.scheduledDateForm.reset();
        this.candidateUpdate.emit();
        this.toastService.success(response.message);
        this.close();
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.candidateUpdate.emit();
        this.isLoading = false;
      },
    });
  }
  onSubmit() {
    const date = this.utilService.formatDate(
      new Date(this.scheduledDateForm.get('scheduledDate')?.value)
    );
    if (this.scheduledDateForm.valid) {
      this.createScheduleDate({
        ...this.scheduledDateForm.value,
        scheduledDate: date,
        candidateId: this.candidateId,
      });
    } else {
      this.scheduledDateForm.markAllAsTouched();
    }
  }
}
