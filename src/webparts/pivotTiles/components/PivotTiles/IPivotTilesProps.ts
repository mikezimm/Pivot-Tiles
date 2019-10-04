import {IPivotTileItemProps} from './../TileItems/IPivotTileItemProps'

export interface IPivotTilesProps {

  description: string;
  listDefinition: string;
  listWebURL: string;
  listTitle: string;

  setFilter: string;
  propURLQuery: boolean;
  setTab: string;
  
  setRatio: string;
  setSize: string;
  setImgFit: string;
  setImgCover: string;

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

  loadListItems?: () => Promise<IPivotTileItemProps[]>;
  convertCategoryToIndex?(cat:string) : string;
}
