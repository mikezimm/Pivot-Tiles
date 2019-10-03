import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';
  
  export class WebPartSettingsPage {
    public getPropertyPanePage(): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {
          description: strings.PropertyPaneMainDescription
        },
        groups: [
          {
            groupFields: [
              PropertyPaneTextField('listWebURL', {
                  label: strings.listWebURL
              }),
              PropertyPaneTextField('setTab', {
                label: strings.setTab
              }),
              PropertyPaneTextField('setSize', {
                label: strings.setSize
              }),
              PropertyPaneTextField('setRatio', {
                label: strings.setRatio
              }),
              PropertyPaneTextField('setFilter', {
                  label: strings.setFilter
              }),
              PropertyPaneTextField('propURLQuery', {
                  label: strings.propURLQuery
              }),
            
            ]
          }
        ]
      } // </page2>
    } // getPropertyPanePage()
  }
  
  
  export let webPartSettingsPage = new WebPartSettingsPage();