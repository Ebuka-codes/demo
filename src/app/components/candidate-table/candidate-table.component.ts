import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { Notyf } from 'notyf';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { CandidateInfo } from 'src/app/shared/type';

@Component({
  selector: 'app-candidate-table',
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.scss'],
})
export class CandidateTableComponent implements OnInit {
  @Input() candidateData: Array<CandidateInfo> = [];

  notyf = new Notyf();
  modalInstance!: Modal;
  searchText: string = '';
  workType!: any;
  selectedValue!: string;
  filteredData: Array<CandidateInfo> = [];
  candidateViewData!: any;
  candidateId: any;
  isDeleting: boolean = false;
  constructor(private jobService: JobRecruitService) {}

  ngOnInit(): void {
    this.workType = new Set(
      this.candidateData.map((item) => item.jobDetail.workMode)
    );
    this.filteredData = [...this.candidateData];
  }

  handleWorkType(value: string) {
    this.selectedValue = value;
    this.filteredData = this.candidateData.filter((item) =>
      item?.jobDetail?.workMode
        .toLowerCase()
        .includes(this.selectedValue.toLowerCase())
    );
  }

  handleSearch() {
    if (this.searchText.trim() === '') {
      this.filteredData = [...this.candidateData];
    } else {
      this.filteredData = this.candidateData.filter((item) =>
        item.jobDetail.jobTitle
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    }
  }

  handleViewCandidate(id: string) {
    this.candidateViewData = this.candidateData.find(
      (candidate) => candidate.id === id
    );
  }

  handleDeleteCandidate(id: string) {
    this.candidateId = id;
  }
  deleteCandidate() {
    this.isDeleting = true;
    this.jobService.deleteCandidateById(this.candidateId).subscribe(
      (response) => {
        console.log(response.message);
        this.notyf.success({
          message: 'Successfully deleted!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.isDeleting = false;
        this.filteredData = this.filteredData.filter(
          (candidate) => candidate.id !== this.candidateId
        );
      },
      (err) => {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.isDeleting = false;
      }
    );
  }
}
