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

import { IPivotTilesWebPartProps } from './IPivotTilesWebPartProps';
import * as strings from 'PivotTilesWebPartStrings';
import PivotTiles from './components/PivotTiles';
import { IPivotTilesProps } from './components/IPivotTilesProps';

export default class PivotTilesWebPart extends BaseClientSideWebPart<IPivotTilesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPivotTilesProps > = React.createElement(
      PivotTiles,
      {
        description: this.properties.description,
        listDefinition: this.properties.listDefinition,
        listWebURL: this.properties.listWebURL,
        listTitle: this.properties.listTitle,
        defaultTab: this.properties.defaultTab,
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
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        { // <page1>
          header: {
            description: strings.PropertyPaneAbout
          },
          groups: [
            {
              groupFields: [
                PropertyPaneLabel('About Text', {
                  text: 'This webpart gets tile defintion from a list in SharePoint.'
                }),

                PropertyPaneLink('About Link' , {
                  text: 'Github Repo:  Pivot-Tiles',
                  href: 'https://github.com/mikezimm/Pivot-Tiles',
                }),
              ]
            }
          ]
        }, // </page1>
        { // <page2>
          header: {
            description: strings.PropertyPaneMainDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('listDefinition', {
                    label: strings.listDefinition
                }),
                PropertyPaneTextField('listWebURL', {
                    label: strings.listWebURL
                }),
                PropertyPaneTextField('listTitle', {
                    label: strings.listTitle
                }),
                PropertyPaneTextField('defaultTab', {
                    label: strings.defaultTab
                }),
              ]
            }
          ]
        }, // </page2>
        { // <page3>
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
      ]
    };
  }
}
