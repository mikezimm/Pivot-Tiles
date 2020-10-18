//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

import { getTheCurrentTime,} from '../../../../services/createAnalytics';
import {tileTime} from '../TileItems/IPivotTileItemProps';
import { getLocalMonths } from '../../../../services/dateServices';


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


function createIPersonCategoryArrays(col) {
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

  };
  
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



  /***
   *     .o88b.  .d88b.  d8b   db db    db d88888b d8888b. d888888b      db      d888888b d8b   db db   dD .d8888. 
   *    d8P  Y8 .8P  Y8. 888o  88 88    88 88'     88  `8D `~~88~~'      88        `88'   888o  88 88 ,8P' 88'  YP 
   *    8P      88    88 88V8o 88 Y8    8P 88ooooo 88oobY'    88         88         88    88V8o 88 88,8P   `8bo.   
   *    8b      88    88 88 V8o88 `8b  d8' 88~~~~~ 88`8b      88         88         88    88 V8o88 88`8b     `Y8b. 
   *    Y8b  d8 `8b  d8' 88  V888  `8bd8'  88.     88 `88.    88         88booo.   .88.   88  V888 88 `88. db   8D 
   *     `Y88P'  `Y88P'  VP   V8P    YP    Y88888P 88   YD    YP         Y88888P Y888888P VP   V8P YP   YD `8888Y' 
   *                                                                                                               
   *                                                                                                               
   */

    /**
     * The purpose of this function is to convert links such as relative shortcut links ../SitePages etc...
     * @param theseProps 
     * @param itemVal 
     */
    public static convertLinks(theseProps, itemValL){
      let itemVal2 = itemValL;
      if (itemValL && itemValL.indexOf('../') === 0){
        itemVal2 = itemVal2.replace('../', (theseProps.pageContext.web.absoluteUrl + '/'));
      }
      return itemVal2;
    }

      /**
     * This gets the values of specified columns including if they are expanded.
     * @param theseProps 
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

    public static getColumnValue(theseProps, item, getProp){

      if (getProp.toLowerCase() === "thumb" || getProp.toLowerCase() === "thumbnail") {
        getProp = "File/ServerRelativeUrl";
      }

      function convertValues(itemValc) {
        // Cleans up values into right syntax, no numbers and some must be arrays.
        itemValc = (getProp.indexOf('Link') > -1) ? this.convertLinks(theseProps, itemValc) :itemValc;
        itemValc = (Array.isArray(itemValc)) ? itemValc.map(String) : itemValc;  //Convert number arrays (like Author/ID) to string arrays
        itemValc = (typeof(itemValc) === 'number') ? itemValc.toString() : itemValc;
        return itemValc;
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
          var d1 = new Date(itemVal);
          itemVal = d1.getFullYear();
        }

        return itemVal;

      } else if (theseProps[getProp].indexOf("/") < 0 && theseProps[getProp].indexOf(".") < 0 ) {
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
              var d2 = new Date(itemVal);
              itemVal = d2.getFullYear();
            }

          }

          itemVal = convertValues(itemVal);
          return itemVal;
        } else { return ""; } 
      } else {
        //console.log('getColumnValue: ', getProp, theseProps[getProp]);
        let parser = theseProps[getProp].indexOf('/') > 0 ? '/' : '.';
        const leftSide =  Utils.parseMe(theseProps[getProp], parser,'left');
        const rightSide = Utils.parseMe(theseProps[getProp], parser,'right');

        if (item[leftSide]) {
          itemVal = item[leftSide][rightSide];
          itemVal = convertValues(itemVal);
          return itemVal;
        } else { return ""; } 
      }
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


  public static buildTileCollectionFromResponse(response, pivotProps, fixedURL, currentHero){

//           let tileCollection = response.map(item=>new ClassTile(item));
//          https://stackoverflow.com/questions/47755247/typescript-array-map-return-object

    const monthCats = getLocalMonths('en-us','short');
    const one_day = 1000 * 60 * 60 * 24;

    
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

    function addDateVariations(item,col){
      let newItem = item;

      let tileTimeDV = createIDateCategoryArrays(col);
      let thisTime = new Date(item[col]);

      tileTimeDV.cats.time[0] = thisTime;
      tileTimeDV.cats.yr[0] = thisTime.getFullYear();
      tileTimeDV.cats.mo[0] = thisTime.getMonth() + 1;
      tileTimeDV.cats.date[0] = thisTime.getDate();
      tileTimeDV.cats.day[0] = thisTime.getDay() + 1;
      tileTimeDV.cats.hr[0] = thisTime.getHours();
      tileTimeDV.cats.locDate[0] = thisTime.toLocaleDateString();
      tileTimeDV.cats.locTime[0] = thisTime.toLocaleTimeString();
      tileTimeDV.cats.age[0] = (pivotProps.startTime.now.valueOf() - thisTime.valueOf()) / ( one_day ) ;
      let monthPrefix = (tileTimeDV.cats.mo[0] < 10 ? '0' : '');
      let datePrefix = (tileTimeDV.cats.date[0] < 10 ? '0' : '');
      tileTimeDV.cats.yrMo[0] = tileTimeDV.cats.yr + '-' + monthPrefix + tileTimeDV.cats.mo;
      tileTimeDV.cats.moDay[0] = monthPrefix + tileTimeDV.cats.mo + '-' +  datePrefix + tileTimeDV.cats.date;
      
      newItem[col + 'Time'] = tileTimeDV; 

      return newItem;

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

      //console.log('setLastCategoryPer: newDateInfo',bestFormat,newDateInfo);

      //This just checks to see if there is a best format... default category may not have one.
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

      //console.log('setLastCategoryPer: newPersonInfo',bestFormat,nePersonInfo);
      
      //This just checks to see if there is a best format... default category may not have one.
      if (nePersonInfo.cats[bestFormat]) { nePersonInfo.lastCategory = nePersonInfo.cats[bestFormat][0]; }

      return nePersonInfo;

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
        item.modified = (this.getColumnValue(pivotProps,item,'colModified'));
        item.modifiedByID = (this.getColumnValue(pivotProps,item,'colModifiedById')); // This is required for addPersonVariations
        item.modifiedByTitle = (this.getColumnValue(pivotProps,item,'colModifiedByTitle')); // This is required for addPersonVariations

        item = addPersonVariations(item,'modifiedBy');

        if(modifiedByTitles.indexOf(item.modifiedByTitle) === -1) { modifiedByTitles.push(item.modifiedByTitle); }
        if(modifiedByIDs.indexOf(item.modifiedByID) === -1) { modifiedByIDs.push(item.modifiedByID); }

        item = addDateVariations(item,'modified');
        modifiedInfo.cats = pushDatesToCategories(modifiedInfo.cats, item.modifiedTime);
        item = localizeDateVariations(item,'modified');

        modifiedByInfo.cats = pushPersonsToCategories(modifiedByInfo.cats, item.modifiedBy);

        if ( item.modifiedTime.cats.time[0] < modifiedInfo.earliest )  { modifiedInfo.earliest = item.modifiedTime.cats.time[0]; }
        if ( item.modifiedTime.cats.time[0] > modifiedInfo.latest )  { modifiedInfo.latest = item.modifiedTime.cats.time[0]; } 
  
      //Do all to created
        item.created = (this.getColumnValue(pivotProps,item,'colCreated'));
        item.createdByID = (this.getColumnValue(pivotProps,item,'colCreatedById')); // This is required for addPersonVariations
        item.createdByTitle = (this.getColumnValue(pivotProps,item,'colCreatedByTitle')); // This is required for addPersonVariations

        item = addPersonVariations(item,'createdBy');

        if(createdByTitles.indexOf(item.createdByTitle) === -1) { createdByTitles.push(item.createdByTitle); }
        if(createdByIDs.indexOf(item.createdByID) === -1) { createdByIDs.push(item.createdByID); }
  
        item = addDateVariations(item,'created');
        createdInfo.cats = pushDatesToCategories(createdInfo.cats, item.createdTime);
        item = localizeDateVariations(item,'created');

        createdByInfo.cats = pushPersonsToCategories(createdByInfo.cats, item.createdBy);

        if ( item.createdTime.cats.time[0] < createdInfo.earliest )  { createdInfo.earliest = item.createdTime.cats.time[0] ; }
        if ( item.createdTime.cats.time[0] > createdInfo.latest )  { createdInfo.latest = item.createdTime.cats.time[0] ; } 

    }


    createdInfo.cats = sortAllDateCategories(createdInfo.cats);
    modifiedInfo.cats = sortAllDateCategories(modifiedInfo.cats);
    categoryInfo.cats = sortAllDateCategories(categoryInfo.cats);
    modifiedByInfo.cats = sortAllPersonCategories(modifiedByInfo.cats);
    createdByInfo.cats = sortAllPersonCategories(createdByInfo.cats);

    /**
     *   In this area, go back and localize date categories like we do for items above.
     */

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

    //Set default category for each cat:

    //state.lastCategory
    
    modifiedInfo = setLastCategoryPer(modifiedInfo);
    createdInfo = setLastCategoryPer(createdInfo);
    modifiedByInfo = setLastCategoryPerson(modifiedByInfo);
    createdByInfo = setLastCategoryPerson(createdByInfo);
    
    //categoryInfo = setLastCategoryPer(categoryInfo);
    //if (!categoryInfo.lastCategory) { categoryInfo.lastCategory = pivotProps.setTab }
    categoryInfo.lastCategory = pivotProps.setTab;

    // on my home PC, for 649 items x 3000 loops it took 30 seconds.

    let endTime = getTheCurrentTime();

    //console.log('response', response);

