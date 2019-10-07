import { IPivotTileItemProps } from './components/TileItems/IPivotTileItemProps';

import { PageContext } from '@microsoft/sp-page-context';

export interface IPivotTilesWebPartProps {
  description: string;
  listDefinition: string;
  listWebURL: string;
  listTitle: string;
  pageContext: PageContext;

  setSize: string;
  setRatio: string;
  setImgFit: string;
  setImgCover: string;
  target: string;

  setFilter: string;
  setPivSize: string;
  setPivFormat: string;
  setPivOptions: string[];
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