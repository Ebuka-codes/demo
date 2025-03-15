import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../shared/candidate.service';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-candidate-schedule-date',
  templateUrl: './candidate-schedule-date.component.html',
  styleUrls: ['./candidate-schedule-date.component.scss'],
})
export class CandidateScheduleDateComponent {
  @Input() candidateId!: string;
  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  scheduledDateForm!: FormGroup;
  submitted!: boolean;
  isLoading$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) {
    this.scheduledDateForm = this.fb.group({
      scheduledDate: ['', Validators.required],
    });
  }

  get scheduleDate() {
    return this.scheduledDateForm.get('scheduleDate');
  }

  resetScheduleForm() {
    this.scheduledDateForm.reset();
    this.submitted = false;
  }
  closeModal() {
    const modal =
      Modal.getInstance(
        document.getElementById('scheduleModal') as HTMLDivElement
      ) ||
      new Modal(document.getElementById('scheduleModal') as HTMLDivElement);
    modal.hide();
  }
  createScheduleDate(candidateId: string, data: any) {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.candidateService.scheduleCandidateById(candidateId, data).subscribe({
      next: () => {
        this.submitted = false;
        this.toastService.success('Interview scheduled successfully');
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
        this.scheduledDateForm.reset();
        this.closeModal();
        this.candidateUpdate.emit();
      },
      error: (error) => {
        this.toastService.error('Error updating schedule date');
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

    this.submitted = true;
    if (this.scheduledDateForm.invalid) {
      return;
    }
    this.createScheduleDate(this.candidateId, dataFormate);
  }
}
