  
  import * as strings from 'PivotTilesWebPartStrings';
  import {
    IPropertyPaneDropdownOption
  } from '@microsoft/sp-webpart-base';

  import { availableListMapping } from './AvailableListMapping';
  
  export class ListMapping {
    
    public listChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        availableListMapping.choiceOurTiles,
        availableListMapping.choiceAETiles,
        availableListMapping.choicePromoted,
        availableListMapping.choiceQuick,
        availableListMapping.choiceMedia,
        availableListMapping.choiceDocument,
        availableListMapping.choiceIcons,
        availableListMapping.choiceTestImages,
        availableListMapping.choiceUnk,
    ];

  }

  export let devListMapping = new ListMapping();

