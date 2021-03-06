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
import { otherOptionsGroup} from './index';

import { devListMapping } from './../../webparts/pivotTiles/DevListMapping';
import { corpListMapping } from './../../webparts/pivotTiles/CorpListMapping';
import { teamListMapping } from './../../webparts/pivotTiles/TeamListMapping';


export class IntroPage {
  public getPropertyPanePage(webPartProps): IPropertyPanePage {

    let theListChoices : IPropertyPaneDropdownOption[] = devListMapping.listChoices;

    if (webPartProps.scenario === "DEV"){
        theListChoices = devListMapping.listChoices;

    } else if (webPartProps.scenario === "CORP"){
        theListChoices = corpListMapping.listChoices;

    } else if (webPartProps.scenario === "TEAM"){
        theListChoices = teamListMapping.listChoices;
    }

    let custCatChoices : IPropertyPaneDropdownOption[] = otherOptionsGroup.custCategoryChoices;

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


        {
          groupName: strings.PropertyPaneColumnsDescription1,
          isCollapsed: true ,
          groupFields: [

            PropertyPaneToggle('definitionToggle', {
                label: 'Lock List Type - prevents accidently reseting props with List Type dropdown!',
                offText: 'Off',
                onText: 'On',
            }),

            PropertyPaneDropdown('listDefinition', <IPropertyPaneDropdownProps>{
                label: strings.listDefinition,
                options: theListChoices,
                disabled: webPartProps.definitionToggle,
            }),

            PropertyPaneTextField('listTitle', {
                label: strings.listTitle
            }),
            
            PropertyPaneToggle('getAll', {
                label: strings.Property_getAll_Label,
                offText: strings.Property_ShowHero_OffText,
                onText: strings.Property_ShowHero_OnText
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
        },
        {
          groupName: 'Custom Categories',
          isCollapsed: true ,
          groupFields: [

            PropertyPaneDropdown('custCatType', <IPropertyPaneDropdownProps>{
                label: 'How to build Categories',
                options: custCatChoices,
            }),

            PropertyPaneTextField('custCatCols', {
                label: 'Custom Category ColumnNames (; separated)',
                disabled: webPartProps.custCatType === 'tileCategory' ? true : false,
            }),

            PropertyPaneLink('JSON Link' , {
              text: 'Use this site to more easily work on JSON',
              href: 'https://codebeautify.org/jsonviewer',
              target: '_blank',
              disabled: webPartProps.custCatType === 'tileCategory' ? true : false,
            }),

            PropertyPaneTextField('custCatLogi', {
              label: 'Custom Logic (see wiki), use link above to help edit JSON',
              disabled: webPartProps.custCatType === 'tileCategory' ? true : false,
            }),

            PropertyPaneToggle('custCatBrak', {
              label: 'Only show tile in First Custom Category found',
              offText: 'Off',
              onText: 'On',
              disabled: webPartProps.custCatType === 'tileCategory' ? true : false,
            }),

          ]
        },

        {
          groupName: strings.PropertyPaneColumnsDescription2,
          isCollapsed: true ,
          groupFields: [

          PropertyPaneTextField('colColor', {
              description: 'Column defining tile background color, not yet available.',
              label: strings.colColor,
              disabled: true,                    
          }),

          PropertyPaneTextField('colSize', {
              label: strings.colSize
          }),

          PropertyPaneTextField('colOpenBehaviour', {
              label: strings.colOpenBehaviour
          }),

          PropertyPaneTextField('colTileStyle', {
              label: strings.colTileStyle
          }),
        ]
      },


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


        { groupName: 'Subsites',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneToggle('subsitesInclude', {
              label: 'Show Subsites automatically',
              offText: 'Off',
              onText: 'On',
              disabled: webPartProps.listWebURL !== '' ? true : false,
          }),
          PropertyPaneToggle('subsitesOnly', {
              label: 'Only show Subsites, Ignore your List settings',
              offText: 'Off',
              onText: 'On',
              disabled: webPartProps.subsitesInclude === true ? false : true,
          }),
          PropertyPaneTextField('subsitesCategory', {
              label: 'Subsite Category,',
              disabled: webPartProps.subsitesInclude === true ? false : true,
          }),

        ]}, // this group

        
        { groupName: 'Lists and Libraries',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneToggle('listsInclude', {
              label: 'Show all Lists',
              offText: 'Off',
              onText: 'On',
              disabled: webPartProps.listWebURL !== '' ? true : false,
          }),
          PropertyPaneTextField('listFilter', {
            label: 'Filter to apply to lists',
            disabled: webPartProps.listsInclude === true ? false : true,
          }),
          PropertyPaneTextField('listIconStyles', {
            label: 'List Icon Style (similar to tile icons)',
            disabled: webPartProps.listsInclude === true ? false : true,
          }),
          PropertyPaneToggle('libsInclude', {
              label: 'Show all Libraries',
              offText: 'Off',
              onText: 'On',
              disabled: webPartProps.listWebURL !== '' ? true : false,
          }),
          PropertyPaneTextField('libsFilter', {
            label: 'Filter to apply to lists',
            disabled: webPartProps.libsInclude === true ? false : true,
          }),
          PropertyPaneTextField('libsIconStyles', {
            label: 'Library Icon Style (similar to tile icons)',
            disabled: webPartProps.libsInclude === true ? false : true,
          }),

          PropertyPaneTextField('listLibCat', {
              label: 'Combined category label (if blank, you will get Lists and Libraries',
              disabled: webPartProps.listsInclude === true || webPartProps.libsInclude === true? false : true,
          }),

          //listHideSystem
          PropertyPaneToggle('listHideSystem', {
              label: 'Hide System lists',
              offText: 'Off',
              onText: 'On',
              disabled: webPartProps.listsInclude === true || webPartProps.libsInclude === true? false : true,
          }),

          PropertyPaneToggle('subsitesOnly', {
              label: 'Only show Lists and Libraries, Ignore your List settings',
              offText: 'Off',
              onText: 'On',
              //disabled: webPartProps.listsInclude === true || webPartProps.libsInclude === true? false : true,
              disabled: true,
          }),



        ]}, // this group

    ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();