/***
 *    d888888b d888888b db      d88888b       .o88b.  .d88b.  db      db      d88888b  .o88b. d888888b d888888b  .d88b.  d8b   db             
 *    `~~88~~'   `88'   88      88'          d8P  Y8 .8P  Y8. 88      88      88'     d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88      Vb     
 *       88       88    88      88ooooo      8P      88    88 88      88      88ooooo 8P         88       88    88    88 88V8o 88       `Vb   
 *       88       88    88      88~~~~~      8b      88    88 88      88      88~~~~~ 8b         88       88    88    88 88 V8o88         `V. 
 *       88      .88.   88booo. 88.          Y8b  d8 `8b  d8' 88booo. 88booo. 88.     Y8b  d8    88      .88.   `8b  d8' 88  V888         .d' 
 *       YP    Y888888P Y88888P Y88888P       `Y88P'  `Y88P'  Y88888P Y88888P Y88888P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P       .dP   
 *                                                                                                                                     dP     
 *                                                                                                                                            
 */

    let tileCollection = response.map(item => ({

      imageUrl: (this.getColumnValue(pivotProps,item,'colImageLink')),

      title: (this.getColumnValue(pivotProps,item,'colTitleText')),

      description: (this.getColumnValue(pivotProps,item,'colHoverText')),

      href: (this.getColumnValue(pivotProps,item,'colGoToLink')),

      category: (this.getColumnValue(pivotProps,item,'colCategory') !== "" ? this.getColumnValue(pivotProps,item,'colCategory') : [pivotProps.otherTab] ),

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
      modifiedBy: item.modifiedBy,
      createdBy: item.createdBy,
      modifiedByID: (this.getColumnValue(pivotProps,item,'colModifiedById')),
      modifiedByTitle: (this.getColumnValue(pivotProps,item,'colModifiedByTitle')),
      created: item.created,
      createdByID: (this.getColumnValue(pivotProps,item,'colCreatedById')),
      createdByTitle: (this.getColumnValue(pivotProps,item,'colCreatedByTitle')),
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
      createdByInfo: createdByInfo,
      modifiedByInfo: modifiedByInfo,

      

      modifiedByTitles: modifiedByTitles.sort(),
      modifiedByIDs: modifiedByIDs.sort(),
      createdByTitles: createdByTitles.sort(),
      createdByIDs: createdByIDs.sort(),

    };

  }  // END public static buildTileCollectionFromResponse(response, pivotProps, fixedURL, currentHero){

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

  } // END public static buildTileCategoriesFromResponse(pivotProps, pivotState, response, currentHero, thisCatColumn ){

}  // END export default class Utils {



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
