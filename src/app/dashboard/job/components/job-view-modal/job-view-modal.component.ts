import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { job } from '../../shared/job';
import { months } from 'src/app/shared/model/constants';
import { Modal } from 'bootstrap';

@Component({
  selector: 'erecruit-job-view-modal',
  templateUrl: './job-view-modal.component.html',
  styleUrls: ['./job-view-modal.component.scss'],
})
export class JobViewModalComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Input() viewJobData!: Array<job>;
  constructor() {}
  ngOnInit(): void {}

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
  }

  formatDate(data: string) {
    const date = new Date(data);
    return `${
      months[date.getMonth() + 1]
    } ${date.getDate()},  ${date.getFullYear()}`;
  }
}
