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

        setSize: this.properties.setSize,
        setRatio: this.properties.setRatio,
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
    return propertyPaneBuilder.getPropertyPaneConfiguration();
  }

  //Added this per AC Facebook post...
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    console.log('path: ' + propertyPath + ' oldValue: ' + oldValue + ' newValue: ' + newValue);

    if (propertyPath === 'listDefinition' && newValue === 'OurTiles') {
      //alert("Hey! " +propertyPath +" new value is " + newValue);
      //this.properties.listTitle = "TitleChanged!";
      //this.properties.colTitleText = "TitleTextChanged!";      
      this.context.propertyPane.refresh();
    }

    if (propertyPath === 'setSize') {
      console.log("Hey! " +propertyPath+" changed FROM " + oldValue +" TO " + newValue);
      this.properties.setSize = newValue;
      //this.properties.colTitleText = "TitleTextChanged!";      
      this.context.propertyPane.refresh();
    }

    if (propertyPath === 'setPivSize') {
      console.log("Hey! " +propertyPath+" changed FROM " + oldValue +" TO " + newValue);
      this.properties.setPivSize = newValue;
      //this.properties.colTitleText = "TitleTextChanged!";      
      this.context.propertyPane.refresh();
    }

    if (propertyPath === 'setPivFormat') {
      console.log("Hey! " +propertyPath+" changed FROM " + oldValue +" TO " + newValue);
      this.properties.setPivFormat = newValue;
      //this.properties.colTitleText = "TitleTextChanged!";      
      this.context.propertyPane.refresh();
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
