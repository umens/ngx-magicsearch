import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class MyRenderer {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  invokeElementMethod(eleRef: ElementRef, method: string) {
    if (isPlatformBrowser(this.platformId)) {
      eleRef.nativeElement[method]();
    }
  }
}

@Directive({
  selector: '[ngxMagicSearch]'
})
export class NgxMagicSearchDirective implements OnChanges {

  @Input() focusEvent: boolean;

  constructor(private el: ElementRef, private renderer: MyRenderer) { }

  ngOnChanges() {
    if (this.focusEvent) {
      this.renderer.invokeElementMethod(this.el.nativeElement, 'focus');
    }
  }
}
