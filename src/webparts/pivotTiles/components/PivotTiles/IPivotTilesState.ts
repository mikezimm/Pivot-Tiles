import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps';
import { theTime } from './IPivotTilesProps';

export interface IPivotTilesState {

  heroTiles?: IPivotTileItemProps[];
  heroIds?: string[];
  heroCategory: string;
  
  allTiles?:IPivotTileItemProps[];
  filteredTiles?: IPivotTileItemProps[];
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

  endTime?: theTime;

  items?:any[];

}
