import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {NgxMagicSearchComponent} from './src/ngx-magicsearch.component';
import {NgxMagicSearchDirective} from './src/ngx-magicsearch.directive';

export * from './src/ngx-magicsearch.component';
export * from './src/ngx-magicsearch.directive';

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
export class NgxMagicSearchModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxMagicSearchModule
    };
  }
}
