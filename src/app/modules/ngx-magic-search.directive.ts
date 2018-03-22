import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[ngxMagicSearch]'
})
export class NgxMagicSearchDirective implements OnChanges {

  @Input() focusEvent: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnChanges() {
    if (this.focusEvent) {
      this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
    }
  }
}
