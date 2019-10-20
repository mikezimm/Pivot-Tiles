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
import { listMapping } from './ListMapping';


export default class PivotTilesWebPart extends BaseClientSideWebPart<IPivotTilesWebPartProps> {

  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  public onInit():Promise<void> {
    return super.onInit().then(_ => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IPivotTilesProps > = React.createElement(
      PivotTiles,
      {
        description: this.properties.description,
        listDefinition: this.properties.listDefinition,
        listWebURL: this.properties.listWebURL,
        listTitle: this.properties.listTitle,

        pageContext: this.context.pageContext,
        heroType: this.properties.heroType,
        heroCategory: this.properties.heroCategory,
        showHero: this.properties.showHero,
        setHeroFit: this.properties.setHeroFit,
        setHeroCover: this.properties.setHeroCover,

        setSize: this.properties.setSize,
        setRatio: this.properties.setRatio,
        setImgFit: this.properties.setImgFit,
        setImgCover: this.properties.setImgCover,
        target: this.properties.target,
        setFilter: this.properties.setFilter,
        propURLQuery: this.properties.propURLQuery,
        setTab: this.properties.setTab,

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


      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async loadListItems(): Promise<IPivotTileItemProps[]> {
    /* Filtering example of same one and only retreiving certain columns
    const result:IListItem[] = await sp.web.lists.getByTitle("Customers").items
    .select("Title","CustomerID").filter("Title eq 'GM'").orderBy("Id",true).getAll()
    */

    /*  Be sure to import Web from @pnp/sp first, then use this to get from another web.

        let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/ScriptTesting/');
        const result:IListItem[] = await web.lists.getByTitle("Customers").items

        or .... 

        let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/ScriptTesting/');
        web.get().then(w => {
          console.log(w);
        });

    */
    console.log("Hello2");
    console.log("private async loadListItems()");
    console.log(this);
    console.log(this.properties.listTitle);


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
    console.log('path: ' + propertyPath + ' oldValue: ' + oldValue + ' newValue: ' + newValue);

    if (propertyPath === 'listDefinition' && newValue !== oldValue) {
      //alert("Hey! " +propertyPath +" new value is " + newValue);
      //this.properties.listTitle = "TitleChanged!";
      //this.properties.colTitleText = "TitleTextChanged!";

      let newMap = listMapping.getListColumns(newValue);
      const hasValues = Object.keys(newMap).length;

      if (hasValues !== 0) {

        console.log('Found List Defintion... updating column name props');
        
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

      } else {
        console.log('Did NOT List Defintion... updating column name props');

      }


      this.context.propertyPane.refresh();
    }

    let updateOnThese = [
      'setSize','setPivSize','heroCategory','showHero','setPivFormat','setImgFit','setImgCover','target',
      'imageWidth','imageHeight','textPadding','setHeroFit','setHeroCover'
    ];

    if (updateOnThese.indexOf(propertyPath) > -1 ) {
      console.log("Hey there! " +propertyPath+" changed FROM " + oldValue +" TO " + newValue);
      this.properties[propertyPath] = newValue;   
      this.context.propertyPane.refresh();

    } else { //This can be removed if it works
     
      if (propertyPath === 'heroType') {
        console.log("Hey! " +propertyPath+" changed FROM " + oldValue +" TO " + newValue);
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

    //this.context.propertyPane.refresh();
    //super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    /*
    this.context.propertyPane.refresh();
    this.context.propertyPane.refresh() refreshes Property Pane itself...
        It doesn't set any values to web part properties and also it doesn't initiate web part's re-render.
    */

    this.render();
  }
}
