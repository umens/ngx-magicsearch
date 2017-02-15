import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[ngxMagicSearch]'
})
export class NgxMagicSearchDirective {
  constructor(private el: ElementRef, private renderer: Renderer) {
    renderer.setElementAttribute(el.nativeElement, 'class', 'sample-class');
  }
}
