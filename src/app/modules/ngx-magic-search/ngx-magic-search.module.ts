import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMagicSearchComponent } from './ngx-magic-search.component';
import { NgxMagicSearchDirective } from '../ngx-magic-search.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgxMagicSearchComponent,
    NgxMagicSearchDirective
  ],
  exports: [
    NgxMagicSearchComponent,
    NgxMagicSearchDirective
  ]
})
export class NgxMagicSearchModule { }
