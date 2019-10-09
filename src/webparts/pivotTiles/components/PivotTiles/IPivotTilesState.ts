import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps'

export interface IPivotTilesState {

  heroTiles?: IPivotTileItemProps[];
  heroIds?: string[];
  allTiles?:IPivotTileItemProps[];
  filteredTiles?: IPivotTileItemProps[];
  pivtTitles?:string[];
  filteredCategory?: string;
  showAllTiles?: boolean;
  pivotDefSelKey?: string;
  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  loadStatus?: string;

}
