import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-candidate-search-modal',
  templateUrl: './candidate-search-modal.component.html',
  styleUrls: ['./candidate-search-modal.component.scss'],
})
export class CandidateSearchModalComponent {
  selected!: string | null;
  degree: string[] = [];
  keyword: string[] = [];
  skill: string[] = [];
  location: string[] = [];
  searchKeyword!: string;
  searchSkill!: string;
  searchLocation!: string;
  maxSalary = new FormControl();
  minSalary = new FormControl();

  constructor(private offCanvas: NgbActiveOffcanvas) {}
  onToggleRadio(value: string) {
    this.selected = this.selected === value ? null : value;
    console.log(this.selected);
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

  onReset() {}
  onSubmit() {}
  close() {
    this.offCanvas.close();
  }
}
