//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

export default class Utils {

  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
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

      const leftSide = Utils.parseMe(theseProps[getProp],"/",'left');
      const rightSide = Utils.parseMe(theseProps[getProp],"/",'right');
      var itemVal :any ;
      if (theseProps[getProp].indexOf("/") < 0) {

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

    console.log('pivotProps', pivotProps, response );

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

      modified: item.Modified,
      created: item.Created,
      createdByTitle: item['Author']['Title'],
      modifiedByTitle: item['Editor']['Title'],
      createdByID: item['Author']['ID'].toString(),
      modifiedByID: item['Editor']['ID'].toString(),

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

  public static buildTileCategoriesFromResponse(pivotProps, response, currentHero ){

    let tileCategories = [];

    let splitCol = pivotProps.colCategory.split("/");
    let leftSide = splitCol[0];
    let righttSide = splitCol[1];

    for (let tile of response) {
      //if (righttSide) {tile.category
      if (!tile.category) {
        //This allows it to skip if the tile category is empty or blank
      } else if (tile.category[0] === pivotProps.otherTab) {
        //Skip because this one was assigned the "Others" category
      } else {

        const isArray = typeof(tile.category);
        //console.log(isArray);

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
        }
      }
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
