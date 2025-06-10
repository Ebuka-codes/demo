import { NgModule } from '@angular/core';
import { CorporateCreateComponent } from './corporate-create/corporate-create.component';
import { CorporateEditComponent } from './corporate-edit/corporate-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { CorporateComponent } from './corporate.component';
import { CommonModule } from '@angular/common';
import { CorporateRoutingModule } from './corporate.routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CorporateViewComponent } from './corporate-view/corporate-view.component';
import { CorporateDeleteComponent } from './corporate-delete/corporate-delete.component';

@NgModule({
  declarations: [
    CorporateEditComponent,
    CorporateCreateComponent,
    CorporateComponent,
    CorporateViewComponent,
    CorporateDeleteComponent,
  ],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    HttpClientModule,
    NgbModule,
    MatSelectModule,
    CommonModule,
    CorporateRoutingModule,
    FormsModule,
  ],

  providers: [],
})
export class CorporateModule {}
