
import { IPivotTilesProps, ICustomCategories } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps,  } from './../TileItems/IPivotTileItemProps';

import { getTheCurrentTime,} from '../../../../services/createAnalytics';
import {tileTime} from '../TileItems/IPivotTileItemProps';
import { getLocalMonths, ISO8601_week_no, makeSmallTimeObject, ITheTime } from '../../../../services/dateServices';

import { removeLeadingUnderScore } from './BuildTileCategories';

import { convertLinks, parseMe } from './UtilsNew';

import { getQuarter } from './QuickBuckets';

const monthCats = getLocalMonths('en-us','short');
const one_day = 1000 * 60 * 60 * 24;

//https://stackoverflow.com/a/33076482
export function getNameInitials( name : any ) {

  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;

}

/***
 *    d8888b. db    db d888888b db      d8888b.      d888888b d888888b db      d88888b       .o88b.  .d88b.  db      db           d88888b d8888b.      d8888b. d88888b .d8888. d8888b. 
 *    88  `8D 88    88   `88'   88      88  `8D      `~~88~~'   `88'   88      88'          d8P  Y8 .8P  Y8. 88      88           88'     88  `8D      88  `8D 88'     88'  YP 88  `8D 
 *    88oooY' 88    88    88    88      88   88         88       88    88      88ooooo      8P      88    88 88      88           88ooo   88oobY'      88oobY' 88ooooo `8bo.   88oodD' 
 *    88~~~b. 88    88    88    88      88   88         88       88    88      88~~~~~      8b      88    88 88      88           88~~~   88`8b        88`8b   88~~~~~   `Y8b. 88~~~   
 *    88   8D 88b  d88   .88.   88booo. 88  .8D         88      .88.   88booo. 88.          Y8b  d8 `8b  d8' 88booo. 88booo.      88      88 `88.      88 `88. 88.     db   8D 88      
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'         YP    Y888888P Y88888P Y88888P       `Y88P'  `Y88P'  Y88888P Y88888P      YP      88   YD      88   YD Y88888P `8888Y' 88      
 *                                                                                                                                                                                     
 *                                                                                                                                                                                     
 */


  export function buildTileCollectionFromResponse(response, pivotProps: IPivotTilesProps , custCategories: ICustomCategories, fixedURL, currentHero){

  //           let tileCollection = response.map(item=>new ClassTile(item));
  //          https://stackoverflow.com/questions/47755247/typescript-array-map-return-object

    console.log( 'buildTileCollectionFromResponse pivotProps:', pivotProps );

    let modifiedInfo = createIDateCategoryArrays('modified');
    let createdInfo = createIDateCategoryArrays('created');
    let categoryInfo = createIDateCategoryArrays('category');

    let modifiedByInfo = createIPersonCategoryArrays('modifiedBy');
    let createdByInfo = createIPersonCategoryArrays('createdBy');

    let modifiedByTitles = [];
    let modifiedByIDs = [];
    let createdByTitles = [];
    let createdByIDs = [];

    createdInfo.earliest = new Date(2033,1,1);
    createdInfo.latest = new Date(1999,1,1);

    modifiedInfo.earliest = new Date(2033,1,1);
    modifiedInfo.latest = new Date(1999,1,1);

    let startTime = makeSmallTimeObject('');

    /***
     *     d888b  d88888b d888888b       .d8b.  db      db           d8888b.  .d8b.  d888888b d88888b      db    db  .d8b.  d8888b. d888888b  .d8b.  d888888b d888888b  .d88b.  d8b   db .d8888. 
     *    88' Y8b 88'     `~~88~~'      d8' `8b 88      88           88  `8D d8' `8b `~~88~~' 88'          88    88 d8' `8b 88  `8D   `88'   d8' `8b `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
     *    88      88ooooo    88         88ooo88 88      88           88   88 88ooo88    88    88ooooo      Y8    8P 88ooo88 88oobY'    88    88ooo88    88       88    88    88 88V8o 88 `8bo.   
     *    88  ooo 88~~~~~    88         88~~~88 88      88           88   88 88~~~88    88    88~~~~~      `8b  d8' 88~~~88 88`8b      88    88~~~88    88       88    88    88 88 V8o88   `Y8b. 
     *    88. ~8~ 88.        88         88   88 88booo. 88booo.      88  .8D 88   88    88    88.           `8bd8'  88   88 88 `88.   .88.   88   88    88      .88.   `8b  d8' 88  V888 db   8D 
     *     Y888P  Y88888P    YP         YP   YP Y88888P Y88888P      Y8888D' YP   YP    YP    Y88888P         YP    YP   YP 88   YD Y888888P YP   YP    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
     *                                                                                                                                                                                           
     *                                                                                                                                                                                           
     */

    /**
     *      Get all date variations
     */
    for (let item of response) {

      //Do all to modified
        item.modified = (getColumnValue(pivotProps,item,'colModified'));
        item.modifiedByID = (getColumnValue(pivotProps,item,'colModifiedById')); // This is required for addPersonVariations
        item.modifiedByTitle = (getColumnValue(pivotProps,item,'colModifiedByTitle')); // This is required for addPersonVariations

        item = addPersonVariations(item,'modifiedBy');

        if(modifiedByTitles.indexOf(item.modifiedByTitle) === -1) { modifiedByTitles.push(item.modifiedByTitle); }
        if(modifiedByIDs.indexOf(item.modifiedByID) === -1) { modifiedByIDs.push(item.modifiedByID); }

        item = addDateVariations(item,'modified', pivotProps.startTime);
        modifiedInfo.cats = pushDatesToCategories(modifiedInfo.cats, item.modifiedTime);
        item = localizeDateVariations(item,'modified');

        modifiedByInfo.cats = pushPersonsToCategories(modifiedByInfo.cats, item.modifiedBy);

        if ( item.modifiedTime.cats.time[0] < modifiedInfo.earliest )  { modifiedInfo.earliest = item.modifiedTime.cats.time[0]; }
        if ( item.modifiedTime.cats.time[0] > modifiedInfo.latest )  { modifiedInfo.latest = item.modifiedTime.cats.time[0]; } 

        item.modifiedSimpleDate = item.modifiedTime.cats.dayYYYYMMDD[0];
        item.modifiedSimpleTime = item.modifiedTime.cats.locTime[0];
        item.modifiedSimpleDateTime = item.modifiedSimpleDate + ' - ' + item.modifiedSimpleTime;

        item.modifiedInitials = getNameInitials( item.modifiedByTitle );
        item.modifiedNote = item.modifiedSimpleDate + ' ( ' + item.modifiedInitials + ' )';

      //Do all to created
        item.created = (getColumnValue(pivotProps,item,'colCreated'));
        item.createdByID = (getColumnValue(pivotProps,item,'colCreatedById')); // This is required for addPersonVariations
        item.createdByTitle = (getColumnValue(pivotProps,item,'colCreatedByTitle')); // This is required for addPersonVariations

        item = addPersonVariations(item,'createdBy');

        if(createdByTitles.indexOf(item.createdByTitle) === -1) { createdByTitles.push(item.createdByTitle); }
        if(createdByIDs.indexOf(item.createdByID) === -1) { createdByIDs.push(item.createdByID); }

        item = addDateVariations(item,'created', pivotProps.startTime);
        createdInfo.cats = pushDatesToCategories(createdInfo.cats, item.createdTime);
        item = localizeDateVariations(item,'created');

        createdByInfo.cats = pushPersonsToCategories(createdByInfo.cats, item.createdBy);

        if ( item.createdTime.cats.time[0] < createdInfo.earliest )  { createdInfo.earliest = item.createdTime.cats.time[0] ; }
        if ( item.createdTime.cats.time[0] > createdInfo.latest )  { createdInfo.latest = item.createdTime.cats.time[0] ; } 

        item.createdSimpleDate = item.createdTime.cats.dayYYYYMMDD[0];
        item.createdSimpleTime = item.createdTime.cats.locTime[0];
        item.createdSimpleDateTime = item.createdSimpleDate + ' - ' + item.createdSimpleTime;

        item.createdInitials = getNameInitials( item.createdByTitle );
        item.createdNote = item.createdSimpleDate + ' ( ' + item.createdInitials + ' )';

    }


    createdInfo.cats = sortAllDateCategories(createdInfo.cats);
    modifiedInfo.cats = sortAllDateCategories(modifiedInfo.cats);
    categoryInfo.cats = sortAllDateCategories(categoryInfo.cats);
    modifiedByInfo.cats = sortAllPersonCategories(modifiedByInfo.cats);
    createdByInfo.cats = sortAllPersonCategories(createdByInfo.cats);

    /**
     *   In this area, go back and localize date categories like we do for items above.
     */


    modifiedInfo.range = (Math.round(modifiedInfo.latest.getTime() - modifiedInfo.earliest.getTime()) / (one_day));
    createdInfo.range = (Math.round(createdInfo.latest.getTime() - createdInfo.earliest.getTime()) / (one_day));

    createdInfo.bestFormat = findBestDateCategory(createdInfo.cats, pivotProps.maxPivotChars);
    modifiedInfo.bestFormat = findBestDateCategory(modifiedInfo.cats, pivotProps.maxPivotChars);

    modifiedByInfo.bestFormat = findBestPersonCategory(modifiedByInfo.cats, pivotProps.maxPivotChars);
    createdByInfo.bestFormat = findBestPersonCategory(createdByInfo.cats, pivotProps.maxPivotChars);

    let bestCategoryFormat = 'unknownMZ';


    /***
     *    .d8888. d88888b d888888b      d8888b. d88888b .d8888. d888888b      d88888b  .d88b.  d8888b. .88b  d88.  .d8b.  d888888b          dD d888888b d888888b d88888b .88b  d88. Cb     
     *    88'  YP 88'     `~~88~~'      88  `8D 88'     88'  YP `~~88~~'      88'     .8P  Y8. 88  `8D 88'YbdP`88 d8' `8b `~~88~~'        d8'    `88'   `~~88~~' 88'     88'YbdP`88  `8b   
     *    `8bo.   88ooooo    88         88oooY' 88ooooo `8bo.      88         88ooo   88    88 88oobY' 88  88  88 88ooo88    88          d8       88       88    88ooooo 88  88  88    8b  
     *      `Y8b. 88~~~~~    88         88~~~b. 88~~~~~   `Y8b.    88         88~~~   88    88 88`8b   88  88  88 88~~~88    88         C88       88       88    88~~~~~ 88  88  88    88D 
     *    db   8D 88.        88         88   8D 88.     db   8D    88         88      `8b  d8' 88 `88. 88  88  88 88   88    88          V8      .88.      88    88.     88  88  88    8P  
     *    `8888Y' Y88888P    YP         Y8888P' Y88888P `8888Y'    YP         YP       `Y88P'  88   YD YP  YP  YP YP   YP    YP           V8.  Y888888P    YP    Y88888P YP  YP  YP  .8P   
     *                                                                                                                                      VD                                      CP     
     *                                                                                                                                                                                     
     */
    /**
     *  Go back and set bestFormat for created and modified by info
     */

    for (let item of response) {
      item.created = item.createdTime.cats[createdInfo.bestFormat][0];
      item.createdTime.cats.bestFormat[0] = createdInfo.bestFormat;
      item.modified = item.modifiedTime.cats[modifiedInfo.bestFormat][0];
      item.modifiedTime.cats.bestFormat[0] = modifiedInfo.bestFormat;

      item.createdBy.cats.bestFormat[0] = createdByInfo.bestFormat;
      item.modifiedBy.cats.bestFormat[0] = modifiedByInfo.bestFormat;
    }


    /***
     *    .d8888. d88888b d888888b      db       .d8b.  .d8888. d888888b       .o88b.  .d8b.  d888888b d88888b  d888b   .d88b.  d8888b. db    db 
     *    88'  YP 88'     `~~88~~'      88      d8' `8b 88'  YP `~~88~~'      d8P  Y8 d8' `8b `~~88~~' 88'     88' Y8b .8P  Y8. 88  `8D `8b  d8' 
     *    `8bo.   88ooooo    88         88      88ooo88 `8bo.      88         8P      88ooo88    88    88ooooo 88      88    88 88oobY'  `8bd8'  
     *      `Y8b. 88~~~~~    88         88      88~~~88   `Y8b.    88         8b      88~~~88    88    88~~~~~ 88  ooo 88    88 88`8b      88    
     *    db   8D 88.        88         88booo. 88   88 db   8D    88         Y8b  d8 88   88    88    88.     88. ~8~ `8b  d8' 88 `88.    88    
     *    `8888Y' Y88888P    YP         Y88888P YP   YP `8888Y'    YP          `Y88P' YP   YP    YP    Y88888P  Y888P   `Y88P'  88   YD    YP    
     *                                                                                                                                           
     *                                                                                                                                           
     */


    modifiedInfo = setLastCategoryPer(modifiedInfo);
    createdInfo = setLastCategoryPer(createdInfo);
    modifiedByInfo = setLastCategoryPerson(modifiedByInfo);
    createdByInfo = setLastCategoryPerson(createdByInfo);
    
    //categoryInfo = setLastCategoryPer(categoryInfo);
    //if (!categoryInfo.lastCategory) { categoryInfo.lastCategory = pivotProps.setTab }
    categoryInfo.lastCategory = pivotProps.setTab;

    // on my home PC, for 649 items x 3000 loops it took 30 seconds.

    let endTime = getTheCurrentTime();
    let showOtherTab = false;

    //console.log('response', response);

  /***
   *    d888888b d888888b db      d88888b  .o88b.  .d88b.  db      db                       d8888b. d88888b .d8888. d8888b.  .d88b.  d8b   db .d8888. d88888b    .88b  d88.  .d8b.  d8888b.      
   *    `~~88~~'   `88'   88      88'     d8P  Y8 .8P  Y8. 88      88           C8888D      88  `8D 88'     88'  YP 88  `8D .8P  Y8. 888o  88 88'  YP 88'        88'YbdP`88 d8' `8b 88  `8D      
   *       88       88    88      88ooooo 8P      88    88 88      88                       88oobY' 88ooooo `8bo.   88oodD' 88    88 88V8o 88 `8bo.   88ooooo    88  88  88 88ooo88 88oodD'      
   *       88       88    88      88~~~~~ 8b      88    88 88      88           C8888D      88`8b   88~~~~~   `Y8b. 88~~~   88    88 88 V8o88   `Y8b. 88~~~~~    88  88  88 88~~~88 88~~~        
   *       88      .88.   88booo. 88.     Y8b  d8 `8b  d8' 88booo. 88booo.                  88 `88. 88.     db   8D 88      `8b  d8' 88  V888 db   8D 88.     db 88  88  88 88   88 88           
   *       YP    Y888888P Y88888P Y88888P  `Y88P'  `Y88P'  Y88888P Y88888P                  88   YD Y88888P `8888Y' 88       `Y88P'  VP   V8P `8888Y' Y88888P VP YP  YP  YP YP   YP 88           
   *                                                                                                                                                                                             
   *                                                                                                                                                                                             
   */


    let custSearchTitle = true;
    let custSearchDesc = true;
    let custSearchHref = true;
    let custSearchCate = true;
    let custSearchModBy = true;
    let custSearchCreateBy = true;

    if ( custCategories.type !== 'tileCategory' ) {

      if ( custCategories.column && custCategories.column.length > 0 ) {

        if ( custCategories.column.indexOf( pivotProps.colTitleText ) === -1 ) { custSearchTitle = false; }
        if ( custCategories.column.indexOf( pivotProps.colHoverText ) === -1 ) { custSearchDesc = false; }
        if ( custCategories.column.indexOf( pivotProps.colGoToLink ) === -1 ) { custSearchHref = false; }
        if ( custCategories.column.indexOf( pivotProps.colCategory ) === -1 ) { custSearchCate = false; }
        if ( custCategories.column.indexOf( 'ModifiedBy/Title' ) === -1 ) { custSearchModBy = false; }
        if ( custCategories.column.indexOf( 'CreatedBy/Title' ) === -1 ) { custSearchCreateBy = false; }

      }


    }

    let tileCollection: IPivotTileItemProps[] = response.map(item => {

      let modifiedByTitle = getColumnValue(pivotProps,item,'colModifiedByTitle');

      let createdByTitle = getColumnValue(pivotProps,item,'colCreatedByTitle');
      
      let title = getColumnValue(pivotProps,item,'colTitleText');

      let description = getColumnValue(pivotProps,item,'colHoverText');

      let href = getColumnValue(pivotProps,item,'colGoToLink');

      let category = getColumnValue(pivotProps,item,'colCategory');
      if ( category === undefined || category === null ) { category = []; }
      let categoryCopy = JSON.stringify(category);

      //Need to resolve when category is undefined in case that webpart prop is empty
      let testCategory = category === undefined || category === null ? false : true;
      if ( testCategory === false || category.length === 0 ) { category = [pivotProps.otherTab] ; }

      //Can't do specific type here or it will break the multi-typed logic below
      let custCatLogi : any = custCategories.logic;
      let custBreak : boolean = custCategories.break;
      
      if ( custCategories.type === 'tileCategory' ) {

      } else if ( (custCategories.type === 'semiColon1' && custCatLogi.length > 0 ) ||
                 ( custCategories.type === 'semiColon2' && custCatLogi.length > 0 ) ) {
        category = [];

        custCatLogi.map( custCat => {

          //These regex expressions work
          //let c = "E"
          //data2 = new RegExp( "\\b" + c + "\\b", 'i');
          //let data3 = new RegExp( "\\bl\\b", 'i');
          //let replaceMe2 = cat.replace(data3,'X')

          let att = 'i';
          let match = false;

          var regex = new RegExp("\\b" + custCat + "\\b", att);
          if (  custSearchTitle && title.search(regex) > -1 ) {
            match = true;
          } else if (  custSearchDesc && description.search(regex) > -1 ) {
            match = true;
          } else if (  custSearchHref && href.search(regex) > -1 ) {
            match = true;
          } else if (  custSearchCate && categoryCopy.search(regex) > -1 ) {
            match = true;
          } else if (  custSearchModBy && modifiedByTitle.search(regex) > -1 ) {
            match = true;
          } else if (  custSearchCreateBy && createdByTitle.search(regex) > -1 ) {
            match = true;
          }

          let useBreak = custBreak === true || custCat.break === true ? true : false;
          if ( useBreak === true && category.length > 0 ) { match = false; }

          let check4Tab = removeLeadingUnderScore(custCat);
          if ( match === true ) { category.push( check4Tab ) ; }

        });

        if ( category.length === 0 ) { category.push ( pivotProps.otherTab ) ; }

      } else if ( custCategories.type === 'custom' && custCatLogi.length > 0 ) {
        /**
             * export interface ICustomLogic {

              category: string;
              regex?: string;
              att?: string; // regex attributes "g", "i", "m" - default if nothing here is "i"
              eval?: string; // Used in place of regex

            }
        */
          
       category = [];

        //Testing:
        //[   {     "category": "<20",     "eval": "item.modifiedTime.cats.age[0] <= 20"   },   {     "category": "<40",     "eval": "item.modifiedTime.cats.age[0] <= 40"   } ]
          custCatLogi.map( (custCat ) => {
            let match = false;

            if ( custCat.eval && custCat.eval.length > 0 ) {
              let eText = eval( custCat.eval ) ;
              if ( eText === true ) { match = true; }

            } else if ( custCat.regex && custCat.regex.length > 0 ) { 

              let att = custCat.att === undefined || custCat.att === null ? 'i' : custCat.att;
              var regex = new RegExp(custCat.regex, att);
              if (  custSearchTitle && title.search(regex) > -1 ) {
                match = true;
              } else if (  custSearchDesc && description.search(regex) > -1 ) {
                match = true;
              } else if (  custSearchHref && href.search(regex) > -1 ) {
                match = true;
              } else if (  custSearchCate && categoryCopy.search(regex) > -1 ) {
                match = true;
              } else if (  custSearchModBy && modifiedByTitle.search(regex) > -1 ) {
                match = true;
              } else if (  custSearchCreateBy && createdByTitle.search(regex) > -1 ) {
                match = true;
              }

            }

            let useBreak = custBreak === true || custCat.break === true ? true : false;
            if ( useBreak === true && category.length > 0 ) { match = false; }

            let check4Tab = removeLeadingUnderScore(custCat.category);
            if ( match === true ) { category.push( check4Tab ) ; }

          });

          if ( category.length === 0 ) { category.push ( pivotProps.otherTab ) ; }

      } else {

      }

      if ( pivotProps.otherTab && pivotProps.otherTab.length > 0 && category.length > 0 && category[0] == pivotProps.otherTab ) { 
        showOtherTab = true ;
      }

       return {
        imageUrl: getColumnValue(pivotProps,item,'colImageLink'),

        title: title,

        description: description,

        href: href,

        category: category,

        setTab: pivotProps.setTab,
        setSize: pivotProps.setSize,
        heroType: pivotProps.heroType,
        heroCategory: currentHero,

        Id: item.Id,

        //ifNotExistsReturnNull
        options: ifNotExistsReturnNull( item[pivotProps.colTileStyle] ),

        color: ifNotExistsReturnNull( item[pivotProps.colColor] ),

        imgSize: ifNotExistsReturnNull( item[pivotProps.colSize] ),

        listWebURL: fixedURL.replace("ReplaceID",item.Id),
        listTitle: pivotProps.listTitle,

        target:  ifNotExistsReturnNull( item[pivotProps.colOpenBehaviour] ),
        
        setRatio: pivotProps.setRatio,
        setImgFit: pivotProps.setImgFit,
        setImgCover: pivotProps.setImgCover,
        onHoverZoom: pivotProps.onHoverZoom,

        modified: item.modified,
        modifiedBy: item.modifiedBy,
        createdBy: item.createdBy,
        modifiedByID: getColumnValue(pivotProps,item,'colModifiedById'),
        modifiedByTitle: modifiedByTitle,
        created: item.created,
        createdByID: getColumnValue(pivotProps,item,'colCreatedById'),
        createdByTitle: createdByTitle,
        modifiedTime: item.modifiedTime,
        createdTime: item.createdTime,

        createdSimpleDate: item.createdSimpleDate,
        createdSimpleTime: item.createdSimpleTime,
        createdSimpleDateTime: item.createdSimpleDateTime,
        createdInitials: item.createdInitials,
        createdNote: item.createdNote,
  
        
        modifiedSimpleDate: item.modifiedSimpleDate,
        modifiedSimpleTime: item.modifiedSimpleTime,
        modifiedSimpleDateTime: item.modifiedSimpleDateTime,
        modifiedInitials: item.modifiedInitials,
        modifiedNote: item.modifiedNote,

      };

    });


    /***
     *    d8888b. d88888b d888888b db    db d8888b. d8b   db      d888888b d888888b db      d88888b  .o88b.  .d88b.  db      db      d88888b  .o88b. d888888b d888888b  .d88b.  d8b   db 
     *    88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88      `~~88~~'   `88'   88      88'     d8P  Y8 .8P  Y8. 88      88      88'     d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 
     *    88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88         88       88    88      88ooooo 8P      88    88 88      88      88ooooo 8P         88       88    88    88 88V8o 88 
     *    88`8b   88~~~~~    88    88    88 88`8b   88 V8o88         88       88    88      88~~~~~ 8b      88    88 88      88      88~~~~~ 8b         88       88    88    88 88 V8o88 
     *    88 `88. 88.        88    88b  d88 88 `88. 88  V888         88      .88.   88booo. 88.     Y8b  d8 `8b  d8' 88booo. 88booo. 88.     Y8b  d8    88      .88.   `8b  d8' 88  V888 
     *    88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P         YP    Y888888P Y88888P Y88888P  `Y88P'  `Y88P'  Y88888P Y88888P Y88888P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P 
     *                                                                                                                                                                                   
     *                                                                                                                                                                                   
     */

    return {
      tileCollection: tileCollection,
      custCategories: custCategories,
      createdInfo: createdInfo,
      modifiedInfo: modifiedInfo,
      categoryInfo: categoryInfo,
      createdByInfo: createdByInfo,
      modifiedByInfo: modifiedByInfo,

      modifiedByTitles: modifiedByTitles.sort(),
      modifiedByIDs: modifiedByIDs.sort(),
      createdByTitles: createdByTitles.sort(),
      createdByIDs: createdByIDs.sort(),
      showOtherTab: showOtherTab,

    };

  }  // END public static buildTileCollectionFromResponse(response, pivotProps, fixedURL, currentHero){
    

  function isSameTimeBucket( timeCat : IDateInfo, theTime : ITheTime, compare: 'year' | 'date' | 'week' | 'month' | 'q') {
    //"item." + field + "Time.cats.wk[0] + item." + field + "Time.cats.year[0] === startTime.week + startTime.year"

    let isSameYear = timeCat.cats.yr[0] === theTime.year ? true : false ;
    if ( compare === 'year' ) { return isSameYear ; }

    let isSameQ = getQuarter(timeCat.cats.time[0]) === getQuarter(theTime.now) ? true : false ;
    if ( compare === 'q' ) { return isSameYear && isSameQ ? true : false ; }

    //timeCat.cats.mo[0] is 1 index ; theTime.month is zero index
    let isSameMo = timeCat.cats.mo[0] === theTime.month + 1 ? true : false ;
    if ( compare === 'month' ) { return isSameYear && isSameMo ? true : false ; }

    let isSameWk = ISO8601_week_no(timeCat.cats.time[0]) === ISO8601_week_no(theTime.now);
    if ( compare === 'week' ) { return isSameYear && isSameWk ? true : false ; }

    let isSameDate = timeCat.cats.date[0] === theTime.date ? true : false ;
    if ( compare === 'date' ) { return isSameYear && isSameMo && isSameDate ? true : false ; }

    console.log('Check BuildTileCollection.ts isSameTimeBucket Function!', compare, timeCat, theTime );
    return false;
 
  }






      /***
       *                                                                                                                                                       
       *    C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D  
       *                                                                                                                                                       
       *    C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D  
       *                                                                                                                                                       
       *                                                                                                                                                       
       *                                                                                                                                                       
       *                                                                                                                                                       
       */


      /***
       *    .d8888. db    db d8888b. d8888b.  .d88b.  d8888b. d888888b d888888b d8b   db  d888b       d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
       *    88'  YP 88    88 88  `8D 88  `8D .8P  Y8. 88  `8D `~~88~~'   `88'   888o  88 88' Y8b      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
       *    `8bo.   88    88 88oodD' 88oodD' 88    88 88oobY'    88       88    88V8o 88 88           88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
       *      `Y8b. 88    88 88~~~   88~~~   88    88 88`8b      88       88    88 V8o88 88  ooo      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
       *    db   8D 88b  d88 88      88      `8b  d8' 88 `88.    88      .88.   88  V888 88. ~8~      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
       *    `8888Y' ~Y8888P' 88      88       `Y88P'  88   YD    YP    Y888888P VP   V8P  Y888P       YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
       *                                                                                                                                                                            
       *                                                                                                                                                                            
       */


      /***
       *                                                                                                                                                       
       *    C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D  
       *                                                                                                                                                       
       *    C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D C8888D 
       *                                                                                                                                                       
       *                                                                                                                                                       
       *                                                                                                                                                       
       *                                                                                                                                                       
       */










      /***
       *    d888888b d88888b      db      d88888b db    db d888888b .d8888. d888888b .d8888.      d8888b. d88888b d888888b db    db d8888b. d8b   db      .o. .o. .o. .o.      d8b   db db    db db      db      
       *      `88'   88'          88      88'     `8b  d8'   `88'   88'  YP `~~88~~' 88'  YP      88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88      `8' `8' `8' `8'      888o  88 88    88 88      88      
       *       88    88ooo        YP      88ooooo  `8bd8'     88    `8bo.      88    `8bo.        88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88                           88V8o 88 88    88 88      88      
       *       88    88~~~                88~~~~~  .dPYb.     88      `Y8b.    88      `Y8b.      88`8b   88~~~~~    88    88    88 88`8b   88 V8o88                           88 V8o88 88    88 88      88      
       *      .88.   88           db      88.     .8P  Y8.   .88.   db   8D    88    db   8D      88 `88. 88.        88    88b  d88 88 `88. 88  V888                           88  V888 88b  d88 88booo. 88booo. 
       *    Y888888P YP           YP      Y88888P YP    YP Y888888P `8888Y'    YP    `8888Y'      88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P                           VP   V8P ~Y8888P' Y88888P Y88888P 
       *                                                                                                                                                                                                         
       *                                                                                                                                                                                                         
       */


      function ifNotExistsReturnNull ( obj ) {
        let result = null;

        if ( !obj ) { 
          result = "";
        } else if ( obj.length > 0) {
          result = obj;
        }

        return result;
      }

      
        /***
         *    d88888b d888888b d8b   db d8888b.      d8888b. d88888b .d8888. d888888b      d8888b.  .d8b.  d888888b d88888b       .o88b.  .d8b.  d888888b d88888b  d888b   .d88b.  d8888b. db    db 
         *    88'       `88'   888o  88 88  `8D      88  `8D 88'     88'  YP `~~88~~'      88  `8D d8' `8b `~~88~~' 88'          d8P  Y8 d8' `8b `~~88~~' 88'     88' Y8b .8P  Y8. 88  `8D `8b  d8' 
         *    88ooo      88    88V8o 88 88   88      88oooY' 88ooooo `8bo.      88         88   88 88ooo88    88    88ooooo      8P      88ooo88    88    88ooooo 88      88    88 88oobY'  `8bd8'  
         *    88~~~      88    88 V8o88 88   88      88~~~b. 88~~~~~   `Y8b.    88         88   88 88~~~88    88    88~~~~~      8b      88~~~88    88    88~~~~~ 88  ooo 88    88 88`8b      88    
         *    88        .88.   88  V888 88  .8D      88   8D 88.     db   8D    88         88  .8D 88   88    88    88.          Y8b  d8 88   88    88    88.     88. ~8~ `8b  d8' 88 `88.    88    
         *    YP      Y888888P VP   V8P Y8888D'      Y8888P' Y88888P `8888Y'    YP         Y8888D' YP   YP    YP    Y88888P       `Y88P' YP   YP    YP    Y88888P  Y888P   `Y88P'  88   YD    YP    
         *                                                                                                                                                                                          
         *                                                                                                                                                                                          
         */
    
    
        function findBestDateCategory(cats: IDateCategoryArrays, maxPivotChars : number) {
          //const allKeys = Object.keys(newCats);
    
          let allDatesOnSameDay = (cats.locDate.length === 1 ) ? true : false;
          let allDatesInSameMonth = (cats.yrMo.length === 1 ) ? true : false;
          let allDatesInSameYear = (cats.yr.length === 1 ) ? true : false;    
          let allLocDatesFitOnPivot = (cats.locDate.join('     ').length < maxPivotChars) ? true : false;
          let allDatesFitOnPivot = (cats.date.join('     ').length < maxPivotChars) ? true : false;
          let allMonthsFitOnPivot = (cats.yrMo.join('     ').length < maxPivotChars) ? true : false;
          let allTimesFitOnPivot = (cats.locTime.join('     ').length < maxPivotChars) ? true : false;
          let allMoDatesFitOnPivot = (cats.moDay.join('     ').length < maxPivotChars) ? true : false;      
          let allHoursFitOnPivot = (cats.hr.join('     ').length < maxPivotChars) ? true : false;
    
          if ( allDatesOnSameDay && allTimesFitOnPivot ) { return 'locTime' ; }
          if ( allDatesOnSameDay && allHoursFitOnPivot ) { return 'hr' ; }
          if ( allLocDatesFitOnPivot ) { return 'locDate' ; }
          if ( allMoDatesFitOnPivot && allDatesInSameYear ) { return 'moDay' ; }
    
          if ( allDatesInSameMonth && allDatesFitOnPivot ) { return 'date' ; }
    
          if ( allMonthsFitOnPivot && allDatesInSameYear ) { return 'mo' ; }
          if ( allMonthsFitOnPivot ) { return 'yrMo' ; }
    
          return 'yr';
    
        }
    
        /***
         *    d88888b d888888b d8b   db d8888b.      d8888b. d88888b .d8888. d888888b      d8888b. d88888b d8888b. .d8888.  .d88b.  d8b   db       .o88b.  .d8b.  d888888b d88888b  d888b   .d88b.  d8888b. db    db 
         *    88'       `88'   888o  88 88  `8D      88  `8D 88'     88'  YP `~~88~~'      88  `8D 88'     88  `8D 88'  YP .8P  Y8. 888o  88      d8P  Y8 d8' `8b `~~88~~' 88'     88' Y8b .8P  Y8. 88  `8D `8b  d8' 
         *    88ooo      88    88V8o 88 88   88      88oooY' 88ooooo `8bo.      88         88oodD' 88ooooo 88oobY' `8bo.   88    88 88V8o 88      8P      88ooo88    88    88ooooo 88      88    88 88oobY'  `8bd8'  
         *    88~~~      88    88 V8o88 88   88      88~~~b. 88~~~~~   `Y8b.    88         88~~~   88~~~~~ 88`8b     `Y8b. 88    88 88 V8o88      8b      88~~~88    88    88~~~~~ 88  ooo 88    88 88`8b      88    
         *    88        .88.   88  V888 88  .8D      88   8D 88.     db   8D    88         88      88.     88 `88. db   8D `8b  d8' 88  V888      Y8b  d8 88   88    88    88.     88. ~8~ `8b  d8' 88 `88.    88    
         *    YP      Y888888P VP   V8P Y8888D'      Y8888P' Y88888P `8888Y'    YP         88      Y88888P 88   YD `8888Y'  `Y88P'  VP   V8P       `Y88P' YP   YP    YP    Y88888P  Y888P   `Y88P'  88   YD    YP    
         *                                                                                                                                                                                                           
         *                                                                                                                                                                                                           
         */
    
        function findBestPersonCategory(cats: IPersonCategoryArrays, maxPivotChars : number) {
          //const allKeys = Object.keys(newCats);
    
          let allFullNamesFitOnPivot = (cats.fullName.join('     ').length < maxPivotChars) ? true : false;      
          let allFirstNamesFitOnPivot = (cats.firstName.join('     ').length < maxPivotChars) ? true : false;
          let allLastNamesFitOnPivot = (cats.lastName.join('     ').length < maxPivotChars) ? true : false;
          let allInitialsFitOnPivot = (cats.initials.join('     ').length < maxPivotChars) ? true : false;
          let allIDsFitOnPivot = (cats.IDs.join('     ').length < maxPivotChars) ? true : false;
    
          if ( allFullNamesFitOnPivot ) { return 'fullName' ; }
          if ( allLastNamesFitOnPivot ) { return 'lastName' ; }
          if ( allInitialsFitOnPivot ) { return 'initials' ; }
    
    
          return 'initials';
          //These are not used but could be if needed.
    
          if ( allFirstNamesFitOnPivot ) { return 'firstName' ; }
          if ( allIDsFitOnPivot ) { return 'IDs' ; }
    
        }
      
        
        /***
         *     .d8b.  d8888b. d8888b.      d8888b. d88888b d8888b. .d8888.  .d88b.  d8b   db      db    db  .d8b.  d8888b. d888888b  .d8b.  d888888b d888888b  .d88b.  d8b   db .d8888. 
         *    d8' `8b 88  `8D 88  `8D      88  `8D 88'     88  `8D 88'  YP .8P  Y8. 888o  88      88    88 d8' `8b 88  `8D   `88'   d8' `8b `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
         *    88ooo88 88   88 88   88      88oodD' 88ooooo 88oobY' `8bo.   88    88 88V8o 88      Y8    8P 88ooo88 88oobY'    88    88ooo88    88       88    88    88 88V8o 88 `8bo.   
         *    88~~~88 88   88 88   88      88~~~   88~~~~~ 88`8b     `Y8b. 88    88 88 V8o88      `8b  d8' 88~~~88 88`8b      88    88~~~88    88       88    88    88 88 V8o88   `Y8b. 
         *    88   88 88  .8D 88  .8D      88      88.     88 `88. db   8D `8b  d8' 88  V888       `8bd8'  88   88 88 `88.   .88.   88   88    88      .88.   `8b  d8' 88  V888 db   8D 
         *    YP   YP Y8888D' Y8888D'      88      Y88888P 88   YD `8888Y'  `Y88P'  VP   V8P         YP    YP   YP 88   YD Y888888P YP   YP    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
         *                                                                                                                                                                              
         *                                                                                                                                                                              
         */
    
        function addPersonVariations(item,col){
    
          let actualCol = col === 'modifiedBy' ? 'modifiedBy' : col === 'createdBy' ? 'createdBy' : '';
          let newItem = item;
    
          let tilePerson = createIPersonCategoryArrays(col);
          /*
          item.modified = (getColumnValue(pivotProps,item,'colModified'));
          item.modifiedByID = (getColumnValue(pivotProps,item,'colModifiedById'));
          item.modifiedByTitle = (getColumnValue(pivotProps,item,'colModifiedByTitle'));
          */
          tilePerson.cats.fullName[0] = item[actualCol + 'Title'];
          tilePerson.cats.initials[0] = tilePerson.cats.fullName[0].split(" ").map((n)=>n[0]).join("");
          tilePerson.cats.IDs[0] = item[actualCol + 'ID'];      
    
          newItem[col] = tilePerson; 
    
          return newItem;
    
        }
    
    
        /***
         *    db       .d88b.   .o88b.  .d8b.  db      d888888b d88888D d88888b      d8888b.  .d8b.  d888888b d88888b      db    db  .d8b.  d8888b. d888888b  .d8b.  d888888b d888888b  .d88b.  d8b   db .d8888. 
         *    88      .8P  Y8. d8P  Y8 d8' `8b 88        `88'   YP  d8' 88'          88  `8D d8' `8b `~~88~~' 88'          88    88 d8' `8b 88  `8D   `88'   d8' `8b `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
         *    88      88    88 8P      88ooo88 88         88       d8'  88ooooo      88   88 88ooo88    88    88ooooo      Y8    8P 88ooo88 88oobY'    88    88ooo88    88       88    88    88 88V8o 88 `8bo.   
         *    88      88    88 8b      88~~~88 88         88      d8'   88~~~~~      88   88 88~~~88    88    88~~~~~      `8b  d8' 88~~~88 88`8b      88    88~~~88    88       88    88    88 88 V8o88   `Y8b. 
         *    88booo. `8b  d8' Y8b  d8 88   88 88booo.   .88.    d8' db 88.          88  .8D 88   88    88    88.           `8bd8'  88   88 88 `88.   .88.   88   88    88      .88.   `8b  d8' 88  V888 db   8D 
         *    Y88888P  `Y88P'   `Y88P' YP   YP Y88888P Y888888P d88888P Y88888P      Y8888D' YP   YP    YP    Y88888P         YP    YP   YP 88   YD Y888888P YP   YP    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
         *                                                                                                                                                                                                       
         *                                                                                                                                                                                                       
         */
    
        function localizeDateVariations(item, col){
          let newItem = item;
          let thisCol = col + 'Time';
      
          return newItem;
        }
    
    /***
     *    d8888b. db    db .d8888. db   db      d8888b.  .d8b.  d888888b .d8888.      d888888b  .d88b.        .o88b.  .d8b.  d888888b .d8888. 
     *    88  `8D 88    88 88'  YP 88   88      88  `8D d8' `8b `~~88~~' 88'  YP      `~~88~~' .8P  Y8.      d8P  Y8 d8' `8b `~~88~~' 88'  YP 
     *    88oodD' 88    88 `8bo.   88ooo88      88   88 88ooo88    88    `8bo.           88    88    88      8P      88ooo88    88    `8bo.   
     *    88~~~   88    88   `Y8b. 88~~~88      88   88 88~~~88    88      `Y8b.         88    88    88      8b      88~~~88    88      `Y8b. 
     *    88      88b  d88 db   8D 88   88      88  .8D 88   88    88    db   8D         88    `8b  d8'      Y8b  d8 88   88    88    db   8D 
     *    88      ~Y8888P' `8888Y' YP   YP      Y8888D' YP   YP    YP    `8888Y'         YP     `Y88P'        `Y88P' YP   YP    YP    `8888Y' 
     *                                                                                                                                        
     *                                                                                                                                        
     */
    
        function pushDatesToCategories(cats: IDateCategoryArrays, thisTime:IDateCategoryArrays ){
          //This updates the possible new categories for this date column
          let newCats = cats;
          const allKeys = Object.keys(newCats);
    
          //console.log('cats',cats);
          //console.log('allKeys',allKeys);
          for (let key of allKeys){
            if(newCats[key].indexOf(thisTime['cats'][key][0]) === -1) { newCats[key].push(thisTime['cats'][key][0]); }
          }
          return newCats;
    
        }
    /***
     *    .d8888.  .d88b.  d8888b. d888888b       .d8b.  db      db           d8888b.  .d8b.  d888888b d88888b       .o88b.  .d8b.  d888888b .d8888. 
     *    88'  YP .8P  Y8. 88  `8D `~~88~~'      d8' `8b 88      88           88  `8D d8' `8b `~~88~~' 88'          d8P  Y8 d8' `8b `~~88~~' 88'  YP 
     *    `8bo.   88    88 88oobY'    88         88ooo88 88      88           88   88 88ooo88    88    88ooooo      8P      88ooo88    88    `8bo.   
     *      `Y8b. 88    88 88`8b      88         88~~~88 88      88           88   88 88~~~88    88    88~~~~~      8b      88~~~88    88      `Y8b. 
     *    db   8D `8b  d8' 88 `88.    88         88   88 88booo. 88booo.      88  .8D 88   88    88    88.          Y8b  d8 88   88    88    db   8D 
     *    `8888Y'  `Y88P'  88   YD    YP         YP   YP Y88888P Y88888P      Y8888D' YP   YP    YP    Y88888P       `Y88P' YP   YP    YP    `8888Y' 
     *                                                                                                                                               
     *                                                                                                                                               
     */
    
        function sortAllDateCategories(cats: IDateCategoryArrays ){
          //This updates the possible new categories for this date column
          let newCats = cats;
          const allKeys = Object.keys(newCats);
    
          //console.log('cats',cats);
          //console.log('allKeys',allKeys);
          for (let key of allKeys){
            if(newCats[key]) { newCats[key].sort(); }
          }
          return newCats;
    
        }
    
        /***
         *    d8888b. db    db .d8888. db   db      d8888b. d88888b d8888b. .d8888.      d888888b  .d88b.        .o88b.  .d8b.  d888888b 
         *    88  `8D 88    88 88'  YP 88   88      88  `8D 88'     88  `8D 88'  YP      `~~88~~' .8P  Y8.      d8P  Y8 d8' `8b `~~88~~' 
         *    88oodD' 88    88 `8bo.   88ooo88      88oodD' 88ooooo 88oobY' `8bo.           88    88    88      8P      88ooo88    88    
         *    88~~~   88    88   `Y8b. 88~~~88      88~~~   88~~~~~ 88`8b     `Y8b.         88    88    88      8b      88~~~88    88    
         *    88      88b  d88 db   8D 88   88      88      88.     88 `88. db   8D         88    `8b  d8'      Y8b  d8 88   88    88    
         *    88      ~Y8888P' `8888Y' YP   YP      88      Y88888P 88   YD `8888Y'         YP     `Y88P'        `Y88P' YP   YP    YP    
         *                                                                                                                               
         *                                                                                                                               
         */
    
        function pushPersonsToCategories(cats: IPersonCategoryArrays, thisPerson:IPersonCategoryArrays ){
          //This updates the possible new categories for this date column
          let newCats = cats;
          const allKeys = Object.keys(newCats);
    
          //console.log('cats',cats);
          //console.log('allKeys',allKeys);
          for (let key of allKeys){
            if(newCats[key].indexOf(thisPerson['cats'][key][0]) === -1) { newCats[key].push(thisPerson['cats'][key][0]); }
          }
          return newCats;
    
        }
    
        /***
         *    .d8888.  .d88b.  d8888b. d888888b       .d8b.  db      db           d8888b. d88888b d8888b. .d8888.       .o88b.  .d8b.  d888888b d88888b  d888b   .d88b.  d8888b. d888888b d88888b .d8888. 
         *    88'  YP .8P  Y8. 88  `8D `~~88~~'      d8' `8b 88      88           88  `8D 88'     88  `8D 88'  YP      d8P  Y8 d8' `8b `~~88~~' 88'     88' Y8b .8P  Y8. 88  `8D   `88'   88'     88'  YP 
         *    `8bo.   88    88 88oobY'    88         88ooo88 88      88           88oodD' 88ooooo 88oobY' `8bo.        8P      88ooo88    88    88ooooo 88      88    88 88oobY'    88    88ooooo `8bo.   
         *      `Y8b. 88    88 88`8b      88         88~~~88 88      88           88~~~   88~~~~~ 88`8b     `Y8b.      8b      88~~~88    88    88~~~~~ 88  ooo 88    88 88`8b      88    88~~~~~   `Y8b. 
         *    db   8D `8b  d8' 88 `88.    88         88   88 88booo. 88booo.      88      88.     88 `88. db   8D      Y8b  d8 88   88    88    88.     88. ~8~ `8b  d8' 88 `88.   .88.   88.     db   8D 
         *    `8888Y'  `Y88P'  88   YD    YP         YP   YP Y88888P Y88888P      88      Y88888P 88   YD `8888Y'       `Y88P' YP   YP    YP    Y88888P  Y888P   `Y88P'  88   YD Y888888P Y88888P `8888Y' 
         *                                                                                                                                                                                                
         *                                                                                                                                                                                                
         */
    
        function sortAllPersonCategories(cats: IPersonCategoryArrays ){
          //This updates the possible new categories for this date column
          let newCats = cats;
          const allKeys = Object.keys(newCats);
    
          //console.log('cats',cats);
          //console.log('allKeys',allKeys);
          for (let key of allKeys){
            if(newCats[key]) { newCats[key].sort(); }
          }
          return newCats;
    
        }
    
    
        /***
         *    .d8888. d88888b d888888b      db       .d8b.  .d8888. d888888b       .o88b.  .d8b.  d888888b      d8888b. d88888b d8888b. d888888b  .d88b.  d8888b. 
         *    88'  YP 88'     `~~88~~'      88      d8' `8b 88'  YP `~~88~~'      d8P  Y8 d8' `8b `~~88~~'      88  `8D 88'     88  `8D   `88'   .8P  Y8. 88  `8D 
         *    `8bo.   88ooooo    88         88      88ooo88 `8bo.      88         8P      88ooo88    88         88oodD' 88ooooo 88oobY'    88    88    88 88   88 
         *      `Y8b. 88~~~~~    88         88      88~~~88   `Y8b.    88         8b      88~~~88    88         88~~~   88~~~~~ 88`8b      88    88    88 88   88 
         *    db   8D 88.        88         88booo. 88   88 db   8D    88         Y8b  d8 88   88    88         88      88.     88 `88.   .88.   `8b  d8' 88  .8D 
         *    `8888Y' Y88888P    YP         Y88888P YP   YP `8888Y'    YP          `Y88P' YP   YP    YP         88      Y88888P 88   YD Y888888P  `Y88P'  Y8888D' 
         *                                                                                                                                                        
         *                                                                                                                                                        
         */
    
        function setLastCategoryPer(dateInfo: IDateInfo){
          //This sets state.lastCategory as the first category in each one.
          let newDateInfo = dateInfo;
          let  bestFormat = newDateInfo.bestFormat;
          //Set last Category as the first tab in the best format.

          if (newDateInfo.cats[bestFormat]) { newDateInfo.lastCategory = newDateInfo.cats[bestFormat][0]; }
    
          return newDateInfo;
    
        }
    
    
        /***
         *    .d8888. d88888b d888888b      db       .d8b.  .d8888. d888888b       .o88b.  .d8b.  d888888b      d8888b. d88888b d8888b. .d8888.  .d88b.  d8b   db 
         *    88'  YP 88'     `~~88~~'      88      d8' `8b 88'  YP `~~88~~'      d8P  Y8 d8' `8b `~~88~~'      88  `8D 88'     88  `8D 88'  YP .8P  Y8. 888o  88 
         *    `8bo.   88ooooo    88         88      88ooo88 `8bo.      88         8P      88ooo88    88         88oodD' 88ooooo 88oobY' `8bo.   88    88 88V8o 88 
         *      `Y8b. 88~~~~~    88         88      88~~~88   `Y8b.    88         8b      88~~~88    88         88~~~   88~~~~~ 88`8b     `Y8b. 88    88 88 V8o88 
         *    db   8D 88.        88         88booo. 88   88 db   8D    88         Y8b  d8 88   88    88         88      88.     88 `88. db   8D `8b  d8' 88  V888 
         *    `8888Y' Y88888P    YP         Y88888P YP   YP `8888Y'    YP          `Y88P' YP   YP    YP         88      Y88888P 88   YD `8888Y'  `Y88P'  VP   V8P 
         *                                                                                                                                                        
         *                                                                                                                                                        
         */
        function setLastCategoryPerson(personInfo: IPersonInfo){
          //This sets state.lastCategory as the first category in each one.
          let nePersonInfo = personInfo;
          let  bestFormat = nePersonInfo.bestFormat;

          //Set last Category as the first tab in the best format.

          if (nePersonInfo.cats[bestFormat]) { nePersonInfo.lastCategory = nePersonInfo.cats[bestFormat][0]; }
    
          return nePersonInfo;
    
        }

              
        /**
         * This just gets all the possible date labels so we can determine best one for pivots
         * @param item 
         * @param col 
         */
    
         /***
         *     .d8b.  d8888b. d8888b.      d8888b.  .d8b.  d888888b d88888b      db    db  .d8b.  d8888b. d888888b  .d8b.  d888888b d888888b  .d88b.  d8b   db .d8888. 
         *    d8' `8b 88  `8D 88  `8D      88  `8D d8' `8b `~~88~~' 88'          88    88 d8' `8b 88  `8D   `88'   d8' `8b `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
         *    88ooo88 88   88 88   88      88   88 88ooo88    88    88ooooo      Y8    8P 88ooo88 88oobY'    88    88ooo88    88       88    88    88 88V8o 88 `8bo.   
         *    88~~~88 88   88 88   88      88   88 88~~~88    88    88~~~~~      `8b  d8' 88~~~88 88`8b      88    88~~~88    88       88    88    88 88 V8o88   `Y8b. 
         *    88   88 88  .8D 88  .8D      88  .8D 88   88    88    88.           `8bd8'  88   88 88 `88.   .88.   88   88    88      .88.   `8b  d8' 88  V888 db   8D 
         *    YP   YP Y8888D' Y8888D'      Y8888D' YP   YP    YP    Y88888P         YP    YP   YP 88   YD Y888888P YP   YP    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
         *                                                                                                                                                             
         *                                                                                                                                                             
         */
    
        function addDateVariations(item,col, startTime ){
          let newItem = item;
    
          let tileTimeDV = createIDateCategoryArrays(col);
          let thisTime = new Date(item[col]);

          let timeObject = makeSmallTimeObject(thisTime.toString());
    
          tileTimeDV.cats.time[0] = thisTime;
          tileTimeDV.cats.yr[0] = thisTime.getFullYear();
          tileTimeDV.cats.mo[0] = thisTime.getMonth() + 1;
          tileTimeDV.cats.date[0] = thisTime.getDate();
          tileTimeDV.cats.day[0] = thisTime.getDay() + 1;
          tileTimeDV.cats.hr[0] = thisTime.getHours();
          tileTimeDV.cats.wk[0] = timeObject.week;
          tileTimeDV.cats.locDate[0] = thisTime.toLocaleDateString();
          tileTimeDV.cats.locTime[0] = thisTime.toLocaleTimeString();
          tileTimeDV.cats.age[0] = ( startTime.now.valueOf() - thisTime.valueOf()) / ( one_day ) ;
          tileTimeDV.cats.dayYYYYMMDD[0] = timeObject.dayYYYYMMDD;
          let monthPrefix = (tileTimeDV.cats.mo[0] < 10 ? '0' : '');
          let datePrefix = (tileTimeDV.cats.date[0] < 10 ? '0' : '');
          tileTimeDV.cats.yrMo[0] = tileTimeDV.cats.yr + '-' + monthPrefix + tileTimeDV.cats.mo;
          tileTimeDV.cats.moDay[0] = monthPrefix + tileTimeDV.cats.mo + '-' +  datePrefix + tileTimeDV.cats.date;
          
          newItem[col + 'Time'] = tileTimeDV; 
    
          return newItem;
    
        }
      
