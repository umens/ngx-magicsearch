import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { NgxMagicSearchComponent } from './components/ngx-magic-search.component';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NgxMagicSearchComponent
      ],
      providers: []
    });
  });

  it('should have an url', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.url).toEqual('https://github.com/umens/ngx-magicsearch');
  });

});
