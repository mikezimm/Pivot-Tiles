import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneLabel,
  PropertyPaneLink
} from '@microsoft/sp-webpart-base';

// npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save
import { sp, Web } from '@pnp/sp';

import { IPivotTilesWebPartProps } from './IPivotTilesWebPartProps';
import * as strings from 'PivotTilesWebPartStrings';
import PivotTiles from './components/PivotTiles/PivotTiles';
import { IPivotTilesProps } from './components/PivotTiles/IPivotTilesProps';
import { IPivotTileItemProps } from './components/TileItems/IPivotTileItemProps';
import { string, any } from 'prop-types';
import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';
import { availableListMapping } from './AvailableListMapping';


import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../services/createAnalytics';

export default class PivotTilesWebPart extends BaseClientSideWebPart<IPivotTilesWebPartProps> {

  
  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  public onInit():Promise<void> {
    return super.onInit().then(_ => {
      // other init code may be present

      //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
      document.getElementById("workbenchPageContent").style.maxWidth = "none";
      //console.log('window.location',window.location);
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public getUrlVars(): {} {
    var vars = {};
    vars = location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, pair) => {
      const [key, value] = pair.map(decodeURIComponent);
      return ({ ...obj, [key]: value })
    }, {});
    return vars;
  }

  public render(): void {
    const element: React.ReactElement<IPivotTilesProps > = React.createElement(
      PivotTiles,
      {
        startTime: getTheCurrentTime(),
        scenario: this.properties.scenario,
        description: this.properties.description,
        listDefinition: this.properties.listDefinition,
        listWebURL: this.properties.listWebURL,
        listTitle: this.properties.listTitle,
        getAll: this.properties.getAll,

        pageContext: this.context.pageContext,
        heroType: this.properties.heroType,
        heroCategory: this.properties.heroCategory,
        heroRatio: this.properties.heroRatio,
        showHero: this.properties.showHero,
        setHeroFit: this.properties.setHeroFit,
        setHeroCover: this.properties.setHeroCover,
        onHoverEffect: this.properties.onHoverEffect,

        onHoverZoom: this.properties.onHoverZoom,
        setSize: this.properties.setSize,
        setRatio: this.properties.setRatio,
        setImgFit: this.properties.setImgFit,
        setImgCover: this.properties.setImgCover,
        target: this.properties.target,
        setFilter: this.properties.setFilter,
        propURLQuery: this.properties.propURLQuery,
        setTab: this.properties.setTab,
        otherTab: this.properties.otherTab,

        setPivSize: this.properties.setPivSize,
        setPivFormat: this.properties.setPivFormat,
        setPivOptions: this.properties.setPivOptions,

        colTitleText: this.properties.colTitleText,
        colHoverText: this.properties.colHoverText,
        colCategory: this.properties.colCategory,
        colColor: this.properties.colColor,
        colSize: this.properties.colSize,
        colGoToLink: this.properties.colGoToLink,
        colOpenBehaviour: this.properties.colOpenBehaviour,
        colImageLink: this.properties.colImageLink,
        colSort: this.properties.colSort,
        colTileStyle: this.properties.colTileStyle,

        loadListItems: this.loadListItems,

        imageWidth: this.properties.imageWidth,
        imageHeight: this.properties.imageHeight,
        textPadding: this.properties.textPadding,

        analyticsList: strings.analyticsList,
        analyticsWeb: strings.analyticsWeb,
        tenant: this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,""),
        urlVars: this.getUrlVars(),

        //List column mapping - always available columns
        colModified: "Modified",
        colModifiedById: "Editor/ID",
        colModifiedByTitle: "Editor/Title",
        colCreated: "Created",
        colCreatedById: "Author/ID",
        colCreatedByTitle: "Author/Title",

      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async loadListItems(): Promise<IPivotTileItemProps[]> {

    let useTileList: string = strings.DefaultTileList;
    
    //This line is causing an error in debugger mode:
    //unCaught Promise, can not read list Title of undefined.
    if ( this.properties.listTitle ) {
        useTileList = this.properties.listTitle;
    }

    let restFilter: string = "";
    if ( this.properties.setFilter ) {
      restFilter = this.properties.setFilter;
    }

    let restSort: string = "Title";
    if ( this.properties.colSort ) {
      restSort = this.properties.colSort;
    }

    let selectCols: string = "*";

    if ( this.properties.listWebURL.length > 0 ){
      let web = new Web(this.properties.listWebURL);
      const result:IPivotTileItemProps[] = await web.lists.getByTitle(useTileList).items
        .select(selectCols).filter(restFilter).orderBy(restSort,true).getAll();
      return(result);

    } else {
      const result:IPivotTileItemProps[] = await sp.web.lists.getByTitle(useTileList).items
        .select(selectCols).filter(restFilter).orderBy(restSort,true).getAll();
      return(result);

    }

    //Handle error?
  
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return propertyPaneBuilder.getPropertyPaneConfiguration(this.properties);
  }

  //Added this per AC Facebook post...
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

    if (propertyPath === 'listDefinition' && newValue !== oldValue) {
      //alert("Hey! " +propertyPath +" new value is " + newValue);
      //this.properties.listTitle = "TitleChanged!";
      //this.properties.colTitleText = "TitleTextChanged!";

      let newMap : any = {};
      if (this.properties.scenario === 'DEV' ) {
        newMap = availableListMapping.getListColumns(newValue);

      } else if (this.properties.scenario === 'TEAM') {
        newMap = availableListMapping.getListColumns(newValue);  

      } else if (this.properties.scenario === 'CORP') {
        newMap = availableListMapping.getListColumns(newValue); 

      }

      const hasValues = Object.keys(newMap).length;

      if (hasValues !== 0) {
        
        this.properties.listTitle = newMap.listDisplay;
        this.properties.colTitleText = newMap.listMapping.colTitleText;
        this.properties.colHoverText = newMap.listMapping.colHoverText;
        this.properties.colCategory = newMap.listMapping.colCategory;
        this.properties.colColor = newMap.listMapping.colColor;
        this.properties.colSize = newMap.listMapping.colSize;
        this.properties.colGoToLink = newMap.listMapping.colGoToLink;
        this.properties.colOpenBehaviour = newMap.listMapping.colOpenBehaviour;
        this.properties.colImageLink = newMap.listMapping.colImageLink;
        this.properties.colSort = newMap.listMapping.colSort;
        this.properties.colTileStyle = newMap.listMapping.colTileStyle;
        this.properties.listWebURL = newMap.testSite;
        this.properties.setFilter = newMap.setFilter;
        this.properties.setTab = newMap.setTab;        
        

      } else {
        console.log('Did NOT List Defintion... updating column name props');

      }


      this.context.propertyPane.refresh();
    }

    let updateOnThese = [
      'setSize','setTab','otherTab','setPivSize','heroCategory','heroRatio','showHero','setPivFormat','setImgFit','setImgCover','target',
      'imageWidth','imageHeight','textPadding','setHeroFit','setHeroCover','onHoverZoom'
    ];

    if (updateOnThese.indexOf(propertyPath) > -1 ) {
      this.properties[propertyPath] = newValue;   
      this.context.propertyPane.refresh();

    } else { //This can be removed if it works
     
      if (propertyPath === 'heroType') {
        this.properties.heroType = newValue;

        if (newValue === 'header' || newValue === 'inLine' || newValue === 'footer') {
          this.properties.setHeroCover = 'portrait';
          this.properties.setHeroFit = 'centerCover';

        } else if (newValue === 'left' || newValue === 'right') {
          this.properties.setHeroCover = 'portrait';
          this.properties.setHeroFit = 'centerContain';
        }

        this.context.propertyPane.refresh();
      }

    }
    this.render();
  }
}
