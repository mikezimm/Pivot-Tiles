import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import styles from './PivotTiles.module.scss';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Utils from './utils';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import PivotTileItem from './../TileItems/PivotTileItem';
import ReactSlideSwiper from '../Slider/ReactSlideSwiper';

import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay } from "@pnp/spfx-controls-react/lib/Carousel";

//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


  export function carouselBuilder(parentProps,parentState){
  
    let carouselElements: JSX.Element[] = this.tileBuilder(parentProps,parentState);

    console.log('carouselBuilder State')
    console.log(parentState);

  let carouselFullLineBuild: any;

  if (parentState.heroTiles[0]) {
    console.log('carouselBuilder:  Found parentState.heroTiles');
    console.log(parentState.heroTiles);
    carouselFullLineBuild = 
    <Carousel
      buttonsLocation={CarouselButtonsLocation.top}
      buttonsDisplay={CarouselButtonsDisplay.block}
      isInfinite={true}
      element={carouselElements}
      onMoveNextClicked={(index: number) => { console.log(`Next button clicked: ${index}`); }}
      onMovePrevClicked={(index: number) => { console.log(`Prev button clicked: ${index}`); }}
    />
      ;
  } else { carouselFullLineBuild = ""; }

//        setImgFit={heroRatio = '1x1'? 'portrait' : 'landscape'}
  console.log(carouselFullLineBuild);
  return carouselFullLineBuild;

}
  
  export function sliderBuilder(parentProps,parentState){
  
        console.log('sliderBuilder State')
        console.log(parentState);

      let sliderFullLineBuild: any;

      if (parentState.heroTiles[0]) {
        console.log('sliderBuilder:  Found parentState.heroTiles');
        console.log(parentState.heroTiles);
        sliderFullLineBuild = 
          <ReactSlideSwiper
            enableNavigation = { true }
            enablePagination = { true }
            enableAutoplay = { false }
            delayAutoplay = { 10 }
            disableAutoplayOnInteraction = { true }
            slidesPerView = { "30" }
            slidesPerGroup = { "1" }
            spaceBetweenSlides = { "15" }
            enableGrabCursor = { true }
            enableLoop = { true }
            listItems = { parentState.heroTiles }
            onHoverZoom={parentProps.onHoverZoom}
            />
          ;
      } else { sliderFullLineBuild = ""; }
  
  //        setImgFit={heroRatio = '1x1'? 'portrait' : 'landscape'}
      console.log(sliderFullLineBuild);
      return sliderFullLineBuild;
  
  }
  

export function heroBuilder(parentProps,parentState){

  /*
  */
    let heroRatio = "";
    let heroHeight = "";
    let imageFit = "";
//    console.log(parentProps);
//    console.log('heroBuilder State')
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
          setImgFit={parentProps.setHeroFit}
          setImgCover={parentProps.setHeroCover}
          target={newTile.target}
          heroCategory={parentProps.heroCategory}

          onHoverZoom={parentProps.onHoverZoom}
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
      onHoverZoom={parentProps.onHoverZoom}
      heroType = {'none'}
      heroCategory={'none'}
      imageWidth = {parentProps.imageWidth}
      imageHeight = {parentProps.imageHeight}
      textPadding = {parentProps.textPadding}
      />
  ));
    //      setImgFit={newTile.setRatio = '1x1'? 'portrait' : newTile.setImgFit}
  return tileBuild;

}
