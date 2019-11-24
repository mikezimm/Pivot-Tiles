//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

import { getTheCurrentTime,} from '../../../../services/createAnalytics';
import {tileTime} from '../TileItems/IPivotTileItemProps';

interface IDateCategoryObject {
  yr?: number;
  mo?: number;
  day?: number;
  date?: number;
  hr?: number;

  age?: number;

  yrMo?: string;
  moDay?: string;

  locDate?: string;
  locTime?: string;

  time?: Date;

}

interface IDateCategoryArrays {
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

}

function createIDateCategoryArrays() {
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

  return cats;

}

export default class Utils {

    
  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    console.log('convertCategoryToIndex', cat);
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


    //console.table(pivotProps);
    //console.table(response);

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

      let tileTime = createIDateCategoryArrays();
      let thisTime = new Date(item[col]);

      tileTime.time[0] = thisTime;
      tileTime.yr[0] = thisTime.getFullYear();
      tileTime.mo[0] = thisTime.getMonth() + 1;
      tileTime.date[0] = thisTime.getDate();
      tileTime.day[0] = thisTime.getDay() + 1;
      tileTime.hr[0] = thisTime.getHours();
      tileTime.locDate[0] = thisTime.toLocaleDateString();
      tileTime.locTime[0] = thisTime.toLocaleTimeString();
      tileTime.age[0] = (pivotProps.startTime.now.valueOf() - thisTime.valueOf()) / (1000 * 60 * 60 *24 ) ;
      let monthPrefix = (tileTime.mo[0] < 10 ? '0' : '');
      let datePrefix = (tileTime.date[0] < 10 ? '0' : '');
      tileTime.yrMo[0] = tileTime.yr + '-' + monthPrefix + tileTime.mo;
      tileTime.moDay[0] = monthPrefix + tileTime.mo + '-' +  datePrefix + tileTime.date;
      
      newItem[col + 'Time'] = tileTime; 

      return newItem;

    }
  
    function pushDatesToCategories(cats: IDateCategoryArrays, thisTime:IDateCategoryArrays ){
      //This updates the possible new categories for this date column
      let newCats = cats;
      const allKeys = Object.keys(newCats);

      for (let key of allKeys){
        if(newCats[key].indexOf(thisTime[key][0]) === -1) { newCats[key].push(thisTime[key][0]); }
      }
      return newCats;

    }

    let catsModified = createIDateCategoryArrays();
    let catsCreated = createIDateCategoryArrays();

    let earlyestMod = new Date(2033,1,1);
    let latestMod = new Date(1999,1,1);
    let earlyestCre = new Date(2033,1,1);
    let latestCre = new Date(1999,1,1);
    let startTime = getTheCurrentTime();

    // Get all date variations
    for (let item of response) {

        item.modified= (getColumnValue(pivotProps,item,'colModified'));
        item.modifiedByID= (getColumnValue(pivotProps,item,'colModifiedById'));
        item.modifiedByTitle= (getColumnValue(pivotProps,item,'colModifiedByTitle'));
  
        item = addDateVariations(item,'modified');
        catsModified = pushDatesToCategories(catsModified, item.modifiedTime);

        if ( item.modifiedTime.time < earlyestMod )  { earlyestMod = item.modifiedTime.time; }
        if ( item.modifiedTime.time > latestMod )  { latestMod = item.modifiedTime.time; } 
  
        item.created= (getColumnValue(pivotProps,item,'colCreated'));
        item.createdByID= (getColumnValue(pivotProps,item,'colCreatedById'));
        item.createdByTitle= (getColumnValue(pivotProps,item,'colCreatedByTitle'));
  
        item = addDateVariations(item,'created');
        catsCreated = pushDatesToCategories(catsCreated, item.createdTime);

        if ( item.createdTime.time < earlyestCre )  { earlyestCre = item.createdTime.time ; }
        if ( item.createdTime.time > latestCre )  { latestCre = item.createdTime.time ; } 

    }

    function findBestDateCategory(cats: IDateCategoryArrays, maxPivotChars : number) {
      let newCats = cats;
      //const allKeys = Object.keys(newCats);

      let allCreatedOnSameDay = (cats.locDate.length = 1 ) ? true : false;
      let allCreatedInSameMonth = (cats.yrMo.length = 1 ) ? true : false;
      let allCreatedInSameYear = (cats.yr.length = 1 ) ? true : false;    
      let allDatesFitOnPivot = (cats.locDate.join('     ').length < maxPivotChars) ? true : false;

      return newCats;

    }



    // on my home PC, for 649 items x 3000 loops it took 30 seconds.

    let endTime = getTheCurrentTime();
    let modifiedRange = (latestMod.getTime() - earlyestMod.getTime()) / (1000*60*60*24);
    let createdRange = (latestCre.getTime() - earlyestCre.getTime()) / (1000*60*60*24);

    console.log('response', response);
    console.log('catsModified',catsModified);
    console.log('catsCreated',catsCreated);

    console.log('earlyestCre', earlyestCre);
    console.log('earlyestMod', earlyestMod);
    console.log('latestCre', latestCre);
    console.log('latestMod', latestMod);
    console.log('modifiedRange', modifiedRange);
    console.log('createdRange', createdRange);    

    //console.log('process time', startTime, endTime);



    //console.log('pivotProps', pivotProps, response );

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
    return tileCollection;

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

  public static buildTileCategoriesFromResponse(pivotProps, response, currentHero, thisCatColumn ){

    let tileCategories = [];
    let usingDefinedCategoryColumn = thisCatColumn === 'category' ? true : false ;
    if (!usingDefinedCategoryColumn) {
      let tileCats1 = [];
      let tileCats2 = [];
      let tileCats3 = [];


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
