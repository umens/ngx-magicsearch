import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NgxMagicSearchModule } from './modules/ngx-magic-search/ngx-magic-search.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxMagicSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
