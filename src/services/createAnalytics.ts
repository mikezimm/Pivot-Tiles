import { sp, Web, Item, ItemAddResult, ItemUpdateResult } from '@pnp/sp';

export function getBrowser(validTypes,changeSiteIcon){

    let thisBrowser = "";
    // Opera 8.0+
    //var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    //var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    //var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    //var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    //var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1 - 71
    //var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // Blink engine detection
    //var isBlink = (isChrome || isOpera) && !!window.CSS;

    /*
    if (isIE == true){
        thisBrowser = "IE"
    } else if (isChrome == true){
        thisBrowser = "Chrome"
    } else if (isEdge == true){
        thisBrowser = "Edge"
    } else if (isSafari == true){
        thisBrowser = "Safari"
    } else if (isFirefox == true){
        thisBrowser = "FireFox"
    } else if (isOpera == true){
        thisBrowser = "Opera"
    } else if (isBlink == true){
        thisBrowser = "Blink"
    }


    if (validTypes.indexOf(thisBrowser) == -1){
        //This browser is not valid... do something

        if (changeSiteIcon == true) {
            var thisOne = "https://alvteams.alv.autoliv.int/sites/alvbranding/Templates/TileIcons_150/No_" + thisBrowser + "_logo_150.png"
            document.getElementById("DeltaSiteLogo").firstElementChild.firstElementChild.src = thisOne
        }

    }

    var output = 'Detecting browsers by ducktyping:<hr>';
    output += 'isFirefox: ' + isFirefox + '<br>';
    output += 'isChrome: ' + isChrome + '<br>';
    output += 'isSafari: ' + isSafari + '<br>';
    output += 'isOpera: ' + isOpera + '<br>';
    output += 'isIE: ' + isIE + '<br>';
    output += 'isEdge: ' + isEdge + '<br>';
    output += 'isBlink: ' + isBlink + '<br>';
    //alert(output);
    */
    return thisBrowser;

}


export function saveAnalytics (theProps,theState) {

    console.log('saveAnalytics');
    console.log(theProps); 
    console.log(theState);

    let analyticsList = "TilesCycleTesting";
    let startTime = theProps.startTime;
    let endTime = theState.endTime;
    let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/');
    const delta = endTime.now - startTime.now;
    //alert(delta);
    //alert(getBrowser("Chrome",false));
    /*

    */

    web.lists.getByTitle(analyticsList).items.add({
        'Title': 'Pivot-Tiles x1asdf',
        'zzzText1': startTime.now,      
        'zzzText2': startTime.theTime,
        'zzzNumber1': startTime.milliseconds,
        'zzzText3': endTime.now,      
        'zzzText4': endTime.theTime,
        'zzzNumber2': endTime.milliseconds,
        'zzzNumber3': delta,
        }).then((response) => {
        //Reload the page
            //location.reload();
        }).catch((e) => {
        //Throw Error
            alert(e);
    });


};


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


};

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
    }
    console.log('getTheTime = ');
    console.log(result);   
    return result;

};