/***
 *    d888888b d8b   db d888888b d88888b d8888b. d88888b  .d8b.   .o88b. d88888b .d8888. 
 *      `88'   888o  88 `~~88~~' 88'     88  `8D 88'     d8' `8b d8P  Y8 88'     88'  YP 
 *       88    88V8o 88    88    88ooooo 88oobY' 88ooo   88ooo88 8P      88ooooo `8bo.   
 *       88    88 V8o88    88    88~~~~~ 88`8b   88~~~   88~~~88 8b      88~~~~~   `Y8b. 
 *      .88.   88  V888    88    88.     88 `88. 88      88   88 Y8b  d8 88.     db   8D 
 *    Y888888P VP   V8P    YP    Y88888P 88   YD YP      YP   YP  `Y88P' Y88888P `8888Y' 
 *                                                                                       
 *                                                                                       
 */



export interface IDateCategoryArrays {
    yr: number[];
    mo: number[];
    day: number[];
    date: number[];
    hr: number[];
    wk: number[];
    dayYYYYMMDD: any[];
  
    age: number[];
  
    yrMo: string[];
    moDay: string[];
  
    locDate: string[];
    locTime: string[];
  
    time: Date[];
  
    bestFormat: string[];
  
  }
  
  export interface IDateInfo {
      range?: number;
      note?: string;
      latest?: Date;
      earliest?: Date;
      bestAgeBucket?: string;
      bestFormat?: string;
      cats : IDateCategoryArrays;
      lastCategory?: string;
      name: string;
  
  }
  
  export interface IPersonCategoryArrays {
  
    fullName: string[];
    initials: string[];
    firstName: string[];
    lastName: string[];
    bestFormat: string[];
    IDs: number[];
  
  }
  
  export interface IPersonInfo {
  
      note?: string; // Copied from IDateInfo, keeping for consistancy
  
      bestFormat?: string; // Copied from IDateInfo, keeping for consistancy
      cats : IPersonCategoryArrays; // Copied from IDateInfo, keeping for consistancy
      lastCategory?: string;  // Copied from IDateInfo, keeping for consistancy
      name: string;  // Copied from IDateInfo, not sure if it is needed
  
  }
  
  type IInfo = IDateInfo | IPersonInfo;
  
  
  
  
    /***
     *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b. d88888b d8888b. .d8888.  .d88b.  d8b   db       .o88b.  .d8b.  d888888b       .d8b.  d8888b. d8888b.  .d8b.  db    db .d8888. 
     *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D 88'     88  `8D 88'  YP .8P  Y8. 888o  88      d8P  Y8 d8' `8b `~~88~~'      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 88'  YP 
     *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88oodD' 88ooooo 88oobY' `8bo.   88    88 88V8o 88      8P      88ooo88    88         88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  `8bo.   
     *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88~~~   88~~~~~ 88`8b     `Y8b. 88    88 88 V8o88      8b      88~~~88    88         88~~~88 88`8b   88`8b   88~~~88    88      `Y8b. 
     *    Y8b  d8 88 `88. 88.     88   88    88    88.          88      88.     88 `88. db   8D `8b  d8' 88  V888      Y8b  d8 88   88    88         88   88 88 `88. 88 `88. 88   88    88    db   8D 
     *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      88      Y88888P 88   YD `8888Y'  `Y88P'  VP   V8P       `Y88P' YP   YP    YP         YP   YP 88   YD 88   YD YP   YP    YP    `8888Y' 
     *                                                                                                                                                                                                
     *                                                                                                                                                                                                
     */
  
  
    export function createIPersonCategoryArrays(col) {
      let result = {} as IPersonInfo;
      let cats = {} as IPersonCategoryArrays;
  
      cats.fullName = [];
      cats.initials = [];
      cats.IDs = [];
      cats.firstName = [];
      cats.lastName = [];
      cats.bestFormat = [];
  
      result = {
        note: null,
        bestFormat: null,
        cats: cats,
        lastCategory: null,
        name: col,
  
      };
      
      return result;
  
  
    }
  
  /***
   *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b.  .d8b.  d888888b d88888b       .o88b.  .d8b.  d888888b       .d8b.  d8888b. d8888b.  .d8b.  db    db .d8888. 
   *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D d8' `8b `~~88~~' 88'          d8P  Y8 d8' `8b `~~88~~'      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 88'  YP 
   *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88   88 88ooo88    88    88ooooo      8P      88ooo88    88         88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  `8bo.   
   *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88   88 88~~~88    88    88~~~~~      8b      88~~~88    88         88~~~88 88`8b   88`8b   88~~~88    88      `Y8b. 
   *    Y8b  d8 88 `88. 88.     88   88    88    88.          88  .8D 88   88    88    88.          Y8b  d8 88   88    88         88   88 88 `88. 88 `88. 88   88    88    db   8D 
   *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      Y8888D' YP   YP    YP    Y88888P       `Y88P' YP   YP    YP         YP   YP 88   YD 88   YD YP   YP    YP    `8888Y' 
   *                                                                                                                                                                               
   *                                                                                                                                                                               
   */
  
  export function createIDateCategoryArrays(col) {
    let result = {} as IDateInfo;
    let cats = {} as IDateCategoryArrays;
    cats.yr = [];
    cats.mo = [];
    cats.day = [];  
    cats.date = [];
    cats.hr = [];
    cats.wk = [];
    cats.dayYYYYMMDD = [];
  
    cats.age = [];
  
    cats.yrMo = [];
    cats.moDay = [];
  
    cats.locDate = [];
    cats.locTime = [];
  
    cats.time = [];
  
    cats.bestFormat = [];
  
    result = {
      range: null,
      note: null,
      latest: null,
      earliest: null,
      bestAgeBucket: null,
      bestFormat: null,
      cats: cats,
      lastCategory: null,
      name: col,
  
    };
    
    return result;
  }

  
      /**
     * This gets the values of specified columns including if they are expanded.
     * @param pivotProps 
     * @param item 
     * @param getProp 
     */


     /***
     *     d888b  d88888b d888888b       .o88b.  .d88b.  db           db    db  .d8b.  db      db    db d88888b 
     *    88' Y8b 88'     `~~88~~'      d8P  Y8 .8P  Y8. 88           88    88 d8' `8b 88      88    88 88'     
     *    88      88ooooo    88         8P      88    88 88           Y8    8P 88ooo88 88      88    88 88ooooo 
     *    88  ooo 88~~~~~    88         8b      88    88 88           `8b  d8' 88~~~88 88      88    88 88~~~~~ 
     *    88. ~8~ 88.        88         Y8b  d8 `8b  d8' 88booo.       `8bd8'  88   88 88booo. 88b  d88 88.     
     *     Y888P  Y88888P    YP          `Y88P'  `Y88P'  Y88888P         YP    YP   YP Y88888P ~Y8888P' Y88888P 
     *                                                                                                          
     *                                                                                                          
     */

