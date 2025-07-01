import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'erecruit-privacy-policy-modal',
  templateUrl: './privacy-policy-modal.component.html',
  styleUrls: ['./privacy-policy-modal.component.scss'],
})
export class PrivacyPolicyModalComponent {
  @ViewChild('privacy') modalElementRef!: ElementRef<HTMLDivElement>;
  private modalInstance!: Modal;
  @Output() checkTerms: EventEmitter<boolean> = new EventEmitter();

  ngAfterViewInit(): void {
    this.modalInstance = Modal.getOrCreateInstance(
      this.modalElementRef.nativeElement
    );
    this.modalElementRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
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
    document.documentElement.style.overflowY = 'hidden';
  }

  closePrivacyModal() {
    this.modalInstance.hide();
  }

  agreedTerms() {
    this.closePrivacyModal();
    this.checkTerms.emit();
  }
}
