//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

export default class Utils {

    
  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    if (cat){
      return (cat.replace(" ",'_').replace(/[&]/,'And').replace(/[*]/,'aamp').replace(/[\/\\#,+()$~%.'":*?<>{}]/g,''));
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

    function getColumnValue(theseProps, item, getProp){
      const leftSide = this.parseMe(theseProps[getProp],"/",'left');
      const rightSide = this.parseMe(theseProps[getProp],"/",'right');

      if (theseProps[getProp].indexOf("/") < 0) {
          return item[theseProps[getProp]];
       } else {
        return item[leftSide][rightSide]; 
      }
    }

/*
      title: 
      ((pivotProps.colTitleText.indexOf("/") < 0 ))
      ? item[pivotProps.colTitleText]
      : item[pivotProps[pivotProps.colTitleText.replace("/",".")]],

            imageUrl: 
      ((pivotProps.colImageLink.indexOf("/") < 0 ))
      ? item[pivotProps.colImageLink]
      : item[pivotProps[this.parseMe(pivotProps.colImageLink,"/",'left')]   ],
      */


    let tileCollection = response.map(item => ({

      imageUrl: (getColumnValue(pivotProps,item,'colImageLink')),

      title: (getColumnValue(pivotProps,item,'colTitleText')),

      description: 
      ((pivotProps.colHoverText.indexOf("/") < 0 ))
      ? item[pivotProps.colHoverText]
      : item[pivotProps[pivotProps.colHoverText.replace("/",".")]],

      href: 
      ((pivotProps.colGoToLink.indexOf("/") < 0 ))
      ? item[pivotProps.colGoToLink]
      : item[pivotProps[pivotProps.colGoToLink.replace("/",".")]],

      category: 
      ((pivotProps.colCategory.indexOf("/") < 0 ))
      ? item[pivotProps.colCategory]
      : item[pivotProps[pivotProps.colCategory.replace("/",".")]],

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
      return splitCol[1] ? splitCol[1] : ""
    }
  };

  public static buildTileCategoriesFromResponse(pivotProps, response ){

    let tileCategories = [];

    let splitCol = pivotProps.colCategory.split("/");
    let leftSide = splitCol[0];
    let righttSide = splitCol[1];

    for (let tile of response) {
      if (righttSide) {
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

          for (let category of tile.category) {

          if(tileCategories.indexOf(category) === -1) {
          
            if (  pivotProps.showHero === true && category === pivotProps.heroCategory && (
              pivotProps.heroType === 'slider' || pivotProps.heroType === 'carousel' )) {
              //  If heroType is slider or carousel and this is the heroCategory, do not add to tile categories.
              //  because all tiles will be in those react components.

            } else {
              tileCategories.push(category);
            }
          }
        }
      }
    }

    tileCategories.sort();

    return tileCategories;

  }

}