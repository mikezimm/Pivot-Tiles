  
  import * as strings from 'PivotTilesWebPartStrings';
  import {
    IPropertyPaneDropdownOption
  } from '@microsoft/sp-webpart-base';

  export class ListMapping {
    
    public listChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'OurTiles', text: "OurTiles"  },
        {   index: 1,   key: 'AEInspiredTiles', text: "AEInspiredTiles"  },
        {   index: 2,   key: 'PromotedLinks', text: "Promoted Links"  },
        {   index: 3,   key: 'QuickLinks', text: "Quick Links"  },
        {   index: 4,   key: 'MediaLibrary', text: "Media Library"  },
        {   index: 5,   key: 'DocumentLibrary', text: "Document Library"  },
        {   index: 9,   key: 'none', text: "Unknown"  },
    ];

    public getListColumns (findMe) :any {
        let listMap = {};

        //NOTE:
        //This should be the default list structure for the webpart.
        // Be sure these values match the default set in the webpart.manifest.json - needs to be done by hand.
        if (findMe === 'OurTiles') {
            listMap = {
                "listDef" : "OurTiles",
                "listDisplay" : "OurTiles",
                "listName" : "OurTiles",
                "tabDefault" : true,
                "listMapping" : {
                    "colTitleText" : strings.defColTitleText,
                    "colHoverText" : strings.defColHoverText,
                    "colCategory" : strings.defColCategory,
                    "colColor" : strings.defColdefColor,
                    "colSize" : strings.defColSize,
                    "colGoToLink" : strings.defColGoToLink,
                    "colOpenBehaviour" : strings.defColOpenBehaviour,
                    "colImageLink" : strings.defColImageLink,
                    "colSort" : strings.defColSort,
                }
            };

        } else if (findMe === 'AEInspiredTiles') {
            listMap = {
                "listDef" : "AEInspiredTiles",
                "listDisplay" : "AE Inspired Tiles",
                "listName" : "AEInspiredTilesItems",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "Title",
                    "colHoverText" : "TileDescription",
                    "colCategory" : "TileCategory",
                    "colColor" : "TileBgColorClass",
                    "colSize" : "TileBgImageSize",
                    "colGoToLink" : "TileHrefLink",
                    "colOpenBehaviour" : "",
                    "colImageLink" : "TileBgImageUrl",
                    "colSort" : "Order1"
                }
            };
            
        } else if (findMe === 'PromotedLinks') {
            listMap = {
                "listDef" : "Promoted Links",
                "listDisplay" : "Promoted Links",
                "listName" : "PromotedLinks",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "Title",
                    "colHoverText" : "",
                    "colCategory" : "",
                    "Color" : "",
                    "colSize" : "",
                    "colGoToLink" : "LinkLocation",
                    "colOpenBehaviour" : "LaunchBehavior",
                    "colImageLink" : "BackgroundImageLocation",
                    "colSort" : "TileOrder"
                }
            };
            
        } else if (findMe === 'MediaLibrary') {
            listMap = {
                "listDef" : "Media Library",
                "listDisplay" : "Media Library",
                "listName" : "MediaLibrary",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "File/Name",
                    "colHoverText" : "Editor/Title",
                    "colCategory" : "Author/ID",
                    "Color" : "",
                    "Size" : "",
                    "GoToLink" : "",
                    "colOpenBehaviour" : "",
                    "ImageLink" : "AlternateThumbnailUrl.Url",
                    "Sort" : "Title"
                }
            };
            
        } else if (findMe === 'DocumentLibrary') {
            listMap = {
                "listDef" : "Document Library",
                "listDisplay" : "Document Library",
                "listName" : "DocumentLibrary",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "File/Name",
                    "colHoverText" : "Editor/Title",
                    "colCategory" : "Author/ID",
                    "Color" : "",
                    "Size" : "",
                    "GoToLink" : "_ShortcutUrl.Url",
                    "colOpenBehaviour" : "",
                    "ImageLink" : "AlternateThumbnailUrl.Url",
                    "Sort" : "Title"
                }
            };
            
        }
        console.log('List Mapping for: ' + findMe );
        console.log( listMap );        
        return listMap;

    }

  }

  export let listMapping = new ListMapping();

