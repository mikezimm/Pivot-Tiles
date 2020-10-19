

import { IPivotTilesProps } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';

/***
 *    d8888b. db    db d888888b db      d8888b.       .o88b.  .d8b.  d888888b d88888b  d888b   .d88b.  d8888b. d888888b d88888b .d8888. 
 *    88  `8D 88    88   `88'   88      88  `8D      d8P  Y8 d8' `8b `~~88~~' 88'     88' Y8b .8P  Y8. 88  `8D   `88'   88'     88'  YP 
 *    88oooY' 88    88    88    88      88   88      8P      88ooo88    88    88ooooo 88      88    88 88oobY'    88    88ooooo `8bo.   
 *    88~~~b. 88    88    88    88      88   88      8b      88~~~88    88    88~~~~~ 88  ooo 88    88 88`8b      88    88~~~~~   `Y8b. 
 *    88   8D 88b  d88   .88.   88booo. 88  .8D      Y8b  d8 88   88    88    88.     88. ~8~ `8b  d8' 88 `88.   .88.   88.     db   8D 
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'       `Y88P' YP   YP    YP    Y88888P  Y888P   `Y88P'  88   YD Y888888P Y88888P `8888Y' 
 *                                                                                                                                      
 *                                                                                                                                      
 */

export function buildTileCategoriesFromResponse(pivotProps: IPivotTilesProps , pivotState : IPivotTilesState, response  : IPivotTileItemProps[], currentHero, thisCatColumn ){

    let tileCategories = [];
    let usingDefinedCategoryColumn = thisCatColumn === 'category' ? true : false ;

    if (thisCatColumn === 'created' || thisCatColumn === 'modified') {
      let thisTime = pivotState[thisCatColumn + 'Info'];
      let bestFormat = thisTime.bestFormat;
      tileCategories = thisTime.cats[bestFormat];
      console.log('buildTileCategoriesFromResponse: thisCatColumn',thisCatColumn);
      console.log('buildTileCategoriesFromResponse: tileCategories',tileCategories);

      return tileCategories;

    } else if (thisCatColumn === 'createdByTitle' || thisCatColumn === 'modifiedByTitle') {
      tileCategories= pivotState[thisCatColumn + 's'];
      return tileCategories;

    } else {

      for (let tile of response) {

        if (!tile[thisCatColumn]) {
          //This allows it to skip if the tile category is empty or blank

        } else if (tile[thisCatColumn][0] === pivotProps.otherTab) {
          //Skip because this one was assigned the "Others" category

        } else {

          const isArray = typeof(tile.category);
          //console.log(isArray);
          let splitCol = pivotProps.colCategory.split("/");
          let leftSide = splitCol[0];
          let righttSide = splitCol[1];

          if (isArray !== 'string' && splitCol.length === 1) {

            for (let category of tile.category) {
              if(tileCategories.indexOf(category) === -1) {
                tileCategories = updatetileCats(pivotProps, category, tileCategories, currentHero);
              }
            }

          } else {
            //Test as Lookup column (which is not an array but only one value)
      
            if(tileCategories.indexOf(tile.category) === -1) {
              tileCategories.push(tile.category);
            }
          } //if (isArray !== 'string' && splitCol.length === 1) {
        } //if (!tile[thisCatColumn]) {
      } //for (let tile of response) {
    }

    //Added to remove hero category if it is either carousel or slider which should have all these tiles.
    if (pivotProps.showHero === true &&
      ( pivotProps.heroType === 'carouselLayout')) {
      //Remove this hero tile category because all tiles are in component
      const heroIndex = tileCategories.indexOf(currentHero);
      if ( heroIndex > -1 ) {
        tileCategories.splice(heroIndex,1);
      }

    }


    tileCategories.sort();

    const otherIndex = tileCategories.indexOf(pivotProps.otherTab);
    if ( otherIndex > -1 ) {
      tileCategories.splice(otherIndex,1);
      tileCategories.push(pivotProps.otherTab);
    }

    return tileCategories;

  } // END public static buildTileCategoriesFromResponse(pivotProps: IPivotTilesProps , pivotState : IPivotTilesState, response, currentHero, thisCatColumn ){


  
/***
 *    db    db d8888b. d8888b.  .d8b.  d888888b d88888b      d888888b d888888b db      d88888b       .o88b.  .d8b.  d888888b .d8888. 
 *    88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          `~~88~~'   `88'   88      88'          d8P  Y8 d8' `8b `~~88~~' 88'  YP 
 *    88    88 88oodD' 88   88 88ooo88    88    88ooooo         88       88    88      88ooooo      8P      88ooo88    88    `8bo.   
 *    88    88 88~~~   88   88 88~~~88    88    88~~~~~         88       88    88      88~~~~~      8b      88~~~88    88      `Y8b. 
 *    88b  d88 88      88  .8D 88   88    88    88.             88      .88.   88booo. 88.          Y8b  d8 88   88    88    db   8D 
 *    ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P         YP    Y888888P Y88888P Y88888P       `Y88P' YP   YP    YP    `8888Y' 
 *                                                                                                                                   
 *                                                                                                                                   
 */


function updatetileCats(pivotProps, thisCat, allCats, currentHero) {

    if (  pivotProps.showHero === true && thisCat === currentHero && ( pivotProps.heroType === 'carouselLayout' )) {
      //  If heroType is slider or carousel and this is the heroCategory, do not add to tile categories.
      //  because all tiles will be in those react components.

    } else {
      allCats.push(thisCat);
    }

  return allCats;
}