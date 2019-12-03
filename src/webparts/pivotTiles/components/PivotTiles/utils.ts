//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

import { getTheCurrentTime,} from '../../../../services/createAnalytics';
import {tileTime} from '../TileItems/IPivotTileItemProps';
import { getLocalMonths } from '../../../../services/dateServices';

export interface IDateCategoryArrays {
  yr: number[];
  mo: number[];
  day: number[];
  date: number[];
  hr: number[];

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

function createIPersonCategoryArrays(col) {
  let result = {} as IPersonInfo;
  let cats = {} as IPersonCategoryArrays;

  cats.fullName = [];
  cats.initials = [];
  cats.IDs = [];
  cats.bestFormat = [];

  result = {
    note: null,
    bestFormat: null,
    cats: cats,
    lastCategory: null,
    name: col,

  }
  
  return result;


}

function createIDateCategoryArrays(col) {
  let result = {} as IDateInfo;
  let cats = {} as IDateCategoryArrays;
  cats.yr = [];
  cats.mo = [];
  cats.day = [];  
  cats.date = [];
  cats.hr = [];

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

  }
  
  return result;


}

export default class Utils {

    
  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    //console.log('convertCategoryToIndex', cat);
    if (!cat) { return "";}

    const thisCat = cat.toString();
    if (thisCat == null) { return ""; }
    if (thisCat){
      return (thisCat.replace(" ",'_').replace(/[&]/,'And').replace(/[*]/,'aamp').replace(/[\/\\#,+()$~%.'":*?<>{}]/g,''));
    } else {
      return ("");
    }
  }

  public static fixURLs(oldURL,pageContext) {
    let newURL = oldURL;
    if (!oldURL || newURL.length === 0) {
      newURL = pageContext.web.absoluteUrl;
    }
    newURL += newURL.endsWith("/") ? "" : "/";
    return newURL;
  }

  public static buildTileCollectionFromResponse(response, pivotProps, fixedURL, currentHero){

//           let tileCollection = response.map(item=>new ClassTile(item));
//          https://stackoverflow.com/questions/47755247/typescript-array-map-return-object

    const monthCats = getLocalMonths('en-us','short');
    const one_day = 1000 * 60 * 60 * 24;
    /**
     * This gets the values of specified columns including if they are expanded.
     * @param theseProps 
     * @param item 
     * @param getProp 
     */
    function getColumnValue(theseProps, item, getProp){

      if (getProp.toLowerCase() === "thumb" || getProp.toLowerCase() === "thumbnail") {
        getProp = "File/ServerRelativeUrl";
      }

      function convertValues(itemVal) {
        // Cleans up values into right syntax, no numbers and some must be arrays.
        itemVal = (getProp.indexOf('Link') > -1) ? convertLinks(theseProps, itemVal) :itemVal;
        itemVal = (Array.isArray(itemVal)) ? itemVal.map(String) : itemVal;  //Convert number arrays (like Author/ID) to string arrays
        itemVal = (typeof(itemVal) === 'number') ? itemVal.toString() : itemVal;
        return itemVal;
      }


      let isWebPartColProp = (theseProps[getProp]) ? true : false; 
      var itemVal :any ;


      if (!isWebPartColProp) {
        //the property is NOT a web part prop (but predefined one like Modified)
        //Therefore assume it is a Category and check if it's a date

        itemVal = item[getProp];

        let check4Date = Date.parse(itemVal);

        if (isNaN(check4Date)){
          //This is not a date, do nothing
        } else { //This is a date, convert it to a group of dates like year
          var d = new Date(itemVal);
          itemVal = d.getFullYear();
        }

        return itemVal;

      } else if (theseProps[getProp].indexOf("/") < 0) {
        //the property does not have a / so you do want to check for a date.

        if (item[theseProps[getProp]]) {

          itemVal = item[theseProps[getProp]];

          if (getProp === 'colCategory'){
            //Check for date value and then convert to bucket
            let check4Date = Date.parse(itemVal);
            //console.log('check4Date: ', check4Date);
            //console.log('check4Date type: ', typeof check4Date);
            //console.log('check4Date isNaN: ', isNaN(check4Date));   

            if (isNaN(check4Date)){
              //This is not a date, do nothing
            } else { //This is a date, convert it to a group of dates like year
              var d = new Date(itemVal);
              itemVal = d.getFullYear();
            }

          }

          itemVal = convertValues(itemVal);
          return itemVal;
        } else { return ""; } 
      } else {
        //console.log('getColumnValue: ', getProp, theseProps[getProp]);
        const leftSide =  Utils.parseMe(theseProps[getProp],"/",'left');
        const rightSide = Utils.parseMe(theseProps[getProp],"/",'right');

        if (item[leftSide]) {
          itemVal = item[leftSide][rightSide];
          itemVal = convertValues(itemVal);
          return itemVal;
        } else { return ""; } 
      }
    }

    /**
     * The purpose of this function is to convert links such as relative shortcut links ../SitePages etc...
     * @param theseProps 
     * @param itemVal 
     */
    function convertLinks(theseProps, itemVal){
      let itemVal2 = itemVal;
      if (itemVal && itemVal.indexOf('../') === 0){
        itemVal2 = itemVal2.replace('../', (theseProps.pageContext.web.absoluteUrl + '/'));
      }
      return itemVal2;
    }
    
    /**
     * This just gets all the possible date labels so we can determine best one for pivots
     * @param item 
     * @param col 
     */

    function addDateVariations(item,col){
      let newItem = item;

      let tileTime = createIDateCategoryArrays(col);
      let thisTime = new Date(item[col]);

      tileTime.cats.time[0] = thisTime;
      tileTime.cats.yr[0] = thisTime.getFullYear();
      tileTime.cats.mo[0] = thisTime.getMonth() + 1;
      tileTime.cats.date[0] = thisTime.getDate();
      tileTime.cats.day[0] = thisTime.getDay() + 1;
      tileTime.cats.hr[0] = thisTime.getHours();
      tileTime.cats.locDate[0] = thisTime.toLocaleDateString();
      tileTime.cats.locTime[0] = thisTime.toLocaleTimeString();
      tileTime.cats.age[0] = (pivotProps.startTime.now.valueOf() - thisTime.valueOf()) / ( one_day ) ;
      let monthPrefix = (tileTime.cats.mo[0] < 10 ? '0' : '');
      let datePrefix = (tileTime.cats.date[0] < 10 ? '0' : '');
      tileTime.cats.yrMo[0] = tileTime.cats.yr + '-' + monthPrefix + tileTime.cats.mo;
      tileTime.cats.moDay[0] = monthPrefix + tileTime.cats.mo + '-' +  datePrefix + tileTime.cats.date;
      
      newItem[col + 'Time'] = tileTime; 

      return newItem;

    }
  
    
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

    function localizeDateVariations(item, col){
      let newItem = item;
      let thisCol = col + 'Time';
  
      return newItem;
    }

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


    function setLastCategoryPer(dateInfo: IDateInfo){
      //This sets state.lastCategory as the first category in each one.
      let newDateInfo = dateInfo;
      let  bestFormat = newDateInfo.bestFormat;
      //Set last Category as the first tab in the best format.
      console.log('setLastCategoryPer: newDateInfo',bestFormat,newDateInfo);
      //This just checks to see if there is a best format... default category may not have one.
      if (newDateInfo.cats[bestFormat]) { newDateInfo.lastCategory = newDateInfo.cats[bestFormat][0]; }

      return newDateInfo;

    }

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

    let startTime = getTheCurrentTime();

    // Get all date variations
    for (let item of response) {

      //Do all to modified
        item.modified = (getColumnValue(pivotProps,item,'colModified'));
        item.modifiedByID = (getColumnValue(pivotProps,item,'colModifiedById'));
        item.modifiedByTitle = (getColumnValue(pivotProps,item,'colModifiedByTitle'));

        item = addPersonVariations(item,'modifiedBy');

        if(modifiedByTitles.indexOf(item.modifiedByTitle) === -1) { modifiedByTitles.push(item.modifiedByTitle); }
        if(modifiedByIDs.indexOf(item.modifiedByID) === -1) { modifiedByIDs.push(item.modifiedByID); }

        item = addDateVariations(item,'modified');
        modifiedInfo.cats = pushDatesToCategories(modifiedInfo.cats, item.modifiedTime);
        item = localizeDateVariations(item,'modified');

        if ( item.modifiedTime.cats.time[0] < modifiedInfo.earliest )  { modifiedInfo.earliest = item.modifiedTime.cats.time[0]; }
        if ( item.modifiedTime.cats.time[0] > modifiedInfo.latest )  { modifiedInfo.latest = item.modifiedTime.cats.time[0]; } 
  
      //Do all to created
        item.created = (getColumnValue(pivotProps,item,'colCreated'));
        item.createdByID = (getColumnValue(pivotProps,item,'colCreatedById'));
        item.createdByTitle = (getColumnValue(pivotProps,item,'colCreatedByTitle'));

        if(createdByTitles.indexOf(item.createdByTitle) === -1) { createdByTitles.push(item.createdByTitle); }
        if(createdByIDs.indexOf(item.createdByID) === -1) { createdByIDs.push(item.createdByID); }
  
        item = addDateVariations(item,'created');
        createdInfo.cats = pushDatesToCategories(createdInfo.cats, item.createdTime);
        item = localizeDateVariations(item,'created');

        if ( item.createdTime.cats.time[0] < createdInfo.earliest )  { createdInfo.earliest = item.createdTime.cats.time[0] ; }
        if ( item.createdTime.cats.time[0] > createdInfo.latest )  { createdInfo.latest = item.createdTime.cats.time[0] ; } 

    }

    createdInfo.cats = sortAllDateCategories(createdInfo.cats);
    modifiedInfo.cats = sortAllDateCategories(modifiedInfo.cats);
    categoryInfo.cats = sortAllDateCategories(categoryInfo.cats);

    /**
     *   In this area, go back and localize date categories like we do for items above.
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

    modifiedInfo.range = (Math.round(modifiedInfo.latest.getTime() - modifiedInfo.earliest.getTime()) / (one_day));
    createdInfo.range = (Math.round(createdInfo.latest.getTime() - createdInfo.earliest.getTime()) / (one_day));

    createdInfo.bestFormat = findBestDateCategory(createdInfo.cats, pivotProps.maxPivotChars);
    modifiedInfo.bestFormat = findBestDateCategory(modifiedInfo.cats, pivotProps.maxPivotChars);
    let bestCategoryFormat = 'unknownMZ';

    //console.log('modifiedInfo.bestFormat',modifiedInfo.bestFormat);
    //console.log('createdInfo.bestFormat',createdInfo.bestFormat);
    for (let item of response) {
      item.created = item.createdTime.cats[createdInfo.bestFormat][0];
      item.createdTime.cats.bestFormat[0] = createdInfo.bestFormat;
      item.modified = item.modifiedTime.cats[modifiedInfo.bestFormat][0];
      item.modifiedTime.cats.bestFormat[0] = modifiedInfo.bestFormat;
    }

    //Set default category for each cat:

    //state.lastCategory
    
    modifiedInfo = setLastCategoryPer(modifiedInfo);
    createdInfo = setLastCategoryPer(createdInfo);
    //categoryInfo = setLastCategoryPer(categoryInfo);
    //if (!categoryInfo.lastCategory) { categoryInfo.lastCategory = pivotProps.setTab }
    categoryInfo.lastCategory = pivotProps.setTab;

    // on my home PC, for 649 items x 3000 loops it took 30 seconds.

    let endTime = getTheCurrentTime();

    //console.log('response', response);

    let tileCollection = response.map(item => ({

      imageUrl: (getColumnValue(pivotProps,item,'colImageLink')),

      title: (getColumnValue(pivotProps,item,'colTitleText')),

      description: (getColumnValue(pivotProps,item,'colHoverText')),

      href: (getColumnValue(pivotProps,item,'colGoToLink')),

      category: (getColumnValue(pivotProps,item,'colCategory') !== "" ? getColumnValue(pivotProps,item,'colCategory') : [pivotProps.otherTab] ),

      setTab: pivotProps.setTab,
      setSize: pivotProps.setSize,
      heroType: pivotProps.heroType,
      heroCategory: currentHero,      

      Id: item.Id,

      options: 
      (!(item[pivotProps.colTileStyle] )
      ? ""
      : (item[pivotProps.colTileStyle] ).length > 0
      ? item[pivotProps.colTileStyle] 
      : null),

      color: 
      (!(item[pivotProps.colColor] )
      ? ""
      : (item[pivotProps.colColor] ).length > 0
      ? item[pivotProps.colColor] 
      : null),

      imgSize: 
      (!(item[pivotProps.colSize] )
      ? ""
      : (item[pivotProps.colSize] ).length > 0
      ? item[pivotProps.colSize] 
      : null),

      listWebURL: fixedURL.replace("ReplaceID",item.Id),
      listTitle: pivotProps.listTitle,

      target: 
      (!(item[pivotProps.colOpenBehaviour] )
      ? pivotProps.target
      : (item[pivotProps.colOpenBehaviour] ).length > 0
      ? item[pivotProps.colOpenBehaviour] 
      : pivotProps.target ),
      
      setRatio: pivotProps.setRatio,
      setImgFit: pivotProps.setImgFit,
      setImgCover: pivotProps.setImgCover,
      onHoverZoom: pivotProps.onHoverZoom,

      modified: item.modified,
      modifiedByID: (getColumnValue(pivotProps,item,'colModifiedById')),
      modifiedByTitle: (getColumnValue(pivotProps,item,'colModifiedByTitle')),
      created: item.created,
      createdByID: (getColumnValue(pivotProps,item,'colCreatedById')),
      createdByTitle: (getColumnValue(pivotProps,item,'colCreatedByTitle')),
      modifiedTime: item.modifiedTime,
      createdTime: item.createdTime,

    }));
    //console.table("tileCollection");
    //console.table(tileCollection);


    return {
      tileCollection: tileCollection,
      createdInfo: createdInfo,
      modifiedInfo: modifiedInfo,
      categoryInfo: categoryInfo,

      modifiedByTitles: modifiedByTitles.sort(),
      modifiedByIDs: modifiedByIDs.sort(),
      createdByTitles: createdByTitles.sort(),
      createdByIDs: createdByIDs.sort(),

    }

  }

  public static parseMe(str, parser, leftOrRight) {
    // Usage:
    // parseMe(theseProps[getProp],"/",'left')
    // parseMe(theseProps[getProp],"/",'right');

    let splitCol = str.split(parser);
    if (leftOrRight.toLowerCase() === 'left') {
      return splitCol[0];
    } else if (leftOrRight.toLowerCase() === 'right') {
      return splitCol[1] ? splitCol[1] : "";
    }
  }

  public static buildTileCategoriesFromResponse(pivotProps, pivotState, response, currentHero, thisCatColumn ){

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
      ( pivotProps.heroType === 'carousel' || pivotProps.heroType === 'slider' || pivotProps.heroType === 'carouselLayout')) {
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

  }

}

function updatetileCats(pivotProps, thisCat, allCats, currentHero) {

    if (  pivotProps.showHero === true && thisCat === currentHero && (
      pivotProps.heroType === 'slider' || pivotProps.heroType === 'carousel' || pivotProps.heroType === 'carouselLayout' )) {
      //  If heroType is slider or carousel and this is the heroCategory, do not add to tile categories.
      //  because all tiles will be in those react components.

    } else {
      allCats.push(thisCat);
    }

  return allCats;
}
