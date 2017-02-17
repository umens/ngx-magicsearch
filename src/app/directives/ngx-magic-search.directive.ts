import { Directive, ElementRef, EventEmitter, Renderer, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[ngxFocus]'
})
export class NgxMagicSearchDirective implements OnInit {

  @Input('ngxFocus') focusEvent: EventEmitter<boolean>;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.focusEvent.subscribe(event => {
      this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
    });
  }
}
