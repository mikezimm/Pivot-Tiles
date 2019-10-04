declare interface IPivotTilesWebPartStrings {
  setRatio: string;
  PropertyPaneDescription: string;
  PropertyPaneMainDescription: string,
  PropertyPaneColumnsDescription1: string,
  PropertyPaneColumnsDescription2: string,
  PropertyPaneAbout: string,
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  DefaultTileList: string;

  description: string;
  listDefinition: string;
  listWebURL: string;
  listTitle: string;

  setSize: string;
  setRatio: string;
  setFilter: string;
  setPivFormat: string;
  setPivSize: string;
  setPivOptions: string;
  propURLQuery: string;
  setTab: string;
  
  colTitleText: string;
  colHoverText: string;
  colCategory: string;
  colColor: string;
  colSize: string;
  colGoToLink: string;
  colOpenBehaviour: string;
  colImageLink: string;
  colSort: string;
  colTileStyle: string;
  
  pivtTitles?:string[];
  
}

declare module 'PivotTilesWebPartStrings' {
  const strings: IPivotTilesWebPartStrings;
  export = strings;
}

declare module 'ControlStrings' {
  const strings: IControlStrings;
  export = strings;
}