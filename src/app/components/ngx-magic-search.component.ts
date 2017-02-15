import {Component} from '@angular/core';

@Component({
  selector: 'my-sample',
  template: `
  <div class="sample">{{sample}}</div>
  `,
  styles: ['./ngx-magic-search.component.scss']
})
export class NgxMagicSearchComponent {
  public sample: string = 'Make an Angular Library. Go ahead. Make one :)';
}
