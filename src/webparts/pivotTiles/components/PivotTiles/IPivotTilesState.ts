import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps'

export interface IPivotTilesState {

  allTiles?:IPivotTileItemProps[];
  filteredTiles?: IPivotTileItemProps[];
  pivtTitles?:string[];
  filteredCategory?: string;
  showAllTiles?: boolean;
  pivotDefSelKey?: string;
  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  loadStatus?: string;
}
