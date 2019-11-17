import { IPivotTileItemProps } from './components/TileItems/IPivotTileItemProps';

import { PageContext } from '@microsoft/sp-page-context';

export interface IPivotTilesWebPartProps {

  //Main webpart properties
  scenario: string;
  description: string;
  pageContext: PageContext;

  //Hero tile properties
  showHero: boolean;
  heroType: string;
  heroCategory: string;
  heroRatio: number;
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


  }