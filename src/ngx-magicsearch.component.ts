import {DoCheck, KeyValueDiffers, OnChanges, SimpleChange, HostListener, Output, OnInit, Component, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'ngx-magic-search',
  template: `
    <style>
      /* Copyright 2014-2015 Eucalyptus Systems, Inc. */
      .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-content {
        display: none;
        position: absolute;
        min-width: 160px;
        z-index: 1;
        margin-top: 4px;
      }

      .dropdown.active .dropdown-content {
        display: block;
      }

      .ngx-dropdown-menu {
        /* position: absolute; */
        /* top: 100%; */
        /* left: 0; */
        z-index: 1000;
        /* display: none; */
        /* float: left; */
        min-width: 160px;
        padding: 5px 0;
        margin: 0;
        font-size: 14px;
        text-align: left;
        list-style: none;
        background-color: #fff;
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        /* border: 1px solid #ccc; */
        /* border: 1px solid rgba(0,0,0,.15); */
        border-radius: 3px;
        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      }
      .ngx-dropdown-menu li:hover {
        cursor: pointer;
        background-color: #eaeaea;
      }

      .arrow-up {
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 7px solid white;
        margin-left: 5px;
      }

      .ngx-dropdown-menu > li > a {
        display: block;
        padding: 3px 20px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap;
      }

      .ngx-label {
        display: inline;
        padding: .2em .6em .3em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25em;
      }

      /*-----------------------------------------
        Colors
        ----------------------------------------- */
      /*-----------------------------------------
        Item list
        ----------------------------------------- */
      @-moz-document url-prefix() {
        .item-list .item {
          top: -0.40rem;
        }

        .search-selected {
          top: -0.40rem;
        }
      }
      /*-----------------------------------------
        Magic Search bar
        ----------------------------------------- */
      .search-bar {
        font-size: 14px;
        position: relative;
        border: 1px solid #ccc;
        background-color: white;
        /* padding: 0.5rem; */
        height: auto;
      }
      .search-bar i.fa-filter {
        color: #6a737b;
        position: absolute;
        top: 0.75rem;
        left: 0.65rem;
        font-size: 18px;
      }
      .search-bar .search-main-area {
        position: relative;
        margin-left: 2.75rem;
        margin-right: 2.75rem;
        cursor: text;
        text-align: left;
      }
      .search-bar .item-list {
        position: relative;
        /*display: inline-block;*/
        /*height: 20px;*/
        margin-top: 9px;
        float: left;
      }
      .search-bar .item-list .item {
        color: #333;
        background-color: #e6e7e8;
        /* height: 30px; */
        margin-right: 0.5rem;
        display: inline-block;
        padding: 6px;
        font-size: 0.80rem;
        /* font-size: 12px; */
        /* margin-top: 8px; */
      }
      .search-bar .item-list .item a {
        color: white;
      }
      .search-bar .item-list .item a.remove:hover {
        cursor: pointer;
      }
      .search-bar .search-selected {
        position: relative;
        padding-left: 0;
        padding-right: 0;
        background-color: white;
        color: #444;
      }
      .search-bar .search-entry {
        width: 18.5rem;
        /* height: 30px; */
        /* position: relative; */
        /* float: right; */
        /* margin-bottom: 8px;*/
      }
      .search-bar .search-input {
        width: 100%;
        border: 0;
        box-shadow: none;
        /* margin-bottom: 0; */
        margin: 6px 0;
        background-color: white;
        color: #444;
        height: 28px;
      }
      .search-bar .search-input:focus {
        box-shadow: none;
        background-color: white;
      }
      .search-bar .match {
        font-weight: bold;
      }
      .search-bar i.cancel {
        color: #6a737b;
        position: absolute;
        top: 0.75rem;
        right: 0.65rem;
        font-size: 18px;
      }
      .search-bar i.cancel:hover {
        color: darkred;
        cursor: pointer;
      }
    </style>
    <div class="magic-search">
      <div class="search-bar">
        <i class="fa fa-filter go"></i>
        <div class="search-main-area" (click)="enableTextEntry()">
          <span class="item-list" *ngIf="currentSearch">
            <span *ngFor="let facet of currentSearch; let i = index;" class="ngx-label radius secondary item">
              <span>{{ facet.label[0] }}:<b>{{ facet.label[1] }}</b></span>
          <a class="remove" (click)="removeFacet(i)" title="{{ strings.remove }}"><i class="fa fa-times"></i></a>
          </span>
          </span>
          <span class="search-selected ngx-label" *ngIf="facetSelected">
            {{ facetSelected.label[0] }}:
          </span>
          <!-- For bootstrap, the dropdown attribute is moved from input up to div. -->
          <div [ngClass]="{'search-entry': true, 'dropdown': true, 'active': isMenuOpen}">
            <input class="search-input" type="text" placeholder="{{ strings.prompt }}" autocomplete="off" (keyup)="handleKeyUp($event)" (keydown)="handleKeyDown($event)" (keypress)="handleKeyPress($event)" [(ngModel)]="searchInput" [ngxFocus]="setFocusedEventEmitter">
            <div class="dropdown-content" *ngIf="filteredObj.length > 0">
              <div class="arrow-up"></div>
              <ul class="ngx-dropdown-menu">
                <template [ngIf]="!facetSelected">
                  <li *ngFor="let facet of filteredObj; let i = index;">
                    <a (click)="facetClicked(i, facet.name)" *ngIf="!isMatchLabel(facet.label)">{{ facet.label }}</a>
                    <a (click)="facetClicked(i, facet.name)" *ngIf="isMatchLabel(facet.label)">
                      {{ facet.label[0] }}<span class="match">{{ facet.label[1] }}</span>{{ facet.label[2] }}
                    </a>
                  </li>
                </template>
                <template [ngIf]="facetSelected">
                  <li *ngFor="let option of filteredOptions; let i = index;">
                    <a (click)="optionClicked(i, option.key)" *ngIf="!isMatchLabel(option.label)">
                      {{ option.label }}
                    </a>
                    <a (click)="optionClicked(i, option.key)" *ngIf="isMatchLabel(option.label)">
                      {{ option.label[0] }}<span class="match">{{ option.label[1] }}</span>{{ option.label[2] }}
                    </a>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
        <a (click)="clearSearch()" *ngIf="currentSearch.length > 0" title="{{ strings.cancel }}">
          <i class="fa fa-times cancel"></i>
        </a>
      </div>
    </div>`
})
export class NgxMagicSearchComponent implements OnInit, OnChanges, DoCheck {

