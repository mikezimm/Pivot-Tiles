  
  import * as strings from 'PivotTilesWebPartStrings';
  import {
    IPropertyPaneDropdownOption
  } from '@microsoft/sp-webpart-base';

  export class ListMapping {
    
    public listChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'OurTiles', text: "OurTiles"  },
        {   index: 4,   key: 'MediaLibrary', text: "Media Library"  },
        {   index: 5,   key: 'DocumentLibrary', text: "Document Library"  },
        {   index: 6,   key: 'Icons', text: "Icons Library"  },
        {   index: 7,   key: 'TestImages', text: "TestImages Library"  },
        
        
        {   index: 9,   key: 'none', text: "Unknown"  },
    ];

    public getListColumns (findMe) :any {
        let listMap = {};

        //NOTE:
        //This should be the default list structure for the webpart.
        // Be sure these values match the default set in the webpart.manifest.json - needs to be done by hand.
        if (findMe === 'OurTiles') {
            listMap = {
                "testSite" : "",
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
                },
                "setFilter": "zzzShowAll eq 'Yes'",
                "setTab": "Main Menu",
            };

        } else if (findMe === 'AEInspiredTiles') {
            listMap = {
                "testSite" : "",
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
                },
                "setFilter": "",
                "setTab": "Main Menu",
            };
            
        } else if (findMe === 'PromotedLinks') {
            listMap = {
                "testSite" : "",
                "listDef" : "Promoted Links",
                "listDisplay" : "Promoted Links",
                "listName" : "PromotedLinks",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "Title",
                    "colHoverText" : "",
                    "colCategory" : "",
                    "colColor" : "",
                    "colSize" : "",
                    "colGoToLink" : "LinkLocation",
                    "colOpenBehaviour" : "LaunchBehavior",
                    "colImageLink" : "BackgroundImageLocation",
                    "colSort" : "TileOrder"
                },
                "setFilter": "",
                "setTab": "Main Menu",
            };
            
        } else if (findMe === 'MediaLibrary') {
            listMap = {
                "testSite" : "",
                "listDef" : "Media Library",
                "listDisplay" : "Media Library",
                "listName" : "Media Library",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "File/Name",
                    "colHoverText" : "Editor/Title",
                    "colCategory" : "Author/ID",
                    "colColor" : "",
                    "colSize" : "",
                    "colGoToLink" : "File/ServerRelativeUrl",
                    "colOpenBehaviour" : "",
                    "colImageLink" : "File/ServerRelativeUrl",
                    "colSort" : "Title"
                },
                "setFilter": "",
                "setTab": "Main Menu",
            };
            
        } else if (findMe === 'DocumentLibrary') {
            listMap = {
                "testSite" : "",
                "listDef" : "Document Library",
                "listDisplay" : "Document Library",
                "listName" : "DocumentLibrary",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "File/Name",
                    "colHoverText" : "Editor/Title",
                    "colCategory" : "Author/ID",
                    "colColor" : "",
                    "colSize" : "",
                    "colGoToLink" : "File/ServerRelativeUrl",
                    "colOpenBehaviour" : "",
                    "colImageLink" : "",
                    "colSort" : "Title"
                },
                "setFilter": "",
                "setTab": "Main Menu",
            };
            
        } else if (findMe === 'Icons') {
            listMap = {
                "testSite" : "https://mcclickster.sharepoint.com/sites/Templates/Icons/",
                "listDef" : "Icons Library",
                "listDisplay" : "Icons",
                "listName" : "Icons",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "File/Name",
                    "colHoverText" : "Editor/Title",
                    "colCategory" : "zzzTileCategory",
                    "colColor" : "",
                    "colSize" : "",
                    "colGoToLink" : "File/ServerRelativeUrl",
                    "colOpenBehaviour" : "",
                    "colImageLink" : "File/ServerRelativeUrl",
                    "colSort" : "Title"
                },
                "setFilter": "",
                "setTab": "Steps",
            };
            
        } else if (findMe === 'TestImages') {
            listMap = {
                "testSite" : "",
                "listDef" : "Icons Library",
                "listDisplay" : "TestImages",
                "listName" : "TestImages",
                "tabDefault" : false,
                "listMapping" : {
                    "colTitleText" : "File/Name",
                    "colHoverText" : "Editor/Title",
                    "colCategory" : "User1/Title",
                    "colColor" : "",
                    "colSize" : "",
                    "colGoToLink" : "File/ServerRelativeUrl",
                    "colOpenBehaviour" : "",
                    "colImageLink" : "File/ServerRelativeUrl",
                    "colSort" : ""
                },
                "setFilter": "",
                "setTab": "Mike zimmerman",
            };
            
        }
        console.log('List Mapping for: ' + findMe );
        console.log( listMap );        
        return listMap;

    }

  }

  export let corpListMapping = new ListMapping();

