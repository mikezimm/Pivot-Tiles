import * as React from 'react';
import styles from './PivotTiles.module.scss';
import tileStyles from './../TileItems/PivotTileItem.module.scss';

import { IPivotTilesProps } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';
import PivotTileItem from './../TileItems/PivotTileItem';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { escape } from '@microsoft/sp-lodash-subset';
import Utils from './utils';
import tUtils from './../TileItems/utilTiles';
import InfoPage from '../HelpInfo/infoPages';
import  EarlyAccess from '../HelpInfo/EarlyAccess';

import * as links from '../HelpInfo/AllLinks';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, autobind } from 'office-ui-fabric-react';
//https://pnp.github.io/pnpjs/documentation/polyfill/ -- Needed to select/extend pnpJs in IE11
import "@pnp/polyfill-ie11";
import { sp, Web } from '@pnp/sp';
import * as strings from 'PivotTilesWebPartStrings';

import * as ErrorMessages from './ErrorMessages';
import MyCommandBar from '../CommandBar/CommandBar';

import { pivotOptionsGroup, } from '../../../../services/propPane';

import * as myErrors from './ErrorMessages';
import * as tileBuilders from './TileBuilder';

import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../../../services/createAnalytics';

import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';



export default class PivotTiles extends React.Component<IPivotTilesProps, IPivotTilesState> {

  //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about setting constructor
//  public constructor(props:IPivotTilesProps){
  public constructor(props:IPivotTilesProps){
    super(props);
    this.state = { 
      allTiles:[],
      filteredTiles:[],
      lastFilteredTiles:[],
      heroTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
      pivotDefSelKey:"",
      loadStatus:"Loading",
      showTips: "none",
      loadError: "",
      lookupColumns: [],
      showOtherTab: false,
      heroCategory: this.props.heroCategory,
      searchShow: true,
      shuffleShow: true,
      searchCount: 0,
      searchWhere: '',
      searchType: '',
      listStaticName: this.props.listTitle,
      heroCategoryError: false,
      listError: false,
      itemsError: false,
      heroError: false,
      setLayout: this.props.setSize,
      colCategory: this.props.colCategory,
      thisCatColumn: 'category',
    };

    console.log('PivotTiles.tsx Constructor: this.props', this.props);

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    this.onLinkClick = this.onLinkClick.bind(this);
    this.toggleTips = this.toggleTips.bind(this);
    this.minimizeTiles = this.minimizeTiles.bind(this);
    this.searchMe = this.searchMe.bind(this);
    this.showAll = this.showAll.bind(this);
    this.toggleLayout = this.toggleLayout.bind(this);
    this.onChangePivotClick = this.onChangePivotClick.bind(this);
    
  }

  public componentDidMount() {
    //Not using this function because it just did not want to work.
    //this._loadListItems();
    this._getListItems();
    //alert('this.props.heroCategory.length');
    //alert(this.props);
  }
  
  public componentDidUpdate(prevProps){

    //alert('componentDidUpdate 1');

    let rebuildTiles = false;
    if (this.props.setTab !== prevProps.setTab) {  rebuildTiles = true ; }
    if (this.props.setSize !== prevProps.setSize) {  rebuildTiles = true ; }
    if (this.props.showHero !== prevProps.showHero) {  rebuildTiles = true ; }
    if (this.props.heroType !== prevProps.heroType) {  rebuildTiles = true ; }
    if (this.props.setRatio !== prevProps.setRatio) {  rebuildTiles = true ; }
    if (this.props.setImgFit !== prevProps.setImgFit) {  rebuildTiles = true ; }
    if (this.props.setImgCover !== prevProps.setImgCover) {  rebuildTiles = true ; }
    if (this.props.heroCategory !== prevProps.heroCategory) {  rebuildTiles = true ; }
    if (this.props.heroRatio !== prevProps.heroRatio) {  rebuildTiles = true ; }    

    if (rebuildTiles === true) {
      this._updateStateOnPropsChange({});
    }
  }

  public createCarousels(thisState){
    let elemnts = [];
    if (thisState.heroTiles[0]){
      elemnts = thisState.heroTiles.map(newTile => (
        <div>
          {newTile.title}
        </div>
        ));
    }

    return (
      elemnts
    );
  }

