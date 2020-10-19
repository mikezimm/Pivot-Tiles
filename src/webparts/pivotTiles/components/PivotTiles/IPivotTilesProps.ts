import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps';
import { PageContext } from '@microsoft/sp-page-context';

export interface theTime {
  now: Date;
  theTime : string;
  milliseconds : number;
}

export interface ICustomLogic {

  category: string;
  regex?: string;
  att?: string; // regex attributes "g", "i", "m" - default if nothing here is "i"
  eval?: string; // Used in place of regex
  break?: boolean; // If this one is true, then don't do any more.  Good for bucketing dates

}

export type ICustomTypes = 'tileCategory' | 'semiColon1' | 'semiColon2' | 'custom';

export interface ICustomCategories {

  type: ICustomTypes;
  column: string;
  logic: ICustomLogic[] | string[];

}

export interface IPivotTilesProps {

  //Main webpart properties
  scenario: string;
  description: string;
  pageContext: PageContext;
  tenant: string;
  urlVars: {};

  //Hero tile properties
  showHero: boolean;
  heroType: string;
  heroCategory: string;
  heroRatio: number;
  setHeroFit: string;
  setHeroCover: string;

  //Image & main tile properties
  onHoverZoom: string;
  onHoverEffect: string;
  setSize: string;
  setRatio: string;
  setImgFit: string;
  setImgCover: string;
  target: string;

  //Custom image properties
  imageWidth: number;
  imageHeight: number;
  textPadding: number;

  //Pivot Tab properties
  setTab: string;
  setPivSize: string;
  setPivFormat: string;
  setPivOptions: string[];
  otherTab: string;
  enableChangePivots: boolean;
  maxPivotChars: number;
  
  //List primary settings
  listDefinition: string;
  listWebURL: string;
  listTitle: string;
  setFilter: string;
  propURLQuery: boolean;
  getAll: boolean;

  //List column mapping
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

  custCategories: ICustomCategories;

  //List column mapping - always available columns
  colModified: string;
  colModifiedById: string;
  colModifiedByTitle: string;
  colCreated: string;
  colCreatedById: string;
  colCreatedByTitle: string;

  
  //List based analytics properties
  analyticsList: string;
  analyticsWeb: string;

  //Properties NOT in main webpart properties
  
  startTime: theTime;

  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  convertCategoryToIndex?(cat:string) : string;

}