  @Input('strings') strings: {remove: string, cancel: string, prompt: string, text: string} = {remove: 'Remove facet', cancel : 'Clear search', prompt: 'Select facets or enter text', 'text': 'Text'};
  @Input('facets_param') facets_param: Array<{name: string, label: string, options: Array<{key: string, label: string}>}>|string = [];
  @Output() textSearchEvent = new EventEmitter<string>();
  @Output() searchUpdatedEvent = new EventEmitter<Array<{key: string, values: Array<string>}>>();

  private setFocusedEventEmitter = new EventEmitter<boolean>();

  private searchInput: string = '';
  private promptString: string = this.strings.prompt;
  private currentSearch = [];
  private facetsObj = null;
  private facetsSave;
  private facetSelected;
  private filteredObj;
  private filteredOptions;
  private facetOptions;
  private textSearch;
  private isMenuOpen = false;

  private differ: any;

  // event listener
  private hostEvent = null;

  constructor(private differs: KeyValueDiffers) {
		this.differ = differs.find({}).create(null);
	}

  ngOnInit() {
    this.initSearch();
  }

  ngOnChanges() {
    this.initSearch();
  }

	ngDoCheck() {
		var changes = this.differ.diff(this.facets_param);

		if(changes) {
      this.initSearch();
		}
	}

