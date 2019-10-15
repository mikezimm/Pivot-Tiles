import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import styles from './PivotTiles.module.scss';
import { Link } from 'office-ui-fabric-react/lib/Link';
import Utils from './utils'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


export function buildTips(parentProps,parentState){

  const currentPageUrl = parentProps.pageContext.web.absoluteUrl + parentProps.pageContext.site.serverRequestPath;
  const fixedURL = Utils.fixURLs(parentProps.listWebURL, parentProps.pageContext);
  const listURL = fixedURL + "lists/" + parentProps.listTitle;
  const newItemURL = listURL + "/newform.aspx?Source=" + currentPageUrl;

  const theseTips = 
  <div className={styles.rowNoPad}>


      <div className={parentState.showTips === "yes" ? styles.showErrorMessage : styles.hideMe }>


          <div className={(parentProps.heroType !== "none" && parentState.heroStatus === "none") ? styles.showErrorMessageNoPad : styles.hideMe }>
            <h3>There may be a problem with your webpart settings for <mark>Hero Category</mark></h3>
            <p>Property pane setting for Hero Type is: <mark><b>{parentProps.heroType }</b></mark></p>
            <p>Property pane setting for Hero Category is:  <mark><b>{parentProps.heroCategory !== "" ?parentProps.heroCategory : "<It's Empty>"}</b></mark></p>
            <p>I can't seem to find any tiles in that category....</p>
            <p>Double check by verifying the spelling and then refreshing the page. If all is good this message will go away.</p>
            <p></p>
          </div>


          <h3>Tile details are saved in your tile list called: {parentProps.listTitle}</h3>
          <p><Link href={listURL} 
              target="_blank">
              {listURL}
            </Link></p>
          <h3>To edit a specific tile that is visible</h3>
          <b>CTRL-ALT-SHFT-Click</b> on the tile to go directly to it.
          <h3>To create a new tile:</h3>
          <p><Link href={newItemURL} 
              target="">
              Click Me to add a new Tile!
            </Link></p>

      </div>
  </div>;

  return theseTips;
}


export function LoadingSpinner(parentState){
  const loadingSpinner = 
  <div className={styles.rowNoPad}>
  <div className={parentState.loadStatus === "Loading" ? styles.showErrorMessage : styles.hideMe }>
    <Spinner size={SpinnerSize.small} />
  </div>
  </div>;

  return loadingSpinner;
}

export function NoListFound (parentProps,parentState) {
//  console.log('NoListFound');
//  console.log(parentProps);

    const fixedURL = Utils.fixURLs(parentProps.listWebURL, parentProps.pageContext);


    const noListFound = 
    <div className={styles.rowNoPad}>
      <div className={parentState.loadStatus === "ListNotFound" ? styles.showErrorMessage : styles.hideMe }>
          <h1>Tile List was not found: {parentProps.listTitle}</h1>
          Check your site contents for list:  <Link href={fixedURL + "_layouts/15/viewlsts.aspx"} target="_blank">{fixedURL}</Link>

          <h2>Other common causes for this message</h2>
          <h3>You do not have a Tile Category set for a visible tile:</h3>
          <p><Link href={fixedURL + "lists/" + parentProps.listTitle} 
              target="_blank">
              {fixedURL + "lists/" + parentProps.listTitle}
            </Link></p>
          <h3>You do not have permissions to the list :(</h3>
          <p>Please contact your site admin for assistance!</p>
      </div>
    </div>;


      return noListFound;
}

export function NoItemsFound (parentProps,parentState) {
//  console.log('NoListFound');
//  console.log(parentProps);

    const fixedURL = Utils.fixURLs(parentProps.listWebURL, parentProps.pageContext);
    const noItemsFound = 
    <div className={styles.rowNoPad}>
      <div className={parentState.loadStatus === "NoItemsFound" ? styles.showErrorMessage : styles.hideMe }>
        <h1>No items were found in your tile list: {parentProps.listTitle}</h1>
        <p>This is the filter we are using: <b>{parentProps.setFilter}</b></p>
        <p>Looking here:</p>
        <p><Link href={fixedURL + "lists/" + parentProps.listTitle} 
            target="_blank">
            {fixedURL + "lists/" + parentProps.listTitle}
          </Link></p>
        <p>You can also get this message if you do not have permissions to the list.</p>
      </div>
    </div>;

  
      return noItemsFound;
}
