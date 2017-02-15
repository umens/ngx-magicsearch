import { TestBed } from '@angular/core/testing';

import { NgxMagicSearchComponent } from './ngx-magic-search.component';

describe('NgxMagicSearchComponent', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgxMagicSearchComponent
      ]
    });
  });

  it('should have an url', () => {
    let fixture = TestBed.createComponent(NgxMagicSearchComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.sample).toEqual('Make an Angular Library. Go ahead. Make one :)');
  });

});