  /**
   *
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  initSearch(): void {
    if (typeof this.facets_param === 'string') {
      // Parse facets JSON and convert to a list of facets.
      let tmp = this.facets_param.replace(/__apos__/g, '\'').replace(/__dquote__/g, '\\"').replace(/__bslash__/g, '\\');
      this.facetsObj = JSON.parse(tmp);
    } else {
      // Assume this is a usable javascript object
      this.facetsObj = this.facets_param;
    }
    this.facetsSave = this.copyFacets(this.facetsObj);
    this.initFacets();
  };


  /**
   *
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  initFacets(): void {
    let that = this;
    // set facets selected and remove them from facetsObj
    let initialFacets: string|Array<string> = window.location.search;
    if (initialFacets.length < 1) {
      for (let i = 0; i < this.currentSearch.length; i++) {
        if (this.currentSearch[i].name.indexOf('text') !== 0) {
          if (initialFacets.length > 0) { initialFacets = initialFacets + '&'; }
          initialFacets = initialFacets + this.currentSearch[i].name;
        }
      }
      this.facetsObj = this.copyFacets(this.facetsSave);
      this.currentSearch = [];
    }
    if (initialFacets.indexOf('?') === 0) {
      initialFacets = initialFacets.slice(1);
    }
    initialFacets = initialFacets.split('&');
    if (initialFacets.length > 1 || initialFacets[0].length > 0) {
      setTimeout(() => {
        this.strings.prompt = '';
      }, 0.1);
    }
    initialFacets.forEach(function (facet, idx) {
      let facetParts = facet.split('=');
      that.facetsObj.forEach(function(value, idx_value: number) {
        if (value.name === facetParts[0]) {
          if (value.options === undefined) {
            that.currentSearch.push({ 'name': facet, 'label': [value.label, facetParts[1]] });
            // allow free-form facets to remain
          } else {
            value.options.forEach(function(option, idx_option) {
              if (option.key === facetParts[1]) {
                that.currentSearch.push({ 'name': facet, 'label': [value.label, option.label] });
                if (value.singleton === true) {
                  that.deleteFacetEntirely(facetParts);
                } else {
                  that.deleteFacetSelection(facetParts);
                }
              }
            });
          }
        }
      });
    });
    if (this.textSearch !== undefined) {
      this.currentSearch.push({ 'name': 'text=' + this.textSearch, 'label': [this.strings.text, this.textSearch] });
    }
    this.filteredObj = this.facetsObj;
  };

  /**
   * add a facets javascript object to the existing list
   *
   * @param {any} facets
   *
   * @memberOf NgxMagicSearchComponent
   */
  addFacets(facets): void {
    let that = this;
    facets.forEach(function(facet) {
      that.facetsObj.append(facet);
    });
  };

  /**
   *
   *
   * @param {any} facets
   * @returns {*}
   *
   * @memberOf NgxMagicSearchComponent
   */
  copyFacets(facets): any {
    let ret = [];
    for (let i = 0; i < facets.length; i++) {
      let facet = Object.create(facets[i]);
      if (facets[i].options !== undefined) {
        facet.options = [];
        for (let j = 0; j < facets[i].options.length; j++) {
          facet.options.push(Object.create(facets[i].options[j]));
        }
      }
      ret.push(facet);
    }
    return ret;
  };

  /**
   *
   *
   * @param {any} facetParts
   *
   * @memberOf NgxMagicSearchComponent
   */
  deleteFacetSelection(facetParts): void {
    let that = this;
    this.facetsObj.slice().forEach(function (facet, idx) {
      if (facet.name === facetParts[0]) {
        if (facet.options === undefined) {
          return;  // allow free-form facets to remain
        }
        for (let i = 0; i < facet.options.length; i++) {
          let option = facet.options[i];
          if (option.key === facetParts[1]) {
            that.facetsObj[idx].options.splice(that.facetsObj[idx].options.indexOf(option), 1);
          }
        }
        if (facet.options.length === 0) {
          that.facetsObj.splice(that.facetsObj.indexOf(facet), 1);
        }
      }
    });
  };

  /**
   * remove entire facet
   *
   * @param {any} facetParts
   *
   * @memberOf NgxMagicSearchComponent
   */
  deleteFacetEntirely(facetParts): void {
    let that = this;
    this.facetsObj.slice().forEach(function (facet, idx) {
      if (facet.name === facetParts[0]) {
        that.facetsObj.splice(that.facetsObj.indexOf(facet), 1);
      }
    });
  };

