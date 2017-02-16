import { TestBed } from '@angular/core/testing';
import {Component, EventEmitter} from '@angular/core';

import {NgxMagicSearchDirective} from './ngx-magic-search.directive';

describe('NgxMagicSearchDirective', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        NgxMagicSearchDirective
      ]
    });
  });

  /*it('should add a class', () => {
    let fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div').getAttribute('class')).toBe('sample-class');
  }); */

});

@Component({
  selector: 'ngx-test-cmp',
  template: `
  <div [ngxFocus]="myFocusTriggeringEventEmitter"></div>
  `
})
class TestComponent {

  private myFocusTriggeringEventEmitter = new EventEmitter<boolean>();

  constructor() {
    this.myFocusTriggeringEventEmitter.emit(true);
  }
}
