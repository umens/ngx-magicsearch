import { DoCheck, KeyValueDiffers, OnChanges, HostListener,
  Output, OnInit, Component, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-magic-search',
  templateUrl: './ngx-magic-search.component.html',
  styleUrls: ['./ngx-magic-search.component.css']
})
export class NgxMagicSearchComponent implements OnInit, OnChanges, DoCheck {

  @Input('strings') strings: {remove: string, cancel: string, prompt: string, text: string} = {
    remove: 'Remove facet',
    cancel : 'Clear search',
    prompt: 'Select facets or enter text',
    'text': 'Text'
  };

  @Input('facets_param') facets_param: any = [];
  /*Array<{name: string, label: string, options: Array<{key: string, label: string}>}>|string*/

  @Output() textSearchEvent = new EventEmitter<string>();
  @Output() searchUpdatedEvent = new EventEmitter<Array<{key: string, values: Array<string>}>>();

  setFocusedEventEmitter = false;

  searchInput: string;
  private promptString: string = this.strings.prompt;
  currentSearch = [];
  private facetsObj = null;
  private facetsSave;
  facetSelected;
  filteredObj;
  filteredOptions;
  private facetOptions;
  private textSearch;
  isMenuOpen = false;

  private differ: any;

  // event listener
  private hostEvent = null;

  constructor(private differs: KeyValueDiffers) {
    this.differ = differs.find({}).create();
    this.searchInput = '';
  }

  ngOnInit() {
    this.initSearch();
  }

  ngOnChanges() {
    this.initSearch();
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.facets_param);

