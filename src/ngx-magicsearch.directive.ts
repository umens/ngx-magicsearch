import { Directive, ElementRef, Renderer, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[ngxFocus]'
})
export class NgxMagicSearchDirective implements OnInit, OnChanges {

  @Input() focusEvent: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.focusEvent) {
      this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
    }
  }
}
