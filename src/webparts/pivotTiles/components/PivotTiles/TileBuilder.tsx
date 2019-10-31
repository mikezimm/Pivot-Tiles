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
  
    //let carouselElements: JSX.Element[] = this.tileBuilder(parentProps,parentState);

    let carouselElements: JSX.Element[] = parentState.heroTiles.map(newTile => (
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

    let heroFullLineBuild : any;

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
    console.log('heroFullLineBuild');
    console.log(heroFullLineBuild);
    return heroFullLineBuild;

}

/**
 * 
 * @param parentProps 
 * @param parentState 
 * @param tType 
 */
export function oneTileBuilder(parentProps,parentState, tType, newTile ){

  const thisTile = 
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

      setImgFit={ tType === 'normal' ? newTile.setImgFit : parentProps.setHeroFit }
      setImgCover={ tType === 'normal' ? newTile.setImgCover : parentProps.setHeroCover }

      target={newTile.target}
      onHoverZoom={parentProps.onHoverZoom}

      heroType={ tType === 'normal' ? 'none' : newTile.heroType }
      heroCategory={ tType === 'normal' ? 'none' : parentProps.heroCategory }

      imageWidth = {parentProps.imageWidth}
      imageHeight = {parentProps.imageHeight}
      textPadding = {parentProps.textPadding}

      />;

    //      setImgFit={newTile.setRatio = '1x1'? 'portrait' : newTile.setImgFit}
  return thisTile;

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
