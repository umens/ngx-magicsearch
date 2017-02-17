import { NgModule, ModuleWithProviders } from "@angular/core";
import { NgxMagicSearchComponent } from './lib/src/app/components/ngx-magic-search.component';
import { NgxMagicSearchDirective } from './lib/src/app/directives/ngx-magic-search.directive';

// for manual imports
export * from './lib/src/app/components/ngx-magic-search.component';

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
