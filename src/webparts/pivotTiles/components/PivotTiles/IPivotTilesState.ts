import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps';
import { theTime } from './IPivotTilesProps';
import { IDateInfo } from './utils';


export interface IPivotTilesState {

  heroTiles?: IPivotTileItemProps[];
  heroIds?: string[];
  heroCategory: string;
  
  allTiles?:IPivotTileItemProps[];
  filteredTiles?: IPivotTileItemProps[];
  lastFilteredTiles?: IPivotTileItemProps[];
  pivtTitles?:string[];
  filteredCategory?: string;
  showAllTiles?: boolean;
  pivotDefSelKey?: string;
  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  loadStatus?: string;
  heroStatus?: string;
  showTips?: string;
  loadError?: string;
  lookupColumns?: string[];
  showOtherTab?: boolean;
  heroCategoryError?: boolean;
  listError?: boolean;
  itemsError?: boolean;
  heroError?: boolean;

  searchType?: string;
  searchShow?: boolean;
  searchCount?: number;
  searchWhere?: string;

  shuffleShow?: boolean;

  endTime?: theTime;

  items?:any[];

  listStaticName: string;

  setLayout?: string;
  
  colCategory: string;

  thisCatColumn: string;
  
  createdInfo?: IDateInfo;
  modifiedInfo?: IDateInfo;
  categoryInfo?: IDateInfo;

}
