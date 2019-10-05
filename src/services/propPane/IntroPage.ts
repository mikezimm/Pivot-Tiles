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
import { imageOptionsGroup } from './index';

export class IntroPage {
  public getPropertyPanePage(): IPropertyPanePage {
    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: strings.PropertyPaneAbout
      },
      groups: [
        {
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
        { groupName: 'Basic webpart info',
        groupFields: [
          PropertyPaneTextField('listWebURL', {
              label: strings.listWebURL
          }),
          PropertyPaneTextField('setTab', {
            label: strings.setTab
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
        ]}, // this group
        { groupName: 'Behavior',
          groupFields: [
            PropertyPaneDropdown('target', <IPropertyPaneDropdownProps>{
              label: 'Open Behavior',
              options: imageOptionsGroup.imgTargetChoices,
            }),
        ]} // this group
      ]
    } // </page1>
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();