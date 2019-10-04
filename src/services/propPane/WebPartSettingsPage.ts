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
  import { pivotOptionsGroup, } from './index';
  
  export class WebPartSettingsPage {

    private setSize: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {        index: 0,        key: '100',        text: '100px high'      },
      {        index: 1,        key: '150',        text: '150px high'      },
      {        index: 2,        key: '300',        text: '300px high'      }
    ];

    private setRatio: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {        index: 0,        key: '1xy',        text: 'Square Tile'      },
      {        index: 1,        key: '4x1',        text: 'Fit 4 Tiles wide'      },
      {        index: 2,        key: '3x1',        text: 'Fit 3 Tiles wide'      },
      {        index: 3,        key: '2x1',        text: 'Fit 2 Tiles wide'      },
      {        index: 4,        key: '1x1',        text: 'Fit 1 Tiles wide'      }
    ];

    public getPropertyPanePage(): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {
          description: strings.PropertyPaneMainDescription
        },
        groups: [
          { groupName: 'Basic webpart info',
            groupFields: [
              PropertyPaneTextField('listWebURL', {
                  label: strings.listWebURL
              }),
              PropertyPaneTextField('setTab', {
                label: strings.setTab
              }),
            ]}, // this group

            { groupName: 'Image settings',
            groupFields: [
              PropertyPaneDropdown('setSize', <IPropertyPaneDropdownProps>{
                label: strings.setSize,
                options: this.setSize,
              }),
              PropertyPaneDropdown('setRatio', <IPropertyPaneDropdownProps>{
                label: strings.setRatio,
                options: this.setRatio,
              }),
            ]}, // this group

            { groupName: 'Pivot Settings',
            groupFields: [
              PropertyPaneDropdown('setPivSize', <IPropertyPaneDropdownProps>{
                label: strings.setPivSize,
                options: pivotOptionsGroup.pivSizeChoices,
              }),
              PropertyPaneDropdown('setPivFormat', <IPropertyPaneDropdownProps>{
                label: strings.setPivFormat,
                options: pivotOptionsGroup.pivFormatChoices,
              }),
              PropertyPaneDropdown('setPivOptions', <IPropertyPaneDropdownProps>{
                label: strings.setPivOptions,
                options: pivotOptionsGroup.pivOptionsChoices,
                disabled: true,
              }),
            ]}, // this group

            { groupName: 'Filtering',
            groupFields: [
              PropertyPaneTextField('setFilter', {
                  label: strings.setFilter
              }),
              PropertyPaneTextField('propURLQuery', {
                  label: strings.propURLQuery
              }),
            ]} // this group
          ]} // Groups
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();