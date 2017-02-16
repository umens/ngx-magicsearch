import { Component } from '@angular/core';

import '../style/app.scss';

@Component({
  selector: 'ngx-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url: string = 'https://github.com/umens/ngx-magicsearch';

  choices = [
    {'name': 'owner_alias',
      'label': 'Images owned by',
      'options':
        [{'key': '', 'label': 'Anyone'},
        {'key': 'self', 'label': 'Me (or shared with me)'}]
    },
    {'name': 'platform',
      'label': 'Platform',
      'options':
        [{'key': 'linux', 'label': 'Linux'},
        {'key': 'windows', 'label': 'Windows'}]
    },
    {'name': 'architecture',
      'label': 'Architecture',
      'options':
        [{'key': 'x86_64', 'label': '64-bit'},
        {'key': 'i386', 'label': '32-bit'}],
    }
  ];

  constructor() {
    // Do something with sampleService
  }
}
