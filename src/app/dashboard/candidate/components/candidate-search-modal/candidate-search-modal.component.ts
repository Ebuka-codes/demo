import { Component, ElementRef, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'erecruit-candidate-search-modal',
  templateUrl: './candidate-search-modal.component.html',
  styleUrls: ['./candidate-search-modal.component.scss'],
})
export class CandidateSearchModalComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Output() onSearch!: (data: any) => void;

  selected!: string | null;
  degree!: string | null;
  keyword: string[] = [];
  degreeType!: string | null;
  skill: string[] = [];
  location: string[] = [];
  searchKeyword!: string;
  searchSkill!: string;
  searchLocation!: string;
  maxSalary = new FormControl();
  minSalary = new FormControl();
  experienceOptions = [
    { label: 'Less than a year', values: [0], count: 10 },
    { label: '1-2 years', values: [1, 2], count: 7 },
    { label: '3-4 years', values: [3, 4, 5], count: 5 },
    { label: '5-7 years', value: [5, 6, 7], count: 4 },
    { label: '8-9 years', value: [8, 9], count: 0 },
    { label: '10+ years', values: [10, 11, 12, 13], count: 0 },
  ];
  degreeTypeOption = [
    { label: 'Secondary Education', count: 2 },
    { label: 'Diploma', count: 5 },
    { label: 'Bachelors (B SC, B Tech...)', count: 7 },
    { label: 'Doctorate (PhD)', count: 1 },
    { label: 'Masters (MSC)', count: 2 },
  ];

  degreeOption = [
    { label: 'First Class Honours', count: 2 },
    { label: 'Second Class Upper', count: 7 },
    { label: 'Third Class', count: 4 },
    { label: 'Pass', count: 5 },
  ];

  selectedExperience: number[] = [];

  constructor(private offCanvas: NgbActiveOffcanvas) {}
  onSelectedDegreeType(event: Event) {
    const input = event.target as HTMLInputElement;
    this.degree = input.value;
  }

  onToggleRadio(value: string) {
    if (this.degreeType === value) {
      this.degreeType = null;
    } else {
      this.degreeType = value;
    }
  }

  onToggleRadioDegree(value: string) {
    if (this.degree === value) {
      this.degree = null;
    } else {
      this.degree = value;
    }
  }
  onSelectedKeyword(event: Event) {
    const KeyboardEvent = event as KeyboardEvent;
    if (KeyboardEvent.key === 'Enter' && this.searchKeyword) {
      this.keyword.push(this.searchKeyword);
      this.searchKeyword = '';
    }
  }
  onSelectedSkill(event: Event) {
    const KeyboardEvent = event as KeyboardEvent;
    if (KeyboardEvent.key === 'Enter' && this.searchSkill) {
      this.skill.push(this.searchSkill);
      this.searchSkill = '';
    }
  }
  onSelectedLocation(event: Event) {
    const KeyboardEvent = event as KeyboardEvent;
    if (KeyboardEvent.key === 'Enter' && this.searchLocation) {
      this.location.push(this.searchLocation);
      this.searchLocation = '';
    }
  }
  onToggleExperience(option: number[] | undefined, event: Event) {
    const type = event.target as HTMLInputElement;
    const value = Array.isArray(option) ? option : [];
    if (type.checked) {
      this.selectedExperience = Array.from(
        new Set([...this.selectedExperience, ...value])
      );
    } else {
      this.selectedExperience = this.selectedExperience.filter(
        (val) => !value.includes(val)
      );
    }
  }
  onDelete(index: number, type: string) {
    if (type === 'keyword') {
      this.keyword.splice(index, 1);
    }
    if (type === 'skill') {
      this.skill.splice(index, 1);
    }
    if (type === 'location') {
      this.location.splice(index, 1);
    }
  }
  onReset() {
    this.searchKeyword = '';
    this.skill = [];
    this.location = [];
    this.maxSalary?.value === '';
    this.minSalary?.value === '';
    this.selectedExperience = [];
    this.degreeType = null;
    this.degree = null;
    this.keyword = [];
  }

  close() {
    this.offCanvas.close();
  }

  search() {
    const data = {
      keyword: this.keyword,
      skill: this.skill,
      yearsOfExperience: this.selectedExperience,
      minimumSalary: Number(this.minSalary?.value),
      maximumSalary: Number(this.maxSalary?.value),
      degree: this.degree,
      degreeType: this.degreeType,
      location: this.location,
    };
    this.onSearch(data);
  }
}
