import { IPivotTileItemProps } from './components/TileItems/IPivotTileItemProps';

export interface IPivotTilesWebPartProps {
  description: string;
  listDefinition: string;
  listWebURL: string;
  listTitle: string;

  setSize: string;
  setRatio: string;
  setFilter: string;
  propURLQuery: boolean;
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

  }