import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { NgxMagicSearchComponent } from './ngx-magic-search.component';
import { NgxMagicSearchDirective } from '../directives/ngx-magic-search.directive';

describe('NgxMagicSearchComponent', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgxMagicSearchComponent,
        NgxMagicSearchDirective
      ],
      imports: [ FormsModule ],
    });
  });

  /*it('should have an url', () => {
    let fixture = TestBed.createComponent(NgxMagicSearchComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.sample).toEqual('Make an Angular Library. Go ahead. Make one :)');
  });*/

});
