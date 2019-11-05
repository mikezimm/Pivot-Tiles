import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps';
import { PageContext } from '@microsoft/sp-page-context';

export interface theTime {
  now: Date;
  theTime : string;
  milliseconds : number;
}

export interface IPivotTilesProps {

  scenario: string;
  getAll: boolean;
  description: string;
  listDefinition: string;
  listWebURL: string;
  listTitle: string;
  pageContext: PageContext;
  heroType: string;
  heroCategory: string;
  showHero: boolean;
  setHeroFit: string;
  setHeroCover: string;
  
  setFilter: string;
  propURLQuery: boolean;
  setTab: string;
  otherTab: string;
  onHoverEffect: string;
  
  onHoverZoom: string;
  setRatio: string;
  setSize: string;
  setImgFit: string;
  setImgCover: string;
  target: string;
  
  setPivSize: string;
  setPivFormat: string;
  setPivOptions: string[];

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

  startTime: theTime;

  imageWidth: number;
  imageHeight: number;
  textPadding: number;

  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  convertCategoryToIndex?(cat:string) : string;

  analyticsList: string;
  analyticsWeb: string;
  
}