export function getColumnValue(pivotProps: IPivotTilesProps, item, getProp){

    if (getProp.toLowerCase() === "thumb" || getProp.toLowerCase() === "thumbnail") {
      getProp = "File/ServerRelativeUrl";
    }

    function convertValues(itemValc) {
      // Cleans up values into right syntax, no numbers and some must be arrays.
      itemValc = (getProp.indexOf('Link') > -1) ? convertLinks(pivotProps, itemValc) :itemValc;
      itemValc = (Array.isArray(itemValc)) ? itemValc.map(String) : itemValc;  //Convert number arrays (like Author/ID) to string arrays
      itemValc = (typeof(itemValc) === 'number') ? itemValc.toString() : itemValc;
      return itemValc;
    }


    let isWebPartColProp = (pivotProps[getProp]) ? true : false; 
    var itemVal :any ;


    if (!isWebPartColProp) {
      //the property is NOT a web part prop (but predefined one like Modified)
      //Therefore assume it is a Category and check if it's a date

      itemVal = item[getProp];

      let check4Date = Date.parse(itemVal);

      if (isNaN(check4Date)){
        //This is not a date, do nothing
      } else { //This is a date, convert it to a group of dates like year
        var d1 = new Date(itemVal);
        itemVal = d1.getFullYear();
      }

      return itemVal;

    } else if (pivotProps[getProp].indexOf("/") < 0 && pivotProps[getProp].indexOf(".") < 0 ) {
      //the property does not have a / so you do want to check for a date.

      if (item[pivotProps[getProp]]) {

        itemVal = item[pivotProps[getProp]];

        if (getProp === 'colCategory'){
          //Check for date value and then convert to bucket
          let check4Date = Date.parse(itemVal);
          //console.log('check4Date: ', check4Date);
          //console.log('check4Date type: ', typeof check4Date);
          //console.log('check4Date isNaN: ', isNaN(check4Date));   

          if (isNaN(check4Date)){
            //This is not a date, do nothing
          } else { //This is a date, convert it to a group of dates like year
            var d2 = new Date(itemVal);
            itemVal = d2.getFullYear();
          }

        }

        itemVal = convertValues(itemVal);
        return itemVal;
      } else { return ""; } 
    } else {
      //console.log('getColumnValue: ', getProp, pivotProps[getProp]);
      let parser = pivotProps[getProp].indexOf('/') > 0 ? '/' : '.';
      const leftSide = parseMe(pivotProps[getProp], parser,'left');
      const rightSide = parseMe(pivotProps[getProp], parser,'right');

      if (item[leftSide]) {
        itemVal = item[leftSide][rightSide];
        itemVal = convertValues(itemVal);
        return itemVal;
      } else { return ""; } 
    }
  }

