import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';
  import { listMapping } from './../../webparts/pivotTiles/ListMapping';


  export class ListMappingPage1 {

    public getPropertyPanePage(): IPropertyPanePage {
        /*  Removed Header from above groups in return statement... formatting was not bold.
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },
            */

        return <IPropertyPanePage>        { // <page3>
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },
            groups: [
            {
                groupName: strings.PropertyPaneColumnsDescription1,
                groupFields: [

                PropertyPaneDropdown('listDefinition', <IPropertyPaneDropdownProps>{
                    label: strings.listDefinition,
                    options: listMapping.listChoices,
                }),

                PropertyPaneTextField('listTitle', {
                    label: strings.listTitle
                }),
                PropertyPaneTextField('colTitleText', {
                    label: strings.colTitleText
                }),
                PropertyPaneTextField('colHoverText', {
                    label: strings.colHoverText
                }),
                PropertyPaneTextField('colCategory', {
                    label: strings.colCategory
                }),
                PropertyPaneTextField('colGoToLink', {
                    label: strings.colGoToLink
                }),
                PropertyPaneTextField('colImageLink', {
                    label: strings.colImageLink
                }),
                PropertyPaneTextField('colSort', {
                    label: strings.colSort
                }),

              ]
            }
          ]
        }; // <page3>
      } // getPropertyPanePage()
  }


  export let listMappingPage1 = new ListMappingPage1();