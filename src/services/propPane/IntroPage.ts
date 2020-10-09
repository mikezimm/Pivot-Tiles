import {
  IPropertyPanePage,
  PropertyPaneLabel,
  IPropertyPaneLabelProps,
  PropertyPaneHorizontalRule,
  PropertyPaneTextField, IPropertyPaneTextFieldProps,
  PropertyPaneLink, IPropertyPaneLinkProps,
  PropertyPaneDropdown, IPropertyPaneDropdownProps,
  IPropertyPaneDropdownOption,PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'PivotTilesWebPartStrings';
import { imageOptionsGroup } from './index';
import { pivotOptionsGroup} from './index';

export class IntroPage {
  public getPropertyPanePage(webPartProps): IPropertyPanePage {
    return <IPropertyPanePage>
    { // <page1>
      header: {
        //description: strings.PropertyPaneAbout
      },
      displayGroupsAsAccordion: true,
      groups: [
        { groupName: 'Basic webpart info',
          groupFields: [
            PropertyPaneLabel('About Text', {
              text: 'This webpart gets tile defintion from a list in SharePoint :).'
            }),

            PropertyPaneLink('About Link' , {
              text: 'Github Repo:  Pivot-Tiles',
              href: 'https://github.com/mikezimm/Pivot-Tiles',
            }),
          ]
        },
        { groupName: 'List setup',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneTextField('listWebURL', {
              label: strings.listWebURL
          }),
          PropertyPaneTextField('setTab', {
            label: strings.setTab
          }),
          PropertyPaneTextField('otherTab', {
            label: strings.otherTab
          }),
        ]}, // this group
        { groupName: 'Filtering',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneTextField('setFilter', {
              label: strings.setFilter
          }),
          PropertyPaneTextField('propURLQuery', {
            disabled: true,
              label: strings.propURLQuery
          }),
        ]}, // this group
        { groupName: 'Behavior',
        isCollapsed: true ,
          groupFields: [
            PropertyPaneDropdown('target', <IPropertyPaneDropdownProps>{
              label: 'Open Behavior',
              options: imageOptionsGroup.imgTargetChoices,
            }),
          ]}, // this group

          { groupName: 'Pivot Styles',
          isCollapsed: true ,
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
          ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();