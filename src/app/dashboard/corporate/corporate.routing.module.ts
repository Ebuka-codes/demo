import { RouterModule, Routes } from '@angular/router';
import { CorporateComponent } from './corporate.component';
import { NgModule } from '@angular/core';

const route: Routes = [
  {
    path: '',
    component: CorporateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class CorporateRoutingModule {}
