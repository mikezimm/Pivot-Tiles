import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import styles from './PivotTiles.module.scss';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Utils from './utils';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import PivotTileItem from './../TileItems/PivotTileItem';
//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


export function heroBuilder(parentProps,parentState){

  /*
  */
    let heroRatio = "";
    let heroHeight = "";
    let imageFit = "";
//    console.log(parentProps);
//    console.log('heroBuilder State');
//    console.log(parentState);
    if (parentProps.heroType === "header" || parentProps.heroType === "footer" || parentProps.heroType === "inLine"  ) {
      heroRatio = '1x1';
      heroHeight = '300';
      imageFit = 'portrait';
    } else {
      heroRatio = '2x1';
      heroHeight = '300';
      imageFit = 'landscape';
    }

    let heroFullLineBuild = "";

    if (parentState.heroTiles) {
      console.log('heroBuilder:  Found parentState.heroTiles');
      heroFullLineBuild = parentState.heroTiles.map(newTile => (
        <PivotTileItem
          parentCat = {parentState.filteredCategory}
          imageUrl={newTile.imageUrl}
          title={newTile.title}
          description={newTile.description}
          href={newTile.href}
          category={newTile.category}
          setTab={newTile.setTab}
          Id={newTile.Id}
          options={newTile.options}
          color={newTile.color}
          imgSize={newTile.imgSize}
          listWebURL={newTile.listWebURL}
          listTitle={newTile.listTitle}
          setRatio={newTile.setRatio}
          setSize={newTile.setSize}
          setImgFit={imageFit}
          setImgCover={newTile.setImgCover}
          target={newTile.target}
          heroType = {newTile.heroType}

          imageWidth = {parentProps.imageWidth}
          imageHeight = {parentProps.imageHeight}
          textPadding = {parentProps.textPadding}

          />
        ));
    } else { heroFullLineBuild = ""; }

//        setImgFit={heroRatio = '1x1'? 'portrait' : 'landscape'}
//    console.log(heroFullLineBuild);
    return heroFullLineBuild;

}

export function tileBuilder(parentProps,parentState){

  const tileBuild = parentState.filteredTiles.map(newTile => (
    <PivotTileItem
      parentCat = {parentState.filteredCategory}
      imageUrl={newTile.imageUrl}
      title={newTile.title}
      description={newTile.description}
      href={newTile.href}
      category={newTile.category}
      setTab={newTile.setTab}
      Id={newTile.Id}
      options={newTile.options}
      color={newTile.color}
      imgSize={newTile.imgSize}
      listWebURL={newTile.listWebURL}
      listTitle={newTile.listTitle}
      setRatio={newTile.setRatio}
      setSize={newTile.setSize}
      setImgFit={newTile.setImgFit}
      setImgCover={newTile.setImgCover}
      target={newTile.target}
      heroType = {'none'}
      imageWidth = {parentProps.imageWidth}
      imageHeight = {parentProps.imageHeight}
      textPadding = {parentProps.textPadding}
      />
  ));
    //      setImgFit={newTile.setRatio = '1x1'? 'portrait' : newTile.setImgFit}
  return tileBuild;

}
