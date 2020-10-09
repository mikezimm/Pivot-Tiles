import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneToggle
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';
  import { pivotOptionsGroup, imageOptionsGroup } from './index';
  
  export class WebPartSettingsPage {

    private setSize: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {        index: 0,        key: '100',        text: '100px high'      },
      {        index: 1,        key: '150',        text: '150px high'      },
      {        index: 2,        key: '300',        text: '300px high'      },
      {        index: 4,        key: 'Card',        text: 'Document Card'      },
      {        index: 5,        key: 'List',        text: 'List View'      },      
      {        index: 3,        key: 'Custom',        text: 'Custom'      },      
    ];

    private setRatio: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {        index: 0,        key: '1xy',        text: 'Square Tile'      },
      {        index: 1,        key: '4x1',        text: 'Fit 4 Tiles wide'      },
      {        index: 2,        key: '3x1',        text: 'Fit 3 Tiles wide'      },
      {        index: 3,        key: '2x1',        text: 'Fit 2 Tiles wide'      },
      {        index: 4,        key: '1x1',        text: 'Fit 1 Tiles wide'      }
    ];

    public getPropertyPanePage(webPartProps): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {
          description: strings.PropertyPaneMainDescription
        },
        displayGroupsAsAccordion: true,
        groups: [

          { groupName: 'Image settings',
          isCollapsed: true ,
          groupFields: [
            
            PropertyPaneDropdown('onHoverZoom', <IPropertyPaneDropdownProps>{
              label: strings.onHoverZoom,
              options: imageOptionsGroup.hoverZoomChoices,
            }),

            PropertyPaneDropdown('onHoverEffect', <IPropertyPaneDropdownProps>{
              label: strings.onHoverEffect,
              options: imageOptionsGroup.hoverEffectChoices,
            }),
            

            PropertyPaneDropdown('setSize', <IPropertyPaneDropdownProps>{
              label: strings.setSize,
              options: this.setSize,
            }),

              PropertyPaneSlider('imageWidth', {
                label: strings.Property_ImageWidth_Label,
                disabled: webPartProps.setSize === "Custom" ? false : true ,
                min: 50,
                max: 300,
                step: 25,
              }),
              PropertyPaneSlider('imageHeight', {
                label: strings.Property_ImageHeight_Label,
                disabled: webPartProps.setSize === "Custom" ? false : true ,
                min: 50,
                max: 300,
                step: 25,
              }),
              PropertyPaneSlider('textPadding', {
                label: strings.Property_TextPadding_Label,
                disabled: webPartProps.setSize === "Custom" ? false : true ,
                min: 2,
                max: 20
              }),

            ]}, // this group

          // Group of props for standard sizes
          {  groupName: 'Tile settings',
          isCollapsed: webPartProps.setSize === "Custom" ? true : false ,
          groupFields: [
            
            PropertyPaneDropdown('setRatio', <IPropertyPaneDropdownProps>{
              label: strings.setRatio,
              options: this.setRatio,
            }),
            PropertyPaneDropdown('setImgFit', <IPropertyPaneDropdownProps>{
              label: strings.setImgFit,
              options: imageOptionsGroup.imgFitChoices,
            }),
            PropertyPaneDropdown('setImgCover', <IPropertyPaneDropdownProps>{
              label: strings.setImgCover,
              options: imageOptionsGroup.imgCoverChoices,
            }),

          ]}, // this group
          
          { groupName: 'Hero Panel settings',
            isCollapsed: true,
            groupFields: [
              PropertyPaneLabel('HeroPanelSettings', {
                text: 'Hero Panel Settings'
              }),

              PropertyPaneDropdown('heroType', <IPropertyPaneDropdownProps>{
                label: strings.heroChoices,
                options: imageOptionsGroup.heroChoices,
              }),
              
              PropertyPaneTextField('heroCategory', {
                label: strings.heroCategory
              }),

              PropertyPaneSlider('heroRatio', {
                label: strings.heroRatio,
                min: 3,
                max: 24,
                step: 1,
              }),
              
              PropertyPaneDropdown('setHeroFit', <IPropertyPaneDropdownProps>{
                label: strings.setImgFit,
                options: imageOptionsGroup.imgFitChoices,
              }),

              PropertyPaneDropdown('setHeroCover', <IPropertyPaneDropdownProps>{
                label: strings.setImgCover,
                options: imageOptionsGroup.imgCoverChoices,
              }),

            ]}, // this group

          ]}; // Groups
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();