  /**
   * try filtering facets/options.. if no facets match, do text search
   *
   * @param {string} searchVal
   * @returns {void}
   *
   * @memberOf NgxMagicSearchComponent
   */
  filterFacets(searchVal: string): void {
    let i, idx, label;
    let filtered = [];
    if (this.facetSelected === undefined) {
      this.filteredObj = this.facetsObj;
      for (i = 0; i < this.filteredObj.length; i++) {
        let facet = this.filteredObj[i];
        idx = facet.label.toLowerCase().indexOf(searchVal);
        if (idx > -1) {
          label = [facet.label.substring(0, idx), facet.label.substring(idx, idx + searchVal.length), facet.label.substring(idx + searchVal.length)];
          filtered.push({ 'name': facet.name, 'label': label, 'options': facet.options });
        }
      }
      if (filtered.length > 0) {
        this.showMenu();
        setTimeout(() => {
          this.filteredObj = filtered;
        }, 0.1);
      } else {
        this.textSearchEvent.emit(searchVal);
        this.hideMenu();
      }
    } else {  // assume option search
      this.filteredOptions = this.facetOptions;
      if (this.facetOptions === undefined) { // no options, assume free form text facet
        return;
      }
      for (i = 0; i < this.filteredOptions.length; i++) {
        let option = this.filteredOptions[i];
        idx = option.label.toLowerCase().indexOf(searchVal);
        if (idx > -1) {
          label = [option.label.substring(0, idx), option.label.substring(idx, idx + searchVal.length), option.label.substring(idx + searchVal.length)];
          filtered.push({ 'key': option.key, 'label': label });
        }
      }
      if (filtered.length > 0) {
        this.showMenu();
        setTimeout(() => {
          this.filteredOptions = filtered;
        }, 0.1);
      }
    }
  };

  /**
   *
   *
   * @param {string} label
   * @returns {boolean}
   *
   * @memberOf NgxMagicSearchComponent
   */
  isMatchLabel(label: string): boolean {
    return Array.isArray(label);
  };

  /**
   *
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  resetState = function () {
    this.updateUrl('');
    this.searchInput = '';
    this.filteredObj = this.facetsObj;
    this.facetSelected = undefined;
    this.facetOptions = undefined;
    this.filteredOptions = undefined;
    if (this.currentSearch.length === 0) {
      this.strings.prompt = this.promptString;
    }
  };

  /**
   * showMenu and hideMenu depend on foundation's dropdown. They need
   * to be modified to work with another dropdown implemenation (i.e. bootstrap)
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  showMenu(): void {
    this.isMenuOpen = true;
  };

  /**
   * hide dropdown
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  hideMenu(): void {
     this.isMenuOpen = false;
  };

  /**
   *
   *
   * @param {string} query
   *
   * @memberOf NgxMagicSearchComponent
   */
  updateUrl(query: string): void {
    let url = window.location.href;
    if (url.indexOf('?') > -1) {
      url = url.split('?')[0];
    }
    if (query.length > 0) {
      url = url + '?' + query;
    }
    window.history.pushState(query, '', url);
  }

  /**
   *
   *
   * @returns {Array<{key: string, values: Array<string>}>}
   *
   * @memberOf NgxMagicSearchComponent
   */
  buildTermsArray(): Array<{key: string, values: Array<string>}> {
    let that = this;
    let returnArray: Array<{key: string, values: Array<string>}> = [];
    this.currentSearch.forEach(function(item) {
      let explode = item.name.split('=');
      if (that.getIndexBy(returnArray, 'key', explode[0]) !== -1) {
        returnArray[that.getIndexBy(returnArray, 'key', explode[0])].values.push(explode[1]);
      } else {
        returnArray.push({key: explode[0], values: [explode[1]]});
      }
    });
    return returnArray;
  }

