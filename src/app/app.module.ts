import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NgxMagicSearchModule } from './modules/ngx-magic-search/ngx-magic-search.module';
import { NgxMagicSearchDirective } from './modules/ngx-magic-search.directive';


@NgModule({
  declarations: [
    AppComponent,
    NgxMagicSearchDirective
  ],
  imports: [
    BrowserModule,
    NgxMagicSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
