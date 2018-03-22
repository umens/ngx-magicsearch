import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMagicSearchComponent } from './ngx-magic-search.component';
import { NgxMagicSearchDirective } from '../ngx-magic-search.directive';
import { MyRenderer } from '../renderer.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    MyRenderer,
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