  public render(): React.ReactElement<IPivotTilesProps> {
    let heroFullLineBuild : any = "";

    if (this.props.showHero === true && this.state.heroCategory) {
      if (this.state.loadStatus === "Ready" &&  this.state.heroStatus === "Ready") {
        heroFullLineBuild = tileBuilders.heroBuilder(this.props,this.state);
      }
    }

    // This will just put title text per createCarousels.
    //let carouselElements: JSX.Element[] = this.createCarousels(this.state) ;
    // This will put formatted tiles in place.  When width = 1 it looks great.
    
    let carouselBuilder = (this.state.heroTiles[0]) ? tileBuilders.carouselBuilder(this.props,this.state) : "";

    let carouselLayout = (this.state.heroTiles[0]) ? tileBuilders.carouselLayout(this.props,this.state,this.state.heroTiles, this.state.heroCategory) : "";

    const infoPage = <div>
      <InfoPage 
          allLoaded={ true }
          showInfo={ true }
          parentListName={ this.props.listWebURL } 
          parentListURL={ this.props.listTitle }
          parentProps= { this.props }
          parentState= { this.state }
      ></InfoPage>
    </div>;

    let buildTips = myErrors.buildTips(this.props,this.state);

    let gridLayout = (this.state.heroTiles[0]) ? tileBuilders.gridLayout(this.props,this.state,this.state.heroTiles, this.state.heroCategory) : "";
        
    let tileBuild;
    let listBuild = tileBuilders.listViewBuilder(this.props,this.state,this.state.filteredTiles, this.state.heroCategory);

    if (this.state.setLayout === "Card") {
      tileBuild = tileBuilders.gridLayout(this.props,this.state,this.state.filteredTiles, this.state.heroCategory);
    } else if (this.state.setLayout === "List") {
      tileBuild = tileBuilders.listViewBuilder(this.props,this.state,this.state.filteredTiles, this.state.heroCategory);
    } else {
      tileBuild = tileBuilders.tileBuilder(this.props,this.state);
    }
    
    let noListFound = myErrors.NoListFound(this.props,this.state);

    let noItemsFound = myErrors.NoItemsFound(this.props,this.state);

    let loadingSpinner = myErrors.LoadingSpinner(this.state);

    const defIndex = (this.state.pivotDefSelKey === '') ? Utils.convertCategoryToIndex(this.props.setTab) : Utils.convertCategoryToIndex(this.state.pivotDefSelKey);

    console.log('render(): this.state', this.state);
    console.log('render(): this.props.setTab', this.props.setTab);
    console.log('render(): this.state.pivotDefSelKey', this.state.pivotDefSelKey);
    console.log('render(): defIndex', defIndex);

    let tipError = false;
    if (this.state.itemsError || this.state.listError || this.state.heroError){ tipError = true; }

    let changePivots = this.props.enableChangePivots !== true ? null :
        <div className={[styles.floatLeft,styles.padLeft20,( this.state.shuffleShow ? styles.showSearch: styles.hideSearch )].join(' ')} >
          <div className={styles.quickTabsGroup}>

            <div className={styles.quickTabsLable}>
              { 'Change Pivots' }
            </div>
            { /* New Pivot for dynamic categories */ }
            <Pivot 
              style={{ flexGrow: 1, paddingLeft: '10px' }}
              //linkSize= { pivotOptionsGroup.getPivSize(this.props.setPivSize) }
              //linkFormat= { pivotOptionsGroup.getPivFormat(this.props.setPivFormat) }
              onLinkClick= { this.onChangePivotClick.bind(this) }  //{this.specialClick.bind(this)}
              defaultSelectedKey={ this.props.colCategory }
              headersOnly={true}>

                <PivotItem headerText={this.props.colCategory} itemKey={'category'}/>
                <PivotItem headerText={'Modified'} itemKey={'modified'}/>
                <PivotItem headerText={'Created'} itemKey={'created'}/>
                <PivotItem headerText={'Modified By'} itemKey={'modifiedByTitle'}/>
                <PivotItem headerText={'Created By'} itemKey={'createdByTitle'}/>
            </Pivot>

            { /* 'Searching ' + (this.state.searchType !== 'all' ? this.state.filteredTiles.length : ' all' ) + ' items' */ }
          </div>
        </div>;

      let earlyAccess = 
      <EarlyAccess 
          image = { "https://autoliv.sharepoint.com/sites/crs/PublishingImages/Early%20Access%20Image.png" }
          messages = { [ <div><span><b>Welcome to ALV Webpart Early Access!!!</b></span></div>, "Get more info here -->"] }
          links = { [ links.gitRepoPivotTiles.wiki, links.gitRepoPivotTiles.issues ]}
          email = { 'mailto:General - WebPart Dev <0313a49d.Autoliv.onmicrosoft.com@amer.teams.ms>?subject=Pivot Tiles Webpart Feedback&body=Enter your message here :)  \nScreenshots help!' }
          farRightIcons = { [ ] }
      ></EarlyAccess>;

    return (
      <div>
        { earlyAccess }
        { ( (this.props.showHero === true && this.props.heroType === "header" &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) : ""  ) }

      <div className={styles.pivotTiles}>

        <div className={styles.container}>
          
          {/*( gridLayout  )*/}

          {/*//https://developer.microsoft.com/en-us/fabric#/controls/web/pivot*/}

            <div className={styles.floatLeft}>
              <Pivot 
                style={{ flexGrow: 1, paddingLeft: '10px' }}
                linkSize= { pivotOptionsGroup.getPivSize(this.props.setPivSize) }
                linkFormat= { pivotOptionsGroup.getPivFormat(this.props.setPivFormat) }
                onLinkClick= { this.onLinkClick.bind(this) }  //{this.specialClick.bind(this)}
                defaultSelectedKey={ defIndex }
                headersOnly={true}>
                  {this.createPivots(this.state,this.props)}
              </Pivot>
              <MyCommandBar
                toggleTips= { this.toggleTips }
                minimizeTiles= { this.minimizeTiles.bind(this) }
                searchMe= { this.searchMe.bind(this) }
                showAll= { this.showAll.bind(this) }
                toggleLayout= { this.toggleLayout.bind(this) }
                commandClass = {(tipError ? 'warnTips' : '') }
                setLayout = { this.state.setLayout }
                
              />
            </div>
          <div>
          </div>
          <br/>

          { changePivots }


          { ( this.state.showTips === "yes" ? ( infoPage ) : "" ) }

          {/*https://developer.microsoft.com/en-us/fabric#/controls/web/searchbox*/}
          <div className={[styles.floatLeft,styles.padLeft20,( this.state.searchShow ? styles.showSearch: styles.hideSearch )].join(' ')} >
            <SearchBox
              className={styles.searchBox}
              styles={{ root: { maxWidth: 300 } }}
              placeholder="Search"
              onSearch={ this.searchForItems.bind(this) }
              onFocus={ () => console.log('this.state',  this.state) }
              onBlur={ () => console.log('onBlur called') }
              onChange={ this.searchForItems.bind(this) }
            />
            <div className={styles.searchStatus}>
              { 'Searching about ' + this.state.searchCount + ' items' + this.state.searchWhere }
              { /* 'Searching ' + (this.state.searchType !== 'all' ? this.state.filteredTiles.length : ' all' ) + ' items' */ }
            </div>
          </div>

          { ( this.props.showHero === true && this.props.heroType === "left" ? ( heroFullLineBuild ) : ""  ) }
          { ( this.props.showHero === true && this.props.heroType === "right" ? ( heroFullLineBuild ) : ""  ) }
          { ( (this.props.showHero === true && this.props.heroType === "carouselLayout" &&  this.state.heroStatus === "Ready") ? ( carouselLayout ) : ""  ) }



          { ( (this.props.showHero === true && this.props.heroType === "carousel" &&  this.state.heroStatus === "Ready") ? ( carouselBuilder ) : ""  ) }
          { ( ( this.props.showHero === true && this.props.heroType === "inLine"  &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) : ""  ) }

            { ( tileBuild ) }
            { /* Originally instead of this:  ( tileBuild ) */ }           

            <div className={styles.tableRow}>
            { ( loadingSpinner ) }
            { ( noListFound )}
            { ( noItemsFound )}

            </div>


        </div>
        { ( (this.props.showHero === true && this.props.heroType === "footer"  &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) :""  ) }
      </div>
      </div>
    );
  }