  /**
   *
   *
   * @param {Array<any>} array
   * @param {string} key_name
   * @param {(number|string)} value
   * @returns {number}
   *
   * @memberOf NgxMagicSearchComponent
   */
  getIndexBy(array: Array<any>, key_name: string, value: number|string): number {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key_name] === value) {
        return i;
      }
    }
    return -1;
  }


  /*****************************************************************/
  /**********************        EVENTS       **********************/
  /*****************************************************************/

  /**
   *
   *
   * @param {*} event
   *
   * @memberOf NgxMagicSearchComponent
   */
  handleKeyDown(event: any): void {
    let key = event.keyCode || event.charCode;
    if (key === 9) {  // prevent default when we can.
      event.preventDefault();
    }
  };

  /**
   *
   *
   * @param {*} event
   * @returns {void}
   *
   * @memberOf NgxMagicSearchComponent
   */
  handleKeyUp(event: any): void {
    // handle ctrl-char input
    if (event.metaKey === true) {
      return;
    }
    let searchVal = this.searchInput;
    let key = event.keyCode || event.charCode;
    if (key === 9) {  // tab, so select facet if narrowed down to 1
      if (this.facetSelected === undefined) {
        if (this.filteredObj.length !== 1) { return; }
        this.facetClicked(0, this.filteredObj[0].name);
      } else {
        if (this.filteredOptions === undefined || this.filteredOptions.length !== 1) { return; }
        this.optionClicked(0, this.filteredOptions[0].key);
        this.resetState();
      }
      setTimeout(() => {
        this.searchInput = '';
      }, 0.1);
      return;
    }
    if (key === 27) {  // esc, so cancel and reset everthing
      setTimeout(() => {
        this.hideMenu();
        this.searchInput = '';
      }, 0.1);
      this.resetState();
      let textFilter = this.textSearch;
      if (textFilter === undefined) {
        textFilter = '';
      }
      this.textSearchEvent.emit(searchVal);
      return;
    }
    if (key === 13) {  // enter, so accept value
      // if tag search, treat as regular facet
      if (this.facetSelected && this.facetSelected.options === undefined) {
        let curr = this.facetSelected;
        curr.name = curr.name + '=' + searchVal;
        curr.label[1] = searchVal;
        this.currentSearch.push(curr);
        this.resetState();
        this.emitQuery();
        this.showMenu();
      } else { // if text search treat as search
        for (let i = 0; i < this.currentSearch.length; i++) {
          if (this.currentSearch[i].name.indexOf('text') === 0) {
            this.currentSearch.splice(i, 1);
          }
        }
        this.currentSearch.push({ 'name': 'text=' + searchVal, 'label': [this.strings.text, searchVal] });

        this.hideMenu();
        this.searchInput = '';
        this.textSearchEvent.emit(searchVal);
        this.textSearch = searchVal;
      }
      this.filteredObj = this.facetsObj;
    } else {
      if (searchVal === '') {
        this.filteredObj = this.facetsObj;

        this.textSearchEvent.emit('');
        if (this.facetSelected && this.facetSelected.options === undefined) {
          this.resetState();
        }
      } else {
        this.filterFacets(searchVal);
      }
    }
  };

  /**
   *
   *
   * @param {any} event
   * @returns {void}
   *
   * @memberOf NgxMagicSearchComponent
   */
  handleKeyPress(event): void {
    // handle character input
    let searchVal = this.searchInput;
    let key = event.which || event.keyCode || event.charCode;
    if (key !== 8 && key !== 46 && key !== 13 && key !== 9 && key !== 27) {
      searchVal = searchVal + String.fromCharCode(key).toLowerCase();
    }
    if (searchVal === ' ') {  // space and field is empty, show menu
      this.showMenu();
      setTimeout(() => {
        this.searchInput = '';
      }, 0.1);
      return;
    }
    if (searchVal === '') {
      this.filteredObj = this.facetsObj;

      this.textSearchEvent.emit('');
      if (this.facetSelected && this.facetSelected.options === undefined) {
        this.resetState();
      }
      return;
    }
    if (key !== 8 && key !== 46) {
      this.filterFacets(searchVal);
    }
  };

  /**
   * enable text entry when mouse clicked anywhere in search box
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  enableTextEntry(): void {
    this.setFocusedEventEmitter.emit(true);
    this.showMenu();
  };

  /**
   * when facet clicked, add 1st part of facet and set up options
   *
   * @param {number} index
   * @param {string} name
   *
   * @memberOf NgxMagicSearchComponent
   */
  facetClicked(index: number, name: string): void {
    this.hideMenu();
    let facet = this.filteredObj[index];
    let label = facet.label;
    if (Array.isArray(label)) {
      label = label.join('');
    }
    this.facetSelected = { 'name': facet.name, 'label': [label, ''] };
    if (facet.options !== undefined) {
      this.filteredOptions = this.facetOptions = facet.options;
      this.showMenu();
    }
    setTimeout(() => {
      this.searchInput = '';
    }, 0.1);
    this.strings.prompt = '';
    setTimeout(() => {
      this.setFocusedEventEmitter.emit(true);
    }, 0.1);
  };

  /**
   * when option clicked, complete facet and send event
   *
   * @param {number} index
   * @param {string} name
   *
   * @memberOf NgxMagicSearchComponent
   */
  optionClicked(index: number, name: string): void {
    let curr = this.facetSelected;
    curr.name = curr.name + '=' + name;
    curr.label[1] = this.filteredOptions[index].label;
    if (Array.isArray(curr.label[1])) {
      curr.label[1] = curr.label[1].join('');
    }
    this.currentSearch.push(curr);
    this.resetState();
    this.emitQuery();
    setTimeout(() => {
      this.hideMenu();
    }, 0.1);
  };
  /**
   * send event with new query string
   *
   * @param {*} removed
   *
   * @memberOf NgxMagicSearchComponent
   */
  emitQuery(removed: any = undefined): void {
    let that = this;
    let query = '';
    for (let i = 0; i < this.currentSearch.length; i++) {
      if (this.currentSearch[i].name.indexOf('text') !== 0) {
        if (query.length > 0) { query = query + '&'; }
        query = query + this.currentSearch[i].name;
      }
    }
    if (removed !== undefined && removed.indexOf('text') === 0) {
      this.textSearchEvent.emit('');
      this.textSearch = undefined;
    } else {
      this.searchUpdatedEvent.emit(this.buildTermsArray());
      this.updateUrl(query);
      if (this.currentSearch.length > 0) {
        // prune facets as needed from menus
        let newFacet = this.currentSearch[this.currentSearch.length - 1].name;
        let facetParts = newFacet.split('=');
        this.facetsSave.forEach(function (facet, idx) {
          if (facet.name === facetParts[0]) {
            if (facet.singleton === true) {
              that.deleteFacetEntirely(facetParts);
            } else {
              that.deleteFacetSelection(facetParts);
            }
          }
        });
      }
    }
  };

  /**
   * remove facet and either update filter or search
   *
   * @param {number} index
   *
   * @memberOf NgxMagicSearchComponent
   */
  removeFacet(index: number): void {
    let removed = this.currentSearch[index].name;
    this.currentSearch.splice(index, 1);
    if (this.facetSelected === undefined) {
      this.emitQuery(removed);
    } else {
      this.resetState();
      this.searchInput = '';
    }
    if (this.currentSearch.length === 0) {
      this.strings.prompt = this.promptString;
    }
    // re-init to restore facets cleanly
    this.facetsObj = this.copyFacets(this.facetsSave);
    this.currentSearch = [];
    this.initFacets();
  };

  /**
   * clear entire searchbar
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  clearSearch(): void {
    if (this.currentSearch.length > 0) {
      this.currentSearch = [];
      this.facetsObj = this.copyFacets(this.facetsSave);
      this.resetState();
      this.searchUpdatedEvent.emit(null);
      this.textSearchEvent.emit('');
    }
  };

  /** Catch click outside of the component */

  // When the event has bubbled its way up to the global event handler,
  // I check to see if the given event is the same event that was
  // tracked by the host.
  @HostListener('document:click', ['$event'])
    compareEvent( globalEvent ): void {
      // If the last known host event and the given global event are
      // the same reference, we know that the event originated within
      // the host (and then bubbled up out of the host and eventually
      // hit the global binding). As such, it can't be an "outside"
      // event and therefore we should ignore it.
      if ( this.hostEvent === globalEvent ) {
        return;
      }
      // Now that we know the event was initiated outside of the host,
      // we can emit the output event. By convention above, we know
      // that we can simply use the event type to reference the
      // correct output event stream.
      this.hideMenu();
  };

  // I start tracking the new host event triggered by one of the core
  // DOM event bindings.
  @HostListener('click', ['$event'])
    trackEvent( newHostEvent ): void {
      this.hostEvent = newHostEvent;
  };

}
