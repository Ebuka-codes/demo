import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InterviewerService } from './shared/interviewer.service';
import { Interviewer } from './shared/interviewer';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'erecruit-interviewer',
  templateUrl: './interviewer.component.html',
  styleUrls: ['./interviewer.component.scss'],
})
export class InterviewerComponent implements OnInit {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  public closeOnOutsideClick: boolean = false;

  form!: FormGroup;

  isLoading!: boolean;

  time = '';

  data!: Interviewer[];

  searchText: string = '';

  constructor(
    private fb: FormBuilder,
    private interviewerService: InterviewerService,
    private toastService: ToastService,
    private location: Location
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.validatePhone()]],
    });
  }

  ngOnInit(): void {
    this.loadInterviewers();
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
    this.isLoading = true;
    this.data = [];
    this.interviewerService.getAllInterviewers().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.data = response.data;
        } else {
          this.toastService.error(response.message);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.isLoading = false;
      },
    });
  }
  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
    this.resetForm();
    this.isLoading = false;
  }

  createInterviewer(data: Interviewer) {
    this.isLoading = true;
    this.interviewerService.createInterviewer(data).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.resetForm();
          this.toastService.success(response.message);
          this.loadInterviewers();
          this.close();
        } else {
          this.toastService.error(response.message);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.isLoading = false;
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
