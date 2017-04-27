import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMagicSearchComponent } from './ngx-magicsearch.component';
import { NgxMagicSearchDirective } from './ngx-magicsearch.directive';

export * from './ngx-magicsearch.component';
export * from './ngx-magicsearch.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgxMagicSearchComponent,
    NgxMagicSearchDirective,
  ],
  exports: [
    NgxMagicSearchComponent,
    NgxMagicSearchDirective
  ]
})
export class NgxMagicSearchModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxMagicSearchModule,
      providers: []
    };
  }
}
