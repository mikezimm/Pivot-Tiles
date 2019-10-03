import {
  IPropertyPaneConfiguration,
} from '@microsoft/sp-webpart-base';

import {
  introPage,
  webPartSettingsPage,
  listMappingPage,
} from './index';

/*
        IntroPage.getPropertyPanePage(),
        WebPartSettingsPage.getPropertyPanePage(),
        ListMappingPage.getPropertyPanePage(),
*/

export class PropertyPaneBuilder {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return <IPropertyPaneConfiguration>{
      pages: [
        introPage.getPropertyPanePage(),
        webPartSettingsPage.getPropertyPanePage(),
        listMappingPage.getPropertyPanePage(),
      ]
    };
  } // getPropertyPaneConfiguration()
}

export let propertyPaneBuilder = new PropertyPaneBuilder();