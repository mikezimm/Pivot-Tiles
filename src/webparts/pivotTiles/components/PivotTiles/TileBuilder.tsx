import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import styles from './PivotTiles.module.scss';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Utils from './utils'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import PivotTileItem from './../TileItems/PivotTileItem';
//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


export function heroBuilder(parentProps,parentState){

    let heroRatio = "";
    let heroHeight = "";
    console.log(parentProps);
    if (parentProps.heroPosition === "header" || parentProps.heroPosition === "footer") {
      heroRatio = '1x1';
      heroHeight = '300';
    } else {
      heroRatio = '2x1';
      heroHeight = '300';
    }

    const heroFullLineBuild = parentState.heroTiles.map(newTile => (
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
        setRatio={heroRatio}
        setSize={heroHeight}
        setImgFit={'landscape'}
        setImgCover={newTile.setImgCover}
        target={newTile.target}
        />
      ));

    return heroFullLineBuild;

}
