# ngx-magicsearch [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

|        Branch        |       Build Status     |   Dependency Status  |  devDependency Status  |         Version        |
| ---------------------|------------------------|----------------------|------------------------|:----------------------:|
| Master               | [![Build Status](https://travis-ci.org/umens/ngx-magicsearch.svg?branch=master)](https://travis-ci.org/umens/ngx-magicsearch) | [![Dependency Status](https://david-dm.org/umens/ngx-magicsearch/master/status.svg)](https://david-dm.org/umens/ngx-magicsearch/master#info=dependencies) | [![devDependency Status](https://david-dm.org/umens/ngx-magicsearch/master/dev-status.svg)](https://david-dm.org/umens/ngx-magicsearch/master#info=devDependencies) | 1.0.0 |
| Develop              | [![Build Status](https://travis-ci.org/umens/ngx-magicsearch.svg?branch=develop)](https://travis-ci.org/umens/ngx-magicsearch)      | [![Dependency Status](https://david-dm.org/umens/ngx-magicsearch/develop/status.svg)](https://david-dm.org/umens/ngx-magicsearch/develop#info=dependencies) | [![devDependency Status](https://david-dm.org/umens/ngx-magicsearch/develop/dev-status.svg)](https://david-dm.org/umens/ngx-magicsearch/develop#info=devDependencies) | 1.0.0 |

Magic Search/Faceted Search Library for Angular 2 project

![Example](http://g.recordit.co/GXi53Arzu9.gif)

## Getting Started

These instructions are here to set up the library in your project. 

See [Contributing](#Contributing) for instructions that will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- An [Angular 2](https://github.com/angular/angular) project obviously :)
- [Font-Awesome](https://github.com/FortAwesome/Font-Awesome)

### Installing

You can install ngx-magicsearch by using npm.

```
npm install ngx-magicsearch --save
```
Add `NgxMagicSearchBarModule` to your module, eg.
```javascript
import { NgxMagicSearchBarModule } from 'ngx-magicsearch';

@NgModule({
  imports: [ NgxMagicSearchBarModule ]
  // ...
})
export class AppModule {
}
```
### Docs
And you can use selector `ngx-magic-search` in your template.
HTML
```html
<ngx-magic-search [strings]="lang" [facets_param]="choices" (textSearchEvent)="textSearch($event)" (searchUpdatedEvent)="searchUpdated($event)"></ngx-magic-search>
```
#### Plugin options
##### [facets_param] - *object* 
```javascript
Array<{name: string, label: string, options: Array<{key: string, label: string}>}>
```
Array of your filters - *see [example](#Example) below*
##### [strings] - *object* - *optionnal* 
```javascript
{remove: string, cancel: string, prompt: string, text: string}
```
Default value :
- remove : 'Remove facet'
- cancel : 'Clear search'
- prompt: 'Select facets or enter text'
- 'text': 'Text'
For Internationalization(i18n) purpose.

##### (searchUpdatedEvent) - *Event* 
Event fire when user select a new search term. Return an array of type 
```javascript
Array<{key: string, values: Array<string>}>
```
Where 
- key = facets_param.name
- value = facets_param.options.key

##### (textSearchEvent) - *Event* 
Event fire when user make a search with a text. Return a `string`

### Usage/Example
JavaScript
```JavaScript
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
};

textSearch(customTerm) {
	console.log(customTerm);
};
```
And
```HTML
<ngx-magic-search [facets_param]="choices" (textSearchEvent)="textSearch($event)" (searchUpdatedEvent)="searchUpdated($event)"></ngx-magic-search>
```

See image above to see the result.

## Running the tests

### tests

```
npm test
```

###### End to end tests (e2e) are comming !

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/umens/ngx-magicsearch/tags).

We use [Gitflow](http://danielkummer.github.io/git-flow-cheatsheet/) for the flow.

## Authors

* **Ulysse Mensa** - *Initial work* - [github](https://github.com/umens)

See also the list of [contributors](https://github.com/umens/ngx-magicsearch/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* original [project](https://github.com/eucalyptus/magic-search) for angular v1 by [eucalyptus](https://github.com/eucalyptus)
