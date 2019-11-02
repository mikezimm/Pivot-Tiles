//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

export default class Utils {

    
  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    const thisCat = cat.toString();
    if (thisCat == null) { return "" };
    if (thisCat){
      return (thisCat.replace(" ",'_').replace(/[&]/,'And').replace(/[*]/,'aamp').replace(/[\/\\#,+()$~%.'":*?<>{}]/g,''));
    } else {
      return ("");
    }
  }

  public static fixURLs(oldURL,pageContext) {
    let newURL = oldURL;
    if (newURL.length === 0) {
      newURL = pageContext.web.absoluteUrl;
    }
    newURL += newURL.endsWith("/") ? "" : "/";
    return newURL;
  }

  public static buildTileCollectionFromResponse(response, pivotProps, fixedURL){

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
        getProp = "File/ServerRelativeUrl"
      }

      const leftSide = Utils.parseMe(theseProps[getProp],"/",'left');
      const rightSide = Utils.parseMe(theseProps[getProp],"/",'right');

      if (theseProps[getProp].indexOf("/") < 0) {
          return item[theseProps[getProp]];
      } else {
        return item[leftSide][rightSide]; 
      }
    }

    let tileCollection = response.map(item => ({

      imageUrl: (getColumnValue(pivotProps,item,'colImageLink')),

      title: (getColumnValue(pivotProps,item,'colTitleText')),

      description: (getColumnValue(pivotProps,item,'colHoverText')),

      href: (getColumnValue(pivotProps,item,'colGoToLink')),

      category: (getColumnValue(pivotProps,item,'colCategory')),

      setTab: pivotProps.setTab,
      setSize: pivotProps.setSize,
      heroType: pivotProps.heroType,
      heroCategory: pivotProps.heroCategory,      

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

    }));
    //console.table("tileCollection");
    console.table(tileCollection);
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
      return splitCol[1] ? splitCol[1] : ""
    }
  };

  public static buildTileCategoriesFromResponse(pivotProps, response ){

    let tileCategories = [];

    let splitCol = pivotProps.colCategory.split("/");
    let leftSide = splitCol[0];
    let righttSide = splitCol[1];

    for (let tile of response) {
      //if (righttSide) {
      if (tileCategories.length===999) {
        // Use different notation for drilling down
        console.log('buildTileCategoriesFromResponse category 0');  
        let lookup = tile[leftSide];

        let detail = lookup[righttSide].toString();

        console.log('buildTileCategoriesFromResponse category 1');
        if(tileCategories.indexOf(detail) === -1) {
          tileCategories.push(detail);
        }

        console.log('buildTileCategoriesFromResponse category 0');
      } else {

        let addCategory : boolean;

        if (splitCol.length === 1) {
          //Test as normal column
          for (let category of tile.category) {
            console.log('tileCategories.indexOf(category): ', tileCategories.indexOf(category), tileCategories, category)
            if(tileCategories.indexOf(category) === -1) {
              addCategory = true;
            } else {addCategory = false}
          }
        } else {
          //Test as Lookup column (which is not an array but only one value)
          if(tileCategories.indexOf(tile.category) === -1) {
            addCategory = true;
          } else {addCategory = false}
        }



        //
        if (addCategory === true){
          if (  pivotProps.showHero === true && tile.category === pivotProps.heroCategory && (
            pivotProps.heroType === 'slider' || pivotProps.heroType === 'carousel' )) {
            //  If heroType is slider or carousel and this is the heroCategory, do not add to tile categories.
            //  because all tiles will be in those react components.
  
          } else {
            tileCategories.push(tile.category);
          }
        }
      }
    }

    tileCategories.sort();

    return tileCategories;

  }

}