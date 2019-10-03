import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';

  export class ListMappingPage {
    public getPropertyPanePage(): IPropertyPanePage {
        return <IPropertyPanePage>        { // <page3>
          header: {
            description: strings.PropertyPaneColumnsDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
              PropertyPaneTextField('colTitleText', {
                  label: strings.colTitleText
              }),
              PropertyPaneTextField('colHoverText', {
                  label: strings.colHoverText
              }),
              PropertyPaneTextField('colCategory', {
                  label: strings.colCategory
              }),
              PropertyPaneTextField('colColor', {
                  label: strings.colColor
              }),
              PropertyPaneTextField('colSize', {
                  label: strings.colSize
              }),
              PropertyPaneTextField('colGoToLink', {
                  label: strings.colGoToLink
              }),
              PropertyPaneTextField('colOpenBehaviour', {
                  label: strings.colOpenBehaviour
              }),
              PropertyPaneTextField('colImageLink', {
                  label: strings.colImageLink
              }),
              PropertyPaneTextField('colSort', {
                  label: strings.colSort
              }),
              PropertyPaneTextField('colTileStyle', {
                  label: strings.colTileStyle
              }),
              ]
            }
          ]
        } // <page3>
      } // getPropertyPanePage()
  }


  export let listMappingPage = new ListMappingPage();