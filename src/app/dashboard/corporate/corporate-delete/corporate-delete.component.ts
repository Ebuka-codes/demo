import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CorporateService } from '../shared/corporate.service';

import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-corporate-delete',
  templateUrl: './corporate-delete.component.html',
  styleUrls: ['./corporate-delete.component.scss'],
})
export class CorporateDeleteComponent {
  @ViewChild('deleteCorporateModal') modalElement!: ElementRef;
  @Input() corporateId!: string;
  @Output() corporateDeleted: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  isLoading$!: Observable<boolean>;
  constructor(
    private corporateService: CorporateService,
    private toastServie: ToastService,
    private loaderService: LoaderService
  ) {}

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
  }
  onConfirmDelete(): void {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.corporateService.deleteCorporate(this.corporateId).subscribe({
      next: () => {
        this.loaderService.setLoading(false);
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.corporateDeleted.emit();
        this.toastServie.success('Corporate deleted successfully');
      },
      error: (error) => {
        this.toastServie.error(error.message);
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.loaderService.setLoading(false);
      },
    });
  }
}
