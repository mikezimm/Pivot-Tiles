import * as React from 'react';
import styles from '../PivotTiles/PivotTiles.module.scss';
import tileStyles from './../TileItems/PivotTileItem.module.scss';
import { IMyCarouselProps } from './IMyCarouselProps';
import { IMyCarouselState } from './IMyCarouselState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';

import { Link } from 'office-ui-fabric-react/lib/Link';
import { escape } from '@microsoft/sp-lodash-subset';
import Utils from '../PivotTiles/utils';
import tUtils from './../TileItems/utilTiles';


//https://pnp.github.io/pnpjs/documentation/polyfill/ -- Needed to select/extend pnpJs in IE11
import "@pnp/polyfill-ie11";
import { sp, Web } from '@pnp/sp';

import * as tileBuilders from '../PivotTiles/TileBuilder';

import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay } from "@pnp/spfx-controls-react/lib/Carousel";

export default class PivotTiles extends React.Component<IMyCarouselProps, IMyCarouselState> {

  //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about setting constructor
//  public constructor(props:IPivotTilesProps){
  public constructor(props:IMyCarouselProps){
    super(props);
    this.state = { 

    };
   
    
  }

  public componentDidMount() {
    //Not using this function because it just did not want to work.

  }
  
  public componentDidUpdate(prevProps){

  }


  public createCarousels(thisState){
    let elemnts = [];
    if (thisState.heroTiles[0]){
      elemnts = thisState.heroTiles.map(newTile => (
        <div>
          {newTile.title}
        </div>
        ));
    }

    return (
      elemnts
    );
  }



  public render(): React.ReactElement<IPivotTilesProps> {
    // This will put formatted tiles in place.  When width = 1 it looks great.
    let carouselElements: JSX.Element[] = tileBuilders.tileBuilder(this.props,this.state);

    return (
      <div className={styles.pivotTiles}>
        { ( (this.props.showHero === true && this.props.heroType === "header" &&  this.state.heroStatus === "Ready") ? ( heroFullLineBuild ) : ""  ) }

        <Carousel
          buttonsLocation={CarouselButtonsLocation.top}
          buttonsDisplay={CarouselButtonsDisplay.block}
          isInfinite={true}
          element={carouselElements}
          onMoveNextClicked={(index: number) => { console.log(`Next button clicked: ${index}`); }}
          onMovePrevClicked={(index: number) => { console.log(`Prev button clicked: ${index}`); }}
        />
        </div>
    )

  }


}

