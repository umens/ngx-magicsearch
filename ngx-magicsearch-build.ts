import { NgModule, ModuleWithProviders } from "@angular/core";
import { NgxMagicSearchComponent } from './src/app/components/ngx-magic-search.component';
import { NgxMagicSearchDirective } from './src/app/directives/ngx-magic-search.directive';

// for manual imports
export * from './src/app/components/ngx-magic-search.component';

@NgModule({
  declarations: [
    NgxMagicSearchComponent,
    NgxMagicSearchDirective,
  ],
  providers: [
  ],
  exports: [
    NgxMagicSearchComponent,
  ]
})
export class NgxMagicSearchBarModule {

  /* optional: in case you need users to override your providers */
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: NgxMagicSearchBarModule,
      providers: configuredProviders
    };
  }
}
