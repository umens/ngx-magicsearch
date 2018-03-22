import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  choices = [
    {
      'name': 'owner_alias',
      'label': 'Images owned by',
      'options': [
        {'key': '', 'label': 'Anyone'},
        {'key': 'self', 'label': 'Me (or shared with me)'}
      ]
    },
    {
      'name': 'platform',
      'label': 'Platform',
      'options': [
        {'key': 'linux', 'label': 'Linux'},
        {'key': 'windows', 'label': 'Windows'}
      ]
    },
    {
      'name': 'architecture',
      'label': 'Architecture',
      'options': [
        {'key': 'x86_64', 'label': '64-bit'},
        {'key': 'i386', 'label': '32-bit'}
      ],
    }
  ];

  searchUpdated(terms) {
    console.log(terms);
  }

  textSearch(customTerm) {
    console.log(customTerm);
  }

}
