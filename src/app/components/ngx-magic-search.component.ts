import {HostListener, Output,  OnInit,  Component,  Input,  EventEmitter} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-magic-search',
  templateUrl: './ngx-magic-search.component.html',
  styleUrls: ['./ngx-magic-search.component.scss'],
})
export class NgxMagicSearchComponent implements OnInit {

  @Input('strings') strings: {remove: string, cancel: string, prompt: string, text: string} = {remove: 'Remove facet', cancel : 'Clear search', prompt: 'Select facets or enter text', 'text': 'Text'};
  @Input('facets_param') facets_param: Array<{name: string, label: string, options: Array<{key: string, label: string}>}>|string = [];
  @Output() textSearchEvent = new EventEmitter<{searchVal: string, filter_keys: any}>();
  @Output() searchUpdatedEvent = new EventEmitter<string>();

  private setFocusedEventEmitter = new EventEmitter<boolean>();

  private searchInput: string = '';
  private promptString: string = this.strings.prompt;
  private currentSearch = [];
  private facetsObj = null;
  private facetsSave;
  private facetSelected;
  private filteredObj;
  private filter_keys;
  private filteredOptions;
  private facetOptions;
  private textSearch;
  private isMenuOpen = false;

  // event listener
  private hostEvent = null;

  ngOnInit() {
    this.initSearch();
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
    let initialFacets: any = window.location.search;
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
      that.facetsObj.forEach(function(value, idx_value) {
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
        this.textSearchEvent.emit({searchVal: searchVal, filter_keys: this.filter_keys});
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
      this.textSearchEvent.emit({searchVal: textFilter, filter_keys: this.filter_keys});
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
        this.textSearchEvent.emit({searchVal: searchVal, filter_keys: this.filter_keys});
        this.textSearch = searchVal;
      }
      this.filteredObj = this.facetsObj;
    } else {
      if (searchVal === '') {
        this.filteredObj = this.facetsObj;

        this.textSearchEvent.emit({searchVal: '', filter_keys: this.filter_keys});
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

      this.textSearchEvent.emit({searchVal: '', filter_keys: this.filter_keys});
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
    this.hideMenu();
    let curr = this.facetSelected;
    curr.name = curr.name + '=' + name;
    curr.label[1] = this.filteredOptions[index].label;
    if (Array.isArray(curr.label[1])) {
      curr.label[1] = curr.label[1].join('');
    }
    this.currentSearch.push(curr);
    this.resetState();
    this.emitQuery();
    this.showMenu();
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
      this.textSearchEvent.emit({searchVal: '', filter_keys: this.filter_keys});
      this.textSearch = undefined;
    } else {
      this.searchUpdatedEvent.emit(query);
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
      this.searchUpdatedEvent.emit('');
      this.textSearchEvent.emit({searchVal: '', filter_keys: this.filter_keys});
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
