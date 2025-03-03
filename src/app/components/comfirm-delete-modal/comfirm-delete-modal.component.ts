import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-comfirm-delete-modal',
  templateUrl: './comfirm-delete-modal.component.html',
  styleUrls: ['./comfirm-delete-modal.component.scss'],
})
export class ComfirmDeleteModalComponent {
  @ViewChild('myDeleteModal') modalElement!: ElementRef;
  @Output() deleteCandidate = new EventEmitter();
  @Input() isDeleting: any;
  private modalInstance: any;

  ngAfterViewInit() {
    if (this.modalElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
  }
  handleDelete() {
    this.deleteCandidate.emit();
    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }
}
