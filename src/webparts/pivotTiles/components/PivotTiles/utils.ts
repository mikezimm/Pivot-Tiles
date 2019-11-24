//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

import { getTheCurrentTime,} from '../../../../services/createAnalytics';
import {tileTime} from '../TileItems/IPivotTileItemProps'

export default class Utils {

    
  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    console.log('convertCategoryToIndex', cat);
    if (!cat) { return ""};

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

    
    let tileCats1 = [];
    let tileCats2 = [];
    let tileCats3 = [];
/*
    for (let tile of response) {
      //This is an alternate cateogry column so heroCategory and /Props are ignored because they are already flattened.
      let catValue = tile[thisCatColumn];
      if(tileCategories.indexOf(catValue) === -1) {
        tileCategories.push(catValue);
      }
      if (thisCatColumn === 'modified' || thisCatColumn === 'created'){
        // add to array of years
        let itemYr = catValue.getFullYear();
        let itemMo = catValue.getFullMonth();
        let itemDay = catValue.getFullDay();
        let cat2 = itemYr + '-' + itemMo;
        let cat3 = itemYr + '-' + itemMo;
        if(tileCats1.indexOf(itemYr) === -1) { tileCats1.push(itemYr); }
        // add to array of months

        if(tileCats2.indexOf() === -1) { tileCats2.push(itemVal); }
        // add to array of days
        itemVal = itemVal + '-' + catValue.getFullMonth();
        if(tileCats3.indexOf(itemVal) === -1) { tileCats3.push(itemVal); }
*/
    
    /**
     * This just gets all the possible date labels so we can determine best one for pivots
     * @param item 
     * @param col 
     */

    function addDateVariations(item,col){
      let result = item;
      let tileTime : tileTime = {};
      let thisTime = new Date(item[col]);

      tileTime.time = thisTime;
      tileTime.yr = thisTime.getFullYear();
      tileTime.mo = thisTime.getMonth() + 1;
      tileTime.date = thisTime.getDate();
      tileTime.day = thisTime.getDay() + 1;
      tileTime.hr = thisTime.getHours();
      tileTime.locDate = thisTime.toLocaleDateString();
      tileTime.locTime = thisTime.toLocaleTimeString();
      tileTime.age = (pivotProps.startTime.now.valueOf() - thisTime.valueOf()) / (1000 * 60 * 60 *24 ) ;
      let monthPrefix = (tileTime.mo < 10 ? '0' : '');
      let datePrefix = (tileTime.date < 10 ? '0' : '');
      tileTime.yrMo = tileTime.yr + '-' + monthPrefix + tileTime.mo;
      tileTime.moDay = monthPrefix + tileTime.mo + '-' +  datePrefix + tileTime.date;
      
      result[col + 'Time'] = tileTime; 
      
      return result;

    }

    let tileMod1 = [];
    let tileMod2 = [];
    let tileMod3 = [];
    let tileMod4 = [];
    let tileCre1 = [];
    let tileCre2 = [];
    let tileCre3 = [];
    let tileCre4 = [];
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
        if(tileMod1.indexOf(item.modifiedTime.yr) === -1) { tileMod1.push(item.modifiedTime.yr); }
        if(tileMod2.indexOf(item.modifiedTime.mo) === -1) { tileMod2.push(item.modifiedTime.mo); }
        if(tileMod3.indexOf(item.modifiedTime.yrMo) === -1) { tileMod3.push(item.modifiedTime.yrMo); }
        if(tileMod4.indexOf(item.modifiedTime.moDay) === -1) { tileMod4.push(item.modifiedTime.moDay); }

        if ( item.modifiedTime.time < earlyestMod )  { earlyestMod = item.modifiedTime.time }
        if ( item.modifiedTime.time > latestMod )  { latestMod = item.modifiedTime.time } 
  
        item.created= (getColumnValue(pivotProps,item,'colCreated'));
        item.createdByID= (getColumnValue(pivotProps,item,'colCreatedById'));
        item.createdByTitle= (getColumnValue(pivotProps,item,'colCreatedByTitle'));
  
        item = addDateVariations(item,'created');
        if(tileCre1.indexOf(item.createdTime.yr) === -1) { tileCre1.push(item.createdTime.yr); }
        if(tileCre2.indexOf(item.createdTime.mo) === -1) { tileCre2.push(item.createdTime.mo); }
        if(tileCre3.indexOf(item.createdTime.yrMo) === -1) { tileCre3.push(item.createdTime.yrMo); }
        if(tileCre4.indexOf(item.createdTime.moDay) === -1) { tileCre4.push(item.createdTime.moDay); }

        if ( item.createdTime.time < earlyestCre )  { earlyestCre = item.createdTime.time }
        if ( item.createdTime.time > latestCre )  { latestCre = item.createdTime.time } 

    }

    // on my home PC, for 649 items x 3000 loops it took 30 seconds.

    let endTime = getTheCurrentTime();
    let modifiedRange = (latestMod.getTime() - earlyestMod.getTime()) / (1000*60*60*24);
    let createdRange = (latestCre.getTime() - earlyestCre.getTime()) / (1000*60*60*24);

    console.log('response', response);
    console.log('earlyestCre', earlyestCre);
    console.log('earlyestMod', earlyestMod);
    console.log('latestCre', latestCre);
    console.log('latestMod', latestMod);
    console.log('modifiedRange', modifiedRange);
    console.log('createdRange', createdRange);    

    console.log('process time', startTime, endTime);

    //console.log('response', response);
    console.log('tileMod1', tileMod1);
    console.log('tileMod2', tileMod2);
    console.log('tileMod3', tileMod3);
    console.log('tileMod4', tileMod4);

    console.log('tileCre1', tileCre1);
    console.log('tileCre2', tileCre2);
    console.log('tileCre3', tileCre3);
    console.log('tileCre4', tileCre4);


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

      modified: (getColumnValue(pivotProps,item,'colModified')),
      modifiedByID: (getColumnValue(pivotProps,item,'colModifiedById')),
      modifiedByTitle: (getColumnValue(pivotProps,item,'colModifiedByTitle')),
      created: (getColumnValue(pivotProps,item,'colCreated')),
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
