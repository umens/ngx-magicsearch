import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgxMagicSearchComponent } from './components/ngx-magic-search.component';
import { NgxMagicSearchDirective } from './directives/ngx-magic-search.directive';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NgxMagicSearchComponent,
        NgxMagicSearchDirective
      ],
      imports: [ FormsModule ],
      providers: []
    });
  });

  it('should have an url', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.url).toEqual('https://github.com/umens/ngx-magicsearch');
  });

});
