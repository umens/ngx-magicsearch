import { Component } from '@angular/core';

import '../style/app.scss';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url: string = 'https://github.com/umens/ngx-magicsearch';

  constructor() {
    // Do something with sampleService
  }
}
