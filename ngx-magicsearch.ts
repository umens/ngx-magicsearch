import { NgModule, ModuleWithProviders } from "@angular/core";
import { NgxMagicSearchDirective } from './src/app/directives/ngx-magic-search.directive';

// for manual imports
export * from './src/app/directives/ngx-magic-search.directive';

@NgModule({
  declarations: [
    NgxMagicSearchDirective,
  ],
  providers: [
  ],
  exports: [
    NgxMagicSearchDirective,
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
