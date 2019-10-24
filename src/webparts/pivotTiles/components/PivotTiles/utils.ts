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


    console.log("buildTileCollectionFromResponse");
    console.log(pivotProps);
    console.log(response);

    //console.table(pivotProps);
    //console.table(response);

    let tileCollection = response.map(item => ({


      imageUrl: 
      ((pivotProps.colImageLink.indexOf("/") < 0 ))
      ? item[pivotProps.colImageLink]
      : item[pivotProps[pivotProps.colImageLink.replace("/",".")]],

      title: 
      ((pivotProps.colTitleText.indexOf("/") < 0 ))
      ? item[pivotProps.colTitleText]
      : item[pivotProps[pivotProps.colTitleText.replace("/",".")]],

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

  public static buildTileCategoriesFromResponse(response, pivotProps){

    let tileCategories = [];
    //console.table("tileCollection");
    //console.table(response);
    console.log("tileCollection");
    console.log(response);    
    console.log(pivotProps.colCategory);
    console.log(pivotProps.colCategory.replace("/","."));

    let splitCol = pivotProps.colCategory.split("/");
    let leftSide = splitCol[0];
    let righttSide = splitCol[1];
    console.log('leftSide: ' + leftSide);
    console.log('righttSide: ' + righttSide);

    for (let tile of response) {
      console.log(tile);
      if (righttSide) {
        // Use different notation for drilling down
        console.log('buildTileCategoriesFromResponse category 0');  
        let lookup = tile[leftSide];
        console.log(lookup);
        let detail = lookup[righttSide].toString();
        console.log(detail);

          console.log('buildTileCategoriesFromResponse category 1');
          if(tileCategories.indexOf(detail) === -1) {
            tileCategories.push(detail);
          }

        console.log('buildTileCategoriesFromResponse category 0');
      } else {
        for (let category of tile[pivotProps.colCategory]) {
          console.log('buildTileCategoriesFromResponse category 2');
          console.log(category);
          if(tileCategories.indexOf(category) === -1) {
            tileCategories.push(category);
          }
        }
      }

    }

    console.log(tileCategories);
    tileCategories.sort();
    console.log(tileCategories);
    return tileCategories;

  }

}