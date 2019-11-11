import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import styles from './PivotTiles.module.scss';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Utils from './utils';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import PivotTileItem from './../TileItems/PivotTileItem';
import ReactSlideSwiper from '../Slider/ReactSlideSwiper';

import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay } from "@pnp/spfx-controls-react/lib/Carousel";


//From https://tahoeninjas.blog/2019/08/07/sharepoint-framework-design-series-layout-patterns-part-iii/
import { CarouselLayout, ICarouselItem } from '../../components/carouselLayout';

//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


/**
 * 
 * @param parentProps 
 * @param parentState 
 */
export function tileBuilder(parentProps,parentState){

  const tileBuild = parentState.filteredTiles.map(newTile => (
      oneTileBuilder(parentProps,parentState, 'normal', newTile )
  ));
    //      setImgFit={newTile.setRatio = '1x1'? 'portrait' : newTile.setImgFit}

  return tileBuild;
}

/**
 * 
 * @param parentProps 
 * @param parentState 
 */

export function carouselBuilder(parentProps,parentState){
  
  let carouselFullLineBuild: any;

  if (parentState.heroTiles[0]) {

   const carouselElements = parentState.heroTiles.map(newTile => (
        oneTileBuilder(parentProps,parentState, 'hero', newTile )
    ));

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

  return carouselFullLineBuild;
}

/**
 * 
 * @param parentProps 
 * @param parentState 
 */
export function heroBuilder(parentProps,parentState){

    let heroFullLineBuild : any;
    if (parentState.heroTiles) {
      heroFullLineBuild = parentState.heroTiles.map(newTile => (
        oneTileBuilder(parentProps,parentState, 'hero', newTile )
      ));
    } else { heroFullLineBuild = ""; }

    return heroFullLineBuild;
}

/**
 * 
 * @param parentProps 
 * @param parentState 
 */
export function sliderBuilder(parentProps,parentState){

  let sliderFullLineBuild: any;

  if (parentState.heroTiles[0]) {
    
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

  return sliderFullLineBuild;
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


export function carouselLayout(parentProps,parentState, theseAreItems, thisCategory){
  // Carousel option from https://github.com/hugoabernier/WebPartDesignSeries

  //remap props to correct ones for HGcarouselLayout
  let items = theseAreItems.map(item => ({

    imageSrc: item.imageUrl,
    title: item.title,
    location: item.description,
    href: item.href,
    target: item.target,

  }));

  let carousel = 
    <CarouselLayout
      pagingTemplate={'{0} of {1} in ' + thisCategory}
      ariaLabel={'Use right and left arrow keys to navigate between images in the carousel. Use up and down arrow keys to access the edit and remove buttons for any image.'}
      items={items}
      onSlideClick={(currentSlide) => { alert(`You clicked on slide ${currentSlide+1}`); }}
    >
    </CarouselLayout>;

  return carousel;

}

