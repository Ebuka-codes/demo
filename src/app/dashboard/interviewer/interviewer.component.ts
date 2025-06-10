import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { InterviewerService } from './shared/interviewer.service';
import { Interviewer } from './shared/interviewer';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'erecruit-interviewer',
  templateUrl: './interviewer.component.html',
  styleUrls: ['./interviewer.component.scss'],
})
export class InterviewerComponent implements OnInit {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  submitting!: boolean;
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  time = '';
  data!: Interviewer[];
  searchText: string = '';
  constructor(
    private fb: FormBuilder,
    private interviewerService: InterviewerService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private location: Location
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.validatePhone()]],
    });
    this.isLoading$ = this.loaderService.isLoading$;
  }

  ngOnInit(): void {
    this.loadInterviewers();
  }
  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
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
  resetForm() {
    this.form.reset();
  }

  loadInterviewers() {
    this.data = [];
    this.loaderService.setLoading(true);
    this.interviewerService
      .getAllInterviewers()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.data = response.data;
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.loaderService.setLoading(false);
          this.toastService.error(error.message);
        },
      });
  }
  closeModal() {
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
  }
  createInterviewer(data: Interviewer) {
    this.submitting = true;
    this.interviewerService
      .createInterviewer(data)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.resetForm();
            this.toastService.success(response.message);
            this.closeModal();
            this.loadInterviewers();
          } else {
            this.closeModal();
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.closeModal();
        },
      });
  }
  onSubmit() {
    if (this.form.valid) {
      this.createInterviewer(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
  onBack() {
    this.location.back();
  }
}
