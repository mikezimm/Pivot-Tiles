import { sp, Web, Item, ItemAddResult, ItemUpdateResult } from '@pnp/sp';

export function getBrowser(validTypes,changeSiteIcon){

    let thisBrowser = "";
    return thisBrowser;

}


export function saveAnalytics (theProps,theState) {


    //console.log('saveAnalytics: ', theProps, theState);
    let analyticsList = "TilesCycleTesting";
    let startTime = theProps.startTime;
    let endTime = theState.endTime;
    let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/');
    const delta = endTime.now - startTime.now;
    //alert(delta);
    //alert(getBrowser("Chrome",false));
    /*

    */

    let itemInfo1 = "(" + theState.allTiles.length + ")"  + " - " +  theProps.getAll + " - " + " - " + theProps.listDefinition;
    let itemInfo2 = "(" + theProps.listTitle + ")"  + " - " +  theProps.listWebURL;

    let itemInfoProps = theProps.setSize +
            " ImgFit: " +  theProps.setImgFit;



    if (theProps.heroTiles) { 
        let itemInfoHero = 
        " ShowHero: " +  theProps.showHero +
        " HeroType: " +  theProps.heroType +
        " HeroFit: " +  theProps.setHeroFit +
        " HeroLength: " +  theProps.heroTiles.length;
        
        itemInfoProps += ' -Hero: ' + itemInfoHero }
  
    web.lists.getByTitle(analyticsList).items.add({
        'Title': 'Pivot-Tiles: ' + theProps.scenario,
        'zzzText1': startTime.now,      
        'zzzText2': startTime.theTime,
        'zzzNumber1': startTime.milliseconds,
        'zzzText3': endTime.now,      
        'zzzText4': endTime.theTime,
        'zzzNumber2': endTime.milliseconds,
        'zzzNumber3': delta,
        'zzzText5': itemInfo1,
        'zzzText6': itemInfo2,
        'zzzText7': itemInfoProps,
        }).then((response) => {
        //Reload the page
            //location.reload();
        }).catch((e) => {
        //Throw Error
            alert(e);
    });


}


export function saveAnalyticsX (theTime) {

    let analyticsList = "TilesCycleTesting";
    let currentTime = theTime;
    let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/');

    web.lists.getByTitle(analyticsList).items.add({
        'Title': 'Pivot-Tiles x1asdf',
        'zzzText1': currentTime.now,      
        'zzzText2': currentTime.theTime,
        'zzzNumber1': currentTime.milliseconds,

        }).then((response) => {
        //Reload the page
            //location.reload();
        }).catch((e) => {
        //Throw Error
            alert(e);
    });


}

export function saveTheTime () {
    let theTime = getTheCurrentTime();
    saveAnalyticsX(theTime);

    return theTime;

}

export function getTheCurrentTime () {

    const now = new Date();
    const theTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds();
    let result : any = {
        'now': now,
        'theTime' : theTime,
        'milliseconds' : now.getMilliseconds(),
    };

    return result;

}
