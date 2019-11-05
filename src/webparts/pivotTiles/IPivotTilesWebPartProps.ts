import { IPivotTileItemProps } from './components/TileItems/IPivotTileItemProps';

import { PageContext } from '@microsoft/sp-page-context';

export interface IPivotTilesWebPartProps {
  scenario: string;
  description: string;
  listDefinition: string;
  getAll: boolean;
  listWebURL: string;
  listTitle: string;
  pageContext: PageContext;
  showHero: boolean;
  heroType: string;
  heroCategory: string;
  setHeroFit: string;
  setHeroCover: string;
  onHoverEffect: string;

  
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
  otherTab: string;
  
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

  imageWidth: number;
  imageHeight: number;
  textPadding: number;
  onHoverZoom: string;
  
  analyticsList: string;
  analyticsWeb: string;

  }