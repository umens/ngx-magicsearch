import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';
import { MyRenderer } from './renderer.service';

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
