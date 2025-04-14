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

@Component({
  selector: 'app-interviewer',
  templateUrl: './interviewer.component.html',
  styleUrls: ['./interviewer.component.scss'],
})
export class InterviewerComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
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
    this.loaderService.setLoading(true);
    this.interviewerService.getAllInterviewers().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.data = response.data;
          this.loaderService.setLoading(false);
        } else {
          this.loaderService.setLoading(false);
        }
      },
      error: (error) => {
        this.loaderService.setLoading(true);
        this.toastService.error(error.message);
      },
    });
  }
  createInterviewer(data: Interviewer) {
    this.loaderService.setLoading(true);
    this.isLoading = true;
    this.interviewerService.createInterviewer(data).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.resetForm();
          this.toastService.success(response.message);
          this.loaderService.setLoading(false);
          this.isLoading = false;
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
        } else {
          this.loaderService.setLoading(false);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.loaderService.setLoading(false);
        this.isLoading = false;
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
      },
    });
  }
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.valid);
      this.createInterviewer(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
  onBack() {
    this.location.back();
  }
}
