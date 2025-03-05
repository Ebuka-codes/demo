import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Notyf } from 'notyf';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-corporate-list',
  templateUrl: './corporate-list.component.html',
  styleUrls: ['./corporate-list.component.scss'],
})
export class CorporateListComponent {
  @ViewChild('inputLogo') inputLogo!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  notyf = new Notyf();
  data: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  filteredData: Array<any> = [];
  constructor(private jobService: DashboardService) {}

  ngOnInit() {
    this.getCorporate();
  }

  handleSearch() {
    if (this.searchText.trim() === '') {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter((item: any) =>
        item.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  getCorporate() {
    this.jobService.setLoading(true);
    this.jobService.getCorporate().subscribe({
      next: (response: any) => {
        this.submitLoading = false;
        if (response) {
          this.data = response;
          this.filteredData = [...this.data];

          console.log(this.filteredData);
        }
        this.jobService.setLoading(false);
      },

      error: () => {
        this.submitLoading = false;
        this.jobService.setLoading(false);
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
      },
    });
  }
}