  private _handleSettingsIconClick = (item: PivotItem): void => {
    alert('Hi!');
  }

  private searchMe = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    console.log(e);
    let searchType = "";
    let newSearchShow =  e.altKey === true ? true : !this.state.searchShow;
    let searchCount = this.state.lastFilteredTiles.length;
    let searchWhere = this.state.searchWhere;
    if (e.altKey) { 
      searchType = "all";
      newSearchShow = true;
      searchCount = this.state.allTiles.length;
      searchWhere = ' in all categories';
    }
    
    console.log('newSearchShow: ', newSearchShow, searchType);
    this.setState({
      searchType: searchType,
      searchShow: ( e.altKey === true ? true : !this.state.searchShow ),
      lastFilteredTiles: (searchType === 'all' ? this.state.allTiles : this.state.lastFilteredTiles ),
      searchCount: searchCount,
      searchWhere: searchWhere,
    });

    
  } //End searchMe

  public searchForItems = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
 
    console.log('searchForItems: e',e);

      console.log('searchForItems: item', item);
      console.log('searchForItems: this', this);
          /*
    */

    let searchItems = [];
    if (this.state.searchType === 'all'){
      searchItems =this.state.allTiles;
    } else {
      searchItems =this.state.lastFilteredTiles;
    }
    let searchCount = searchItems.length;
    let newFilteredTiles = [];
    for (let thisTile of searchItems) {
      let fileName = thisTile.href.substring(thisTile.href.lastIndexOf('/'));

      let searchString = 'title:' + thisTile.title.toLowerCase() + 'tescription:' + thisTile.description.toLowerCase() + 'href:' + fileName;
      if(searchString.indexOf(item.toLowerCase()) > -1) {
        //console.log('fileName', fileName);
        newFilteredTiles.push(thisTile);
      }
    }

    searchCount = newFilteredTiles.length;

    this.setState({
      filteredTiles: newFilteredTiles,
      searchCount: searchCount,
    });


    return ;
    
  } //End searchForItems

  public onLinkClick = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    if (e.ctrlKey) {
      //Set clicked pivot as the hero pivot
      this._updateStateOnPropsChange({heroCategory: item.props.headerText});

    } else if (e.altKey) {
      //Enable-disable ChangePivots options
      this.setState({
        shuffleShow: !this.state.shuffleShow,
      });

    } else {
            //Filter tiles per clicked category

      const defaultSelectedIndex = this.state.pivtTitles.indexOf(item.props.headerText);
      let defaultSelectedKey = defaultSelectedIndex.toString();
      defaultSelectedKey = item.props.headerText.toString();  // Added this because I think this needs to be the header text, not the index.
      defaultSelectedKey = Utils.convertCategoryToIndex(defaultSelectedKey);

      let categoryInfo = this.state.categoryInfo;
      let createdInfo = this.state.createdInfo;
      let modifiedInfo = this.state.modifiedInfo;
      let modifiedByInfo = this.state.modifiedByInfo;
      let createdByInfo = this.state.createdByInfo;

      let newFilteredTiles = [];
      let pivotProps = this.props;
      let pivotState = this.state;

//      newFiltered = this.getOnClickFilteredTiles(pivotProps, pivotState, newCollection, heroIds, newHeros, thisCatColumn, lastCategory)

      newFilteredTiles = this.getOnClickFilteredTiles(pivotProps, pivotState, this.state.allTiles, this.state.heroIds, this.state.heroTiles, this.state.thisCatColumn, item.props.headerText);

      //Save back the last pivot/tile clicked.
      let thisCatColumn = this.state.thisCatColumn;
      if (thisCatColumn === 'modified'){ modifiedInfo.lastCategory = item.props.headerText; }
      else if (thisCatColumn === 'created'){ createdInfo.lastCategory = item.props.headerText; }
      else if (thisCatColumn === 'category'){ categoryInfo.lastCategory = item.props.headerText; }
      else if (thisCatColumn === 'createdBy'){ createdByInfo.lastCategory = item.props.headerText; }
      else if (thisCatColumn === 'modifiedBy'){ modifiedByInfo.lastCategory = item.props.headerText; }

      console.log('onLinkClick: this.state', this.state);
      console.log('onLinkClick: item.props.headerText', item.props.headerText);
      console.log('onLinkClick: defaultSelectedIndex', defaultSelectedIndex);
      console.log('onLinkClick: defaultSelectedKey', defaultSelectedKey);
      this.setState({
        filteredCategory: item.props.headerText,
        filteredTiles: newFilteredTiles,
        lastFilteredTiles: newFilteredTiles,
        searchCount: newFilteredTiles.length,
        searchType: '',
        searchWhere: ' in ' + item.props.headerText,
        categoryInfo: categoryInfo,
        modifiedInfo: modifiedInfo,
        modifiedByInfo: modifiedByInfo,
        createdByInfo: createdByInfo,
        createdInfo: createdInfo,
        pivotDefSelKey: defaultSelectedKey,

      });

    }

  } //End onClick

  public onChangePivotClick = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    this._updateStateOnPropsChange({
      heroCategory: 'randDomTextIsNotACategory',
      newCatColumn: item.props.itemKey,
    });

  } //End onClick

  private showAll = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    if (e.altKey && e.shiftKey && !e.ctrlKey) { 

    } else if (e.ctrlKey) { 

    } else {
      let newFilteredTiles = [];
      for (let thisTile of this.state.allTiles) {
          let showThisTile = true;
          if (this.props.heroType !== 'none') {
            showThisTile = this.state.heroIds.indexOf(thisTile.Id.toString()) > -1 ? false : true;
          }
          if (showThisTile === true) {newFilteredTiles.push(thisTile) ; }
      }
      this.setState({
        filteredTiles: newFilteredTiles,
        lastFilteredTiles: this.state.allTiles,
        searchCount: this.state.allTiles.length,
        pivotDefSelKey: "-100",
        searchWhere: ' in all categories'
      });
    }
    
  }

  private minimizeTiles = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    console.log(e);
    if (e.altKey && e.shiftKey && !e.ctrlKey) { 

      if (strings.analyticsWeb.indexOf(this.props.tenant) === 0 ) {
        let openThisWindow = strings.analyticsWeb + '/lists/' + strings.analyticsList;
        window.open(openThisWindow, '_blank');
        event.preventDefault();
      } else {

        console.log('the analyticsWeb is not in the same tenant...',strings.analyticsWeb,this.props.tenant);

      }
    } else if (e.ctrlKey) { 

      if (strings.minClickWeb.indexOf(this.props.tenant) === 0 ) {
        let openThisWindow = strings.minClickWeb + this.props.pageContext.web.absoluteUrl;
        window.open(openThisWindow, '_blank');
        event.preventDefault();
      } else {

        console.log('the minClickWeb is not in the same tenant...',strings.minClickWeb,this.props.tenant);

      }
    } else {
      let newFilteredTiles = [];

      this.setState({
        filteredTiles: newFilteredTiles,
        lastFilteredTiles: this.state.allTiles,
        searchCount: this.state.allTiles.length,
        pivotDefSelKey: "-100",
        searchWhere: ' in all categories'
      });
    }
    


  } //End onClick

  public toggleLayout = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    let setLayout = this.state.setLayout;

    if (setLayout === "Card") {
      setLayout = this.props.setSize;
    } else if (setLayout === "List") {
      setLayout = "Card";
    } else {       setLayout = "List"; }

    this.setState({
      setLayout: setLayout,
    });

  } //End toggleTips  

  public toggleTips = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    let newshowTips = this.state.showTips === 'none' ? 'yes' : 'none';

    this.setState({
      showTips: newshowTips,
    });

  } //End toggleTips  

  //http://react.tips/how-to-create-reactjs-components-dynamically/ - based on createImage
  public createPivot(pivT) {
    console.log('createPivot: ', pivT);
    const thisItemKey :string = Utils.convertCategoryToIndex(pivT);
      return (
        <PivotItem headerText={pivT} itemKey={thisItemKey}/>
      );
  }

  public createPivots(thisState,thisProps){

    if (thisState.showOtherTab && thisState.pivtTitles.indexOf(thisProps.otherTab) === -1) {
       thisState.pivtTitles.push(thisProps.otherTab);
    }
    let piv = thisState.pivtTitles.map(this.createPivot);
    console.log('createPivots: ', piv);
    return (
      piv
    );
  }



  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  @autobind 
  private async _loadListItems(): Promise<void> {
    //This invokes the loadListItems function on the parent webpart.ts
    const listItems: IPivotTileItemProps[] = await this.props.loadListItems();

    //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
    this.setState({allTiles:listItems});

  }

  private _updateStateOnPropsChange(params: any ): void {

    console.log('_updateStateOnPropsChange params: heroCategory', params);
    let thisCatColumn = params.newCatColumn ? params.newCatColumn : 'category';
    let currentHero = (params.heroCategory) ? params.heroCategory : this.props.heroCategory;

    console.log('_updateStateOnPropsChange params: currentHero', currentHero);
    console.log('_updateStateOnPropsChange params: state', this.state);

    let newCollection = this.state.allTiles;
    let pivotProps = this.props;
    let pivotState = this.state;
    let newHeros = this.getHeroTiles(pivotProps, pivotState, newCollection, currentHero);
    let heroIds = this.getHeroIds(newHeros);
    let newFiltered = [];


    let tileCategories = Utils.buildTileCategoriesFromResponse(pivotProps, pivotState, newCollection, currentHero, thisCatColumn);
    let filteredCategory = '';
    let lastCategory = null;

    if (thisCatColumn === 'category'){
      filteredCategory = this.state.filteredCategory;

    } else if (thisCatColumn === 'modified' || thisCatColumn === 'created' || thisCatColumn === 'modifiedByTitile' || thisCatColumn === 'createdByTitle' ){
      filteredCategory = tileCategories[0];

    }

    if (thisCatColumn === 'category'){ lastCategory = this.state.categoryInfo.lastCategory; }
    else if (thisCatColumn === 'modified'){ lastCategory = this.state.modifiedInfo.lastCategory; }
    else if (thisCatColumn === 'created'){ lastCategory = this.state.createdInfo.lastCategory; }
    else if (thisCatColumn === 'modifiedByTitile'){ lastCategory = null; }
    else if (thisCatColumn === 'createdByTitle'){ lastCategory = null; }

    newFiltered = this.getOnClickFilteredTiles(pivotProps, pivotState, newCollection, heroIds, newHeros, thisCatColumn, lastCategory);

    console.log('_updateStateOnPropsChange thisCatColumn', thisCatColumn);

    console.log('_updateStateOnPropsChange tileCategories', tileCategories);
    console.log('_updateStateOnPropsChange newFiltered', newFiltered);
    console.log('_updateStateOnPropsChange lastCategory', lastCategory);

    
    //const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
    const defaultSelectedIndex = tileCategories.indexOf(lastCategory);
    let defaultSelectedKey = defaultSelectedIndex.toString();
    defaultSelectedKey = lastCategory.toString();  // Added this because I think this needs to be the header text, not the index.
    defaultSelectedKey = Utils.convertCategoryToIndex(defaultSelectedKey);
    console.log('_updateStateOnPropsChange defaultSelectedKey', defaultSelectedKey);
    defaultSelectedKey = lastCategory;

    for (let thisTile of newCollection) {
      thisTile.setTab = (thisCatColumn === 'category' ? this.props.setTab : 'newDefaultTab');
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    for (let thisTile of newFiltered) {
      thisTile.setTab = (thisCatColumn === 'category' ? this.props.setTab : 'newDefaultTab');
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    let heroSize = this.props.setSize;
    let heroFit = this.props.setImgFit;
    let heroRatio = this.props.setRatio;
    let heroCover =  this.props.setImgCover;

    if (this.props.heroType === "header" || this.props.heroType === "footer") {
        heroSize = "100";
        heroRatio = "1x1";
        heroFit = heroFit;
        heroCover = "portrait";

    } else if (this.props.heroType === "inLine") {
        heroSize = "300";
        heroRatio = "1x1";
        heroFit = heroFit;
        heroCover = "portrait";

    } else if (this.props.heroType === "left" || this.props.heroType === "right") {
        heroSize = "300"; // Force 300 high for left and right
        heroRatio = heroRatio; //Keep the same for left and right
        heroFit = heroFit;  //Cover, centerCover etc.
        heroCover = "portrait";

    } else {

    }

    if (newHeros[0]) {
      for (let thisTile of newHeros) {
        thisTile.setTab = (thisCatColumn === 'category' ? this.props.setTab : 'newDefaultTab');
        thisTile.setSize = heroSize;
        thisTile.heroType = this.props.heroType;
        thisTile.setRatio = heroRatio;
        thisTile.setImgFit = heroFit;
        thisTile.setImgCover = heroCover;
      }
    }

    console.log('_updateStateOnPropsChange: tileCategories', tileCategories);
    console.log('_updateStateOnPropsChange: lastCategory', lastCategory);
    console.log('_updateStateOnPropsChange: defaultSelectedIndex', defaultSelectedIndex);
    console.log('_updateStateOnPropsChange: defaultSelectedKey', defaultSelectedKey);

    this.setState({
      allTiles:newCollection,
      pivtTitles: tileCategories,
      pivotDefSelKey: defaultSelectedKey,
      filteredTiles: newFiltered,
      lastFilteredTiles: newFiltered,
      loadStatus:"Ready",
      heroTiles : newHeros,
      heroIds: heroIds,
      heroStatus: newHeros[0] ? "Ready" : "none",
//      heroCategoryError: (this.props.showHero === true && this.props.heroType !== "none" && this.state.heroStatus === "none") ? true : false,
      heroCategoryError: (this.props.showHero === true && this.props.heroType !== "none" && !newHeros[0]) ? true : false,
      heroError: (this.props.showHero === true && this.props.heroType !== "none" && !newHeros[0]) ? true : false,
      heroCategory: currentHero,
      searchType: '',
      searchCount: newFiltered.length,
      searchWhere: ' in ' + lastCategory,
      filteredCategory: lastCategory,
      thisCatColumn: thisCatColumn,


    });
  }

  //    private async loadListItems(): Promise<IPivotTileItemProps[]> {
    private _getListItems(): void {

      let useTileList: string = strings.DefaultTileList;
      
      if ( this.props.listTitle ) {
          useTileList = this.props.listTitle;
      }
  
      let restFilter: string = "";
      if ( this.props.setFilter ) {
        restFilter = this.props.setFilter;
      }
  
      let restSort: string = "Title";
      if ( this.props.colSort ) {
        restSort = this.props.colSort;
      }
  
      let selectCols: string = "*";
      let expandThese = "";
  
      let allColumns = this.getKeysLike(this.props,"col","Begins");
      let expColumns = this.getExpandColumns(allColumns);
      let selColumns = this.getSelectColumns(allColumns);
  
  
      selColumns.length > 0 ? selectCols += "," + selColumns.join(",") : selectCols = selectCols;
      if (expColumns.length > 0) { expandThese = expColumns.join(","); }
  
      if ( this.props.listWebURL.length > 0 ){
        let web = new Web(this.props.listWebURL);
  
        const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);
        // Getting large amount of items (over 100)
        //          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).get()
        //items.getAll().
        web.lists.getByTitle(useTileList).items
          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).getAll()
          .then((response) => {
              this.processResponse(response);
            }).catch((e) => {
              this.processCatch(e);
            });
  
      } else {
 
        /*
        console.log('useTileList',useTileList);
        console.log('selectCols',selectCols);
        console.log('expandThese',expandThese);
        console.log('restFilter',restFilter);
        console.log('restSort',restSort);        
        */
        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
            console.log('response',response);      
            this.processResponse(response);
          }).catch((e) => {
            this.processCatch(e);
          });
  
      }
  
    }  
    private processCatch(e) {
      console.log("Can't load data");
      //var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
      //alert(m);
      console.log(e);
      console.log(e.status);
      console.log(e.message);
      let sendMessage = e.status + " - " + e.message;
      this.setState({  loadStatus: "ListNotFound", loadError: e.message, listError: true, });
  
    }
  
    private processResponse(response){
  
      if (response.length === 0){
        this.setState({  loadStatus: "NoItemsFound", itemsError: true,  });
        return ;
      }
  
      const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);

      let listStaticName = this.props.listTitle;

      if (this.props.listDefinition.toLowerCase().indexOf('library') > -1) {
        listStaticName = response[0].File.ServerRelativeUrl.replace(this.props.pageContext.web.serverRelativeUrl,"");
        listStaticName = listStaticName.substring(1,listStaticName.indexOf('/',1));
      }

      
      const listURL = fixedURL + ( this.props.listDefinition.indexOf("Library") < 0 ? "lists/" : "" ) + listStaticName;
 
      const currentPageUrl = this.props.pageContext.web.absoluteUrl + this.props.pageContext.site.serverRequestPath;

      const editItemURL = listURL + (listURL.indexOf('/lists/') > -1 ? '' : '/Forms') + "/DispForm.aspx?ID=" + "ReplaceID" + "&Source=" + currentPageUrl;
      //console.log('editItemURL',editItemURL);

      let pivotProps = this.props;
      let pivotState = this.state;

      let tileCollectionResults = Utils.buildTileCollectionFromResponse(response, pivotProps, editItemURL, pivotProps.heroCategory);
      console.log('tileCollectionResults: ', tileCollectionResults);
      let tileCollection = tileCollectionResults.tileCollection;

      let tileCategories = Utils.buildTileCategoriesFromResponse(pivotProps, pivotState, tileCollection, pivotProps.heroCategory, 'category');
      
      const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
      let defaultSelectedKey = defaultSelectedIndex.toString();
      defaultSelectedKey = this.props.setTab.toString();  // Added this because I think this needs to be the header text, not the index.
      defaultSelectedKey = Utils.convertCategoryToIndex(defaultSelectedKey);
      
      tileCollectionResults.categoryInfo.lastCategory = tileCategories[0];

      let heroTiles = this.getHeroTiles(pivotProps, pivotState, tileCollection, pivotProps.heroCategory);
  
      let heroIds = this.getHeroIds(heroTiles);
  
      let newFilteredTiles = this.getNewFilteredTiles(pivotProps, pivotState, tileCollection, heroIds, heroTiles, 'category');
      console.log('processResponse: tileCategories', tileCategories);
      console.log('processResponse: this.props.setTab', this.props.setTab);   
      console.log('processResponse: defaultSelectedIndex', defaultSelectedIndex);
      console.log('processResponse: defaultSelectedKey', defaultSelectedKey);

      this.setState({
        allTiles: tileCollection,
        pivtTitles: tileCategories,
        filteredTiles: newFilteredTiles,
        lastFilteredTiles: newFilteredTiles,
        pivotDefSelKey: defaultSelectedKey,
        loadStatus:"Ready",
        heroStatus: heroTiles[0] ? "Ready" : "none",
//      heroCategoryError: (this.props.showHero === true && this.props.heroType !== "none" && this.state.heroStatus === "none") ? true : false,
        heroCategoryError: (this.props.showHero === true && this.props.heroType !== "none" && !heroTiles[0]) ? true : false,
        heroError: (this.props.showHero === true && this.props.heroType !== "none" && !heroTiles[0]) ? true : false,
        heroTiles : heroTiles,
        heroIds: heroIds,
        loadError: "",
        endTime: this.state.endTime ? this.state.endTime : getTheCurrentTime(),
        heroCategory: this.props.heroCategory,
        searchCount: newFilteredTiles.length,
        searchWhere: ' in ' + this.props.setTab,
        listStaticName: listStaticName,

        createdInfo: tileCollectionResults.createdInfo,
        modifiedInfo: tileCollectionResults.modifiedInfo,
        categoryInfo: tileCollectionResults.categoryInfo,
        modifiedByInfo: tileCollectionResults.modifiedByInfo,
        createdByInfo: tileCollectionResults.createdByInfo,

        modifiedByTitles: tileCollectionResults.modifiedByTitles,
        modifiedByIDs: tileCollectionResults.modifiedByIDs,
        createdByTitles: tileCollectionResults.createdByTitles,
        createdByIDs: tileCollectionResults.createdByIDs,

      });

      saveAnalytics(this.props,this.state);
      
      return true;
  
    }

  /**
   * This function gets the array of tiles that should be visible by removing the items that are in the heroTiles array
   * @param thisProps 
   * @param tileCollection 
   * @param heroIds 
   * @param heroTiles 
   */
  private getNewFilteredTiles(thisProps, thisState, tileCollection, heroIds, heroTiles, thisCatColumn) {
/*
    console.log('getNewFilteredTiles: thisProps',thisProps);
    console.log('getNewFilteredTiles: tileCollection',tileCollection);
    console.log('getNewFilteredTiles: heroIds',heroIds);
    console.log('getNewFilteredTiles: heroTiles',heroTiles);
    console.log('getNewFilteredTiles: thisCatColumn',thisCatColumn);
*/
    let newFilteredTiles = [];
    let usingDefinedCategoryColumn = thisCatColumn === 'category' ? true : false ;
    for (let thisTile of tileCollection) {
      const isNumber = typeof(thisTile.category);
      //console.log('isNumber',isNumber);
      if (isNumber === 'number'){

      } else if ( !usingDefinedCategoryColumn ) {

        newFilteredTiles.push(thisTile);

      } else if(thisTile.category.indexOf(thisProps.setTab) > -1) {  //This first if checks if it's the selected tab.

        let showThisTile = true;
        if (heroIds.length > 0 && thisProps.heroType !== 'none' && heroTiles[0]) {
          showThisTile = heroIds.indexOf(thisTile.Id.toString()) > -1 ? false : true;
        }
        if (showThisTile === true) {newFilteredTiles.push(thisTile);}
      }
    }

    return newFilteredTiles;
  }

  
  /**
   * This function gets the array of tiles that should be visible by removing the items that are in the heroTiles array
   * @param thisProps 
   * @param tileCollection 
   * @param heroIds 
   * @param heroTiles 
   */
  private getOnClickFilteredTiles(thisProps, thisState, tileCollection, heroIds, heroTiles, thisCatColumn, setTab) {
    /*
    console.log('getDateFilteredTiles: thisProps',thisProps);
    console.log('getDateFilteredTiles: tileCollection',tileCollection);
    console.log('getDateFilteredTiles: heroIds',heroIds);
    console.log('getDateFilteredTiles: heroTiles',heroTiles);
    console.log('getDateFilteredTiles: thisCatColumn',thisCatColumn);
*/
    // This code originally copied from onLinkClick and adjusted for multiple uses
    let newFilteredTiles = [];
    let checkThisProp = 'category';
    let propType = 'category';
    if (thisCatColumn === 'modified' || thisCatColumn === 'created'){
      checkThisProp = thisCatColumn + 'Time';
      propType = 'time';

    } else if (thisCatColumn === 'modifiedByTitle' || thisCatColumn === 'createdByTitle') {
      checkThisProp = thisCatColumn;
      propType = 'title';     
      
    }

    for (let thisTile of this.state.allTiles) {
      let tileCats = [];
      if (propType === 'category'){
        tileCats = thisTile[checkThisProp];

      } else if ( propType === 'time' ) {
        let bestFormat = thisTile[checkThisProp].cats.bestFormat[0];
        tileCats = thisTile[checkThisProp].cats[bestFormat];

      } else if ( propType === 'title' ) {
        tileCats = thisTile[checkThisProp];
      }

      if(tileCats.indexOf(setTab) > -1) {

        let showThisTile = true;
        if (this.props.heroType !== 'none') {
          showThisTile = this.state.heroIds.indexOf(thisTile.Id.toString()) > -1 ? false : true;
        }
        if (showThisTile === true) {newFilteredTiles.push(thisTile) ; }
      }
    }

    return newFilteredTiles;
  }

  /**
   * This function will get all tiles where the category matches theseHeros
   * @param thisProps 
   * @param thisState 
   * @param tileCollection 
   * @param theseHeros 
   */
  private getHeroTiles(thisProps, thisState, tileCollection, theseHeros) {

    let heroTiles = [];
            
    if (thisProps.showHero === true && theseHeros) {
      for (let thisTile of tileCollection) {
        if(thisTile.category.indexOf(theseHeros) > -1) {
          heroTiles.push(thisTile);
        }
      }
    }

    if (this.props.heroType !== 'carouselLayout') {
      //If it's not a slider, then only show one random tile.  Else show all
      var randomItem = heroTiles[Math.floor(Math.random()*heroTiles.length)];
      heroTiles = [randomItem];
    }
    return heroTiles;

  }

    /**
   * This function gets an array of the hero id's based on the array of heroTiles passed in
   * @param heroTiles 
   */
  private getHeroIds(heroTiles){
    let heroIds = [];
    if (heroTiles.length > 0){
      if (heroTiles[0]) {
        for (let thisTile of heroTiles) {
          heroIds.push(thisTile.Id.toString());
        }     
      }  
    }
    return heroIds;
  }

  private getKeysLike(thisProps,findMe,findOp){
    //Sample call:  getKeysLike(this.props,"col","begins")
    //console.log('FoundProps that ' + findOp + ' with ' + findMe);
    //console.log(thisProps);
    const allKeys = Object.keys(thisProps);
    let foundKeys = [];
    const lFind = findMe.length;

    findMe = findMe.toLowerCase();
    findOp = findOp.toLowerCase();

    if (findOp==="begins") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === 0);
    } else if (findOp === "ends") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === ( k.length - lFind));
    } else {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) > -1);
    }

    let foundProps = [];
    for (let thisProp of foundKeys) {
      if (thisProp && thisProp !== "" ) { foundProps.push(thisProps[thisProp]) ; }
    }

    return foundProps;
  }

  private getSelectColumns(lookupColumns){

    let baseSelectColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let isLookup = thisColumn.indexOf("/");
        if(isLookup) {
          baseSelectColumns.push(thisColumn);
        }
      }
    }
    return baseSelectColumns;
  }

  private getExpandColumns(lookupColumns){

    let baseExpandColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let splitCol = thisColumn.split("/");
        let leftSide = splitCol[0];
        if(baseExpandColumns.indexOf(leftSide) < 0) {
          baseExpandColumns.push(leftSide);
        }
      }
    }
    return baseExpandColumns;
  }

}

