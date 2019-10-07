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

  import { Pivot, IPivotStyles, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
  import { Image, ImageFit, ImageCoverStyle,IImageProps,IImageState } from 'office-ui-fabric-react/lib/Image';

  import * as strings from 'PivotTilesWebPartStrings';

  export class ImageOptionsGroup {

    public imgFitChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'center', text: 'Center'  },
        {   index: 1,   key: 'contain', text: 'Contain'  },
        {   index: 2,   key: 'cover', text: 'Cover'  },
        {   index: 3,   key: 'none', text: 'None'  },
        {   index: 4,   key: 'centerCover', text: 'CenterCover'  },
        {   index: 5,   key: 'centerContain', text: 'CenterContain'  },
    ];

    public getImgFit (findMe) {
        if (findMe === 'center') {
            return ImageFit.center
        } else if (findMe === 'contain') {
            return ImageFit.contain
        } else if (findMe === 'cover') {
            return ImageFit.cover
        } else if (findMe === 'none') {
            return ImageFit.none
        } else if (findMe === 'centerContain') {
            return ImageFit.centerContain
        } else if (findMe === 'centerCover') {
            return ImageFit.centerCover
        } else {
            return ImageFit.centerCover
        }
    }  

    public imgCoverChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'landscape', text: "Landscape"  },
        {   index: 1,   key: 'portrait', text: "Portrait"  },
    ];
    
    public getImgCover (findMe) {
        if (findMe === 'landscape') {
            return ImageCoverStyle.landscape
        } else {
            return ImageCoverStyle.portrait
        }
    }

    public imgTargetChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'top', text: "Full Body (_top)"  },
        {   index: 1,   key: 'blank', text: "New Window (_blank)"  },

    ];
    /*  These do not seem to  work.
        {   index: 2,   key: 'self', text: "Same Frame (_self)"  },
        {   index: 3,   key: 'parent', text: "Parent Frameset (_parent)"  },
    */

    public getTarget (findMe) {
        if (findMe === 'blank') {
            return "_blank";
        } else if (findMe === 'self') {
            return "_self";
        } else if (findMe === 'parent') {
            return "_parent";
        } else if (findMe === 'top') {
            return "_top";
        } else {
            return "_top";
        }
    } 

    public heroChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'left', text: "Left side"  },
        {   index: 1,   key: 'right', text: "Right side"  },
        {   index: 1,   key: 'none', text: "None"  },
    ];
    /*  These do not seem to  work.
        {   index: 2,   key: 'self', text: "Same Frame (_self)"  },
        {   index: 3,   key: 'parent', text: "Parent Frameset (_parent)"  },
    */

    public getHeroChoice (findMe) {
        if (findMe === 'left') {
            return "left";
        } else if (findMe === 'right') {
            return "right";
        } else if (findMe === 'none') {
            return "none";
        } else {
            return "left";
        }
    } 

  }

  export let imageOptionsGroup = new ImageOptionsGroup();