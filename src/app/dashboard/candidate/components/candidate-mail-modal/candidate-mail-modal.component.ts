import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { CandidateService } from '../../shared/candidate.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-candidate-mail-modal',
  templateUrl: './candidate-mail-modal.component.html',
  styleUrls: ['./candidate-mail-modal.component.scss'],
})
export class CandidateMailModalComponent {
  @ViewChild('modal') modalElement!: ElementRef;
  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();
  @Input() candidateData!: any;
  modalInstance!: Modal;
  message!: string;
  chat!: any[];
  senderChat!: any[];
  recieverChat!: any[];
  isLoading$!: Observable<boolean>;
  isSendingMsg: boolean = false;
  constructor(
    private candidateService: CandidateService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['candidateData']) {
      this.candidateService.getMessage(this.candidateData?.id).subscribe({
        next: (response: any) => {
          if (response) {
            this.chat = response;
            this.senderChat = this.chat.filter(
              (data) => data.senderType === 'USER'
            );
            this.recieverChat = this.chat.filter(
              (data) => data.senderType === 'CANDIDATE'
            );
            this.loaderService.setLoading(false);
            this.isLoading$ = this.loaderService.isLoading$;
          } else {
            this.loaderService.setLoading(false);
          }
        },
        error: (error) => {
          this.loaderService.setLoading(false);
        },
      });
    }
  }
  closeModal() {
    const mailCandidateModal =
      Modal.getInstance(
        document.getElementById('mailCandidateModal') as HTMLDivElement
      ) ||
      new Modal(
        document.getElementById('mailCandidateModal') as HTMLDivElement
      );
    mailCandidateModal.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    this.isSendingMsg = false;
  }
  clearMessage() {
    this.message = '';
  }
  onSubmitMessage() {
    if (this.message) {
      this.isSendingMsg = true;
      this.candidateService
        .sendMessage({
          candidateId: this.candidateData.id,
          jobid: this.candidateData.jobDetail.id,
          content: this.message,
        })
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.toastService.success('Message sent!');
              this.closeModal();
              this.candidateUpdate.emit();
            } else {
              this.toastService.error('Message failed!');
              this.closeModal();
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
            this.closeModal();
          },
        });
    }
  }
  formatChatTimestamp(timestampStr: string) {
    const timestamp = new Date(timestampStr);
    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const timestampDateStr = timestamp.toDateString();
    const timeFormatted = timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (timestampDateStr === todayStr) {
      return `Today ${timeFormatted}`;
    } else if (timestampDateStr === yesterdayStr) {
      return `Yesterday ${timeFormatted}`;
    } else {
      const dateFormatted = timestamp.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      return `${dateFormatted} ${timeFormatted}`;
    }
  }
}