    if (changes) {
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
      const tmp = this.facets_param.replace(/__apos__/g, '\'').replace(/__dquote__/g, '\\"').replace(/__bslash__/g, '\\');
      this.facetsObj = JSON.parse(tmp);
    } else {
      // Assume this is a usable javascript object
      this.facetsObj = this.facets_param.slice(0);
    }
    this.facetsSave = this.copyFacets(this.facetsObj);
    this.currentSearch = [];
    this.initFacets();
  }


  /**
   *
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  initFacets(): void {
    const that = this;
    // set facets selected and remove them from facetsObj
    let initialFacets: string|Array<string> = (window.location.hash.split('?')[1] === undefined)
      ? '' : '?' + window.location.hash.split('?')[1];
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
      const facetParts = facet.split('=');
      facetParts[1] = facet.split('=').splice(1).join('=');
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
  }

  /**
   * add a facets javascript object to the existing list
   *
   * @param facets
   *
   * @memberOf NgxMagicSearchComponent
   */
  addFacets(facets): void {
    const that = this;
    facets.forEach(function(facet) {
      that.facetsObj.append(facet);
    });
  }

  /**
   *
   *
   * @param facets
   * @returns
   *
   * @memberOf NgxMagicSearchComponent
   */
  copyFacets(facets): any {
    const ret = [];
    for (let i = 0; i < facets.length; i++) {
      const facet = Object.create(facets[i]);
      if (facets[i].options !== undefined) {
        facet.options = [];
        for (let j = 0; j < facets[i].options.length; j++) {
          facet.options.push(Object.create(facets[i].options[j]));
        }
      }
      ret.push(facet);
    }
    return ret;
  }

  /**
   *
   *
   * @param facetParts
   *
   * @memberOf NgxMagicSearchComponent
   */
  deleteFacetSelection(facetParts): void {
    const that = this;
    this.facetsObj.slice().forEach(function (facet, idx) {
      if (facet.name === facetParts[0]) {
        if (facet.options === undefined) {
          return;  // allow free-form facets to remain
        }
        for (let i = 0; i < facet.options.length; i++) {
          const option = facet.options[i];
          if (option.key === facetParts[1]) {
            that.facetsObj[idx].options.splice(that.facetsObj[idx].options.indexOf(option), 1);
          }
        }
        if (facet.options.length === 0) {
          that.facetsObj.splice(that.facetsObj.indexOf(facet), 1);
        }
      }
    });
  }

  /**
   * remove entire facet
   *
   * @param facetParts
   *
   * @memberOf NgxMagicSearchComponent
   */
  deleteFacetEntirely(facetParts): void {
    const that = this;
    this.facetsObj.slice().forEach(function (facet, idx) {
      if (facet.name === facetParts[0]) {
        that.facetsObj.splice(that.facetsObj.indexOf(facet), 1);
      }
    });
  }

  /**
   * try filtering facets/options.. if no facets match, do text search
   *
   * @param searchVal
   * @returns
   *
   * @memberOf NgxMagicSearchComponent
   */
  filterFacets(searchVal: string): void {
    let i, idx, label;
    const filtered = [];
    if (this.facetSelected === undefined) {
      this.filteredObj = this.facetsObj;
      for (i = 0; i < this.filteredObj.length; i++) {
        const facet = this.filteredObj[i];
        idx = facet.label.toLowerCase().indexOf(searchVal);
        if (idx > -1) {
          label = [
            facet.label.substring(0, idx),
            facet.label.substring(idx, idx + searchVal.length),
            facet.label.substring(idx + searchVal.length)
          ];
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
        const option = this.filteredOptions[i];
        idx = option.label.toLowerCase().indexOf(searchVal);
        if (idx > -1) {
          label = [
            option.label.substring(0, idx),
            option.label.substring(idx, idx + searchVal.length),
            option.label.substring(idx + searchVal.length)
          ];
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
  }

  /**
   *
   *
   * @param label
   * @returns
   *
   * @memberOf NgxMagicSearchComponent
   */
  isMatchLabel(label: string): boolean {
    return Array.isArray(label);
  }

  /**
   *
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  resetState(): void {
    this.updateUrl('');
    this.searchInput = '';
    this.filteredObj = this.facetsObj;
    this.facetSelected = undefined;
    this.facetOptions = undefined;
    this.filteredOptions = undefined;
    if (this.currentSearch.length === 0) {
      this.strings.prompt = this.promptString;
    }
  }

  /**
   * showMenu and hideMenu depend on foundation's dropdown. They need
   * to be modified to work with another dropdown implemenation (i.e. bootstrap)
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  showMenu(): void {
    this.isMenuOpen = true;
  }

  /**
   * hide dropdown
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  hideMenu(): void {
     this.isMenuOpen = false;
  }

  /**
   *
   *
   * @param query
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
   * @returns
   *
   * @memberOf NgxMagicSearchComponent
   */
  buildTermsArray(): Array<{key: string, values: Array<string>}> {
    const that = this;
    const returnArray: Array<{key: string, values: Array<string>}> = [];
    this.currentSearch.forEach(function(item) {
      const explode = item.name.split('=');
      explode[1] = item.name.split('=').splice(1).join('=');
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
   * @param array
   * @param key_name
   * @param value
   * @returns
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
   * @param event
   *
   * @memberOf NgxMagicSearchComponent
   */
  handleKeyDown(event: any): void {
    const key = event.keyCode || event.charCode;
    if (key === 9) {  // prevent default when we can.
      event.preventDefault();
    }
  }

  /**
   *
   *
   * @param event
   * @returns
   *
   * @memberOf NgxMagicSearchComponent
   */
  handleKeyUp(event: any): void {
    // handle ctrl-char input
    if (event.metaKey === true) {
      return;
    }
    const searchVal = this.searchInput;
    const key = event.keyCode || event.charCode;
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
        const curr = this.facetSelected;
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

    // Remove facet on backspace
    if (key === 8) {
      if (this.currentSearch.length > 0) {
        const rightmostFacetIndex = this.currentSearch.length - 1;

        if (!this.currentSearch[rightmostFacetIndex].markedForDeletion) {
          this.currentSearch[rightmostFacetIndex].markedForDeletion = true;
        } else {
          this.removeFacet(rightmostFacetIndex);
        }
      }
    } else {
      // If any key other than backspace is pressed we unmark all facets.
      this.unmarkAllFacets();
    }
  }

  unmarkAllFacets(): void {
    for (const facet of this.currentSearch) {
      facet.markedForDeletion = false;
    }
  }

  /**
   *
   *
   * @param event
   * @returns
   *
   * @memberOf NgxMagicSearchComponent
   */
  handleKeyPress(event): void {
    // handle character input
    let searchVal = this.searchInput;
    const key = event.which || event.keyCode || event.charCode;
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
  }

  /**
   * enable text entry when mouse clicked anywhere in search box
   *
   *
   * @memberOf NgxMagicSearchComponent
   */
  enableTextEntry(): void {
    this.setFocusedEventEmitter = true;
    this.showMenu();
  }

  /**
   * when facet clicked, add 1st part of facet and set up options
   *
   * @param index
   * @param name
   *
   * @memberOf NgxMagicSearchComponent
   */
  facetClicked(index: number, name: string): void {
    this.hideMenu();
    const facet = this.filteredObj[index];
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
      this.setFocusedEventEmitter = true;
    }, 0.1);
  }

  /**
   * when option clicked, complete facet and send event
   *
   * @param index
   * @param name
   *
   * @memberOf NgxMagicSearchComponent
   */
  optionClicked(index: number, name: string): void {
    const curr = this.facetSelected;
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
  }

  /**
   *
   *
   * @param category
   * @param option
   *
   * @memberOf NgxMagicSearchComponent
   */
  addFilterManually(category: string, option: string): void {
    const indexCategory: number = this.filteredObj.findIndex(categoryElement => categoryElement.name === category);
    const indexOption: number = (indexCategory !== -1) ?
      this.filteredObj[indexCategory].options.findIndex(optionElement => optionElement.key === option) : -1;
    if (indexCategory !== -1 && indexOption !== -1) {
      this.facetClicked(indexCategory, category);
      this.optionClicked(indexOption, option);
    }
  }

  /**
   *
   *
   * @param category
   * @param option
   *
   * @memberOf NgxMagicSearchComponent
   */
  removeFilterManually(category: string, option: string): void {
    const indexSearch: number = this.currentSearch.findIndex(searchElement => searchElement.name === category + '=' + option);
    if (indexSearch !== -1) {
        this.removeFacet(indexSearch);
    }
  }

  /**
   * send event with new query string
   *
   * @param removed
   *
   * @memberOf NgxMagicSearchComponent
   */
  emitQuery(removed?: any | undefined): void {
    const that = this;
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
        const newFacet = this.currentSearch[this.currentSearch.length - 1].name;
        const facetParts = newFacet.split('=');
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
  }

  /**
   * remove facet and either update filter or search
   *
   * @param index
   *
   * @memberOf NgxMagicSearchComponent
   */
  removeFacet(index: number): void {
    const removed = this.currentSearch[index].name;
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
    this.initFacets();
  }

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
  }

  /** Catch click outside of the component */

  // When the event has bubbled its way up to the global event handler,
  // I check to see if the given event is the same event that was
  // tracked by the host.
  @HostListener('document:click', ['$event'])
    compareEvent( globalEvent ): void {
      // Unmark all facets on document click.
      this.unmarkAllFacets();

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
  }

  // I start tracking the new host event triggered by one of the core
  // DOM event bindings.
  @HostListener('click', ['$event'])
    trackEvent( newHostEvent ): void {
      this.hostEvent = newHostEvent;
  }

}
