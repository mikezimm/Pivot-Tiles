import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps';
import { PageContext } from '@microsoft/sp-page-context';

export interface theTime {
  now: Date;
  theTime : string;
  milliseconds : number;
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
  
  //List based analytics properties
  analyticsList: string;
  analyticsWeb: string;

  //Properties NOT in main webpart properties
  
  startTime: theTime;

  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  convertCategoryToIndex?(cat:string) : string;

}
