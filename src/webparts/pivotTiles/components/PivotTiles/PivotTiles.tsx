import * as React from 'react';
import styles from './../PivotTiles.module.scss';

import { IPivotTilesProps } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';
import PivotTileItem from './../TileItems/PivotTileItem';
import { escape } from '@microsoft/sp-lodash-subset';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';

import { DefaultButton, autobind } from 'office-ui-fabric-react';

import { sp, Web } from '@pnp/sp';

import * as strings from 'PivotTilesWebPartStrings';

export default class PivotTiles extends React.Component<IPivotTilesProps, IPivotTilesState> {

  //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about setting constructor
//  public constructor(props:IPivotTilesProps){
  public constructor(props:IPivotTilesProps){
    super(props);
    let url = this.props.listWebURL;
    let tileList = this.props.listTitle;
    let sortList = this.props.colSort;
    let that = this.props;
    console.log("constructor this:");
    console.log(this);

    let x = this._getListItemsConstructor(that);

    console.log("constructor x:");
    console.log(x);

    this.state = { 
      allTiles:[],
      filteredTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
      pivotDefSelKey:"",
    };
    /*
    this.state = { 
      allTiles:[],
      filteredTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
    };
    */
    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    this.onLinkClick = this.onLinkClick.bind(this);
  }

  public componentDidMount() {
    //Not using this function because it just did not want to work.
    //this._loadListItems();
    this._getListItems();
  }
  
  public render(): React.ReactElement<IPivotTilesProps> {
    let tileBuild;

    tileBuild = this.state.filteredTiles.map(newTile => (
      <PivotTileItem
        parentCat = {this.state.filteredCategory}
        imageUrl={newTile.imageUrl}
        title={newTile.title}
        description={newTile.description}
        href={newTile.href}
        category={newTile.category} />
      ));

    return (
      <div className={styles.pivotTiles}>
        <div className={styles.container}>
        
          {/*//https://developer.microsoft.com/en-us/fabric#/controls/web/pivot*/}

          <Pivot linkSize={PivotLinkSize.large} onLinkClick={this.onLinkClick} defaultSelectedKey={this.state.pivotDefSelKey}>
            {this.createPivots(this.state)}
          </Pivot>

          <br/>
          <div>

            { (tileBuild ) }

          </div>
        </div>
      </div>
    );
  }

  private onLinkClick = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
 
    let newFilteredTiles = [];
      for (let thisTile of this.state.allTiles) {

        if(thisTile.category.indexOf(item.props.headerText) > -1) {
          newFilteredTiles.push(thisTile);
        }
    }

    this.setState({
      filteredCategory: item.props.headerText,
      filteredTiles: newFilteredTiles,
    });


  } //End onClick

  //http://react.tips/how-to-create-reactjs-components-dynamically/ - based on createImage
  public createPivot(pivT,def) {
      return (
        <PivotItem headerText={pivT} />
      )
  }

  public createPivots(thisState){
    return (
      thisState.pivtTitles.map(this.createPivot,thisState.filteredCategory)
    )
  }

  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  @autobind 
  private async _loadListItems(): Promise<void> {
    //This invokes the loadListItems function on the parent webpart.ts
    const listItems: IPivotTileItemProps[] = await this.props.loadListItems();

    //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
    this.setState({allTiles:listItems});

  }
  private async _getListItemsConstructor(thisx): Promise<IPivotTileItemProps[]> {

    //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
    /* Filtering example of same one and only retreiving certain columns
    const result:IListItem[] = await sp.web.lists.getByTitle("Customers").items
    .select("Title","CustomerID").filter("Title eq 'GM'").orderBy("Id",true).getAll()
    */

    /*  Be sure to import Web from @pnp/sp first, then use this to get from another web.

        let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/ScriptTesting/');
        const result:IListItem[] = await web.lists.getByTitle("Customers").items

        or .... 

        let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/ScriptTesting/');
        web.get().then(w => {
          console.log(w);
        });

    */
   console.log("thisx 2:");
   console.log(thisx);


    let useTileList: string = strings.DefaultTileList;
    
    //This line is causing an error in debugger mode:
    //unCaught Promise, can not read list Title of undefined.
    if ( thisx.props.listTitle ) {
        useTileList = thisx.props.listTitle;
    }

    let restFilter: string = "";
    if ( thisx.props.setFilter ) {
      restFilter = thisx.props.setFilter;
    }

    let restSort: string = "Title";
    if ( thisx.props.colSort ) {
      restSort = thisx.props.colSort;
    }

    let selectCols: string = "*";
    
    if ( thisx.props.listWebURL.length > 0 ){
      let web = new Web(thisx.props.listWebURL);

      const result:IPivotTileItemProps[] = await web.lists.getByTitle(useTileList).items
        .select(selectCols).filter(restFilter).orderBy(restSort,true).get();

        console.log("const result:IPivotTileItemProps 2:");
        console.log(result);

      let tileCollection:IPivotTileItemProps[] = result.map(item => ({
        imageUrl: item[thisx.props.colImageLink],
        title: item[thisx.props.colTitleText],
        description: item[thisx.props.colHoverText],
        href: item[thisx.props.colGoToLink],
        category: item[thisx.props.colCategory],
      }));

      console.log("const tileCollection:IPivotTileItemProps 2:");
      console.log(tileCollection);

      return(tileCollection);
/*
          let tileCategories = [];
          for (let tile of response) {
            for (let category of tile[this.props.colCategory]) {
              if(tileCategories.indexOf(category) === -1) {
                tileCategories.push(category);
              }
            }
          }

          tileCategories.sort();
          const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
          const defaultSelectedKey = defaultSelectedIndex.toString();
          //defaultselectedkey = tileCategories.indexOf(this.props.setTab).toString;

          let newFilteredTiles = [];
            for (let thisTile of response) {
              if(thisTile.category.indexOf(this.props.setTab) > -1) {
                newFilteredTiles.push(thisTile);
              }
          }

          this.setState({
            allTiles:tileCollection,
            pivtTitles: tileCategories,
            filteredTiles: newFilteredTiles,
            pivotDefSelKey: defaultSelectedKey,
          });
*/

    } else {


      
      const result:IPivotTileItemProps[] = await sp.web.lists.getByTitle(useTileList).items
        .select(selectCols).filter(restFilter).orderBy(restSort,true).get();

      console.log("const result:IPivotTileItemProps 2:");
      console.log(result);


      let tileCollection:IPivotTileItemProps[] = result.map(item => ({
        imageUrl: item[thisx.props.colImageLink],
        title: item[thisx.props.colTitleText],
        description: item[thisx.props.colHoverText],
        href: item[thisx.props.colGoToLink],
        category: item[thisx.props.colCategory],
      }));

      
      console.log("const tileCollection:IPivotTileItemProps:");
      console.log(tileCollection);

      return(tileCollection);

    }
    

    //Handle error?
  
  }  


  //    private async loadListItems(): Promise<IPivotTileItemProps[]> {
  private _getListItems(): void {
    //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
    /* Filtering example of same one and only retreiving certain columns
    const result:IListItem[] = await sp.web.lists.getByTitle("Customers").items
    .select("Title","CustomerID").filter("Title eq 'GM'").orderBy("Id",true).getAll()
    */

    /*  Be sure to import Web from @pnp/sp first, then use this to get from another web.

        let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/ScriptTesting/');
        const result:IListItem[] = await web.lists.getByTitle("Customers").items

        or .... 

        let web = new Web('https://mcclickster.sharepoint.com/sites/Templates/ScriptTesting/');
        web.get().then(w => {
          console.log(w);
        });

    */

    let useTileList: string = strings.DefaultTileList;
    
    //This line is causing an error in debugger mode:
    //unCaught Promise, can not read list Title of undefined.
    if ( this.props.listTitle ) {
        useTileList = this.props.listTitle;
    }

    let restFilter: string = "";
    if ( this.props.setFilter ) {
      restFilter = this.props.setFilter;
    }

    let restSort: string = "Title";
    if ( this.props.colSort ) {
      restSort = this.props.colSort;
    }

    let selectCols: string = "*";
    
    if ( this.props.listWebURL.length > 0 ){
      let web = new Web(this.props.listWebURL);

      web.lists.getByTitle(useTileList).items
      .select(selectCols).filter(restFilter).orderBy(restSort,true).get().then
        ((response) => {

//           let tileCollection = response.map(item=>new ClassTile(item));
//          https://stackoverflow.com/questions/47755247/typescript-array-map-return-object
          let tileCollection = response.map(item => ({
            imageUrl: item[this.props.colImageLink],
            title: item[this.props.colTitleText],
            description: item[this.props.colHoverText],
            href: item[this.props.colGoToLink],
            category: item[this.props.colCategory],
          }));

          let tileCategories = [];
          for (let tile of response) {
            for (let category of tile[this.props.colCategory]) {
              if(tileCategories.indexOf(category) === -1) {
                tileCategories.push(category);
              }
            }
          }

          tileCategories.sort();
          const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
          const defaultSelectedKey = defaultSelectedIndex.toString();
          //defaultselectedkey = tileCategories.indexOf(this.props.setTab).toString;

          let newFilteredTiles = [];
            for (let thisTile of response) {
              if(thisTile.category.indexOf(this.props.setTab) > -1) {
                newFilteredTiles.push(thisTile);
              }
          }

          this.setState({
            allTiles:tileCollection,
            pivtTitles: tileCategories,
            filteredTiles: newFilteredTiles,
            pivotDefSelKey: defaultSelectedKey,
          });

        })

    } else {

        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
//           let tileCollection = response.map(item=>new ClassTile(item));
//           https://stackoverflow.com/questions/47755247/typescript-array-map-return-object

            let tileCollection = response.map(item => ({
              imageUrl: item[this.props.colImageLink],
              title: item[this.props.colTitleText],
              description: item[this.props.colHoverText],
              href: item[this.props.colGoToLink],
              category: item[this.props.colCategory],
            }));

            let tileCategories = [];
            for (let tile of response) {
              for (let category of tile[this.props.colCategory]) {
                if(tileCategories.indexOf(category) === -1) {
                  tileCategories.push(category);
                }
              }
            }

            tileCategories.sort();
            const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
            const defaultSelectedKey = defaultSelectedIndex.toString();
            //defaultselectedkey = tileCategories.indexOf(this.props.setTab).toString;

            let newFilteredTiles = [];
            for (let thisTile of response) {
              if(thisTile[this.props.colCategory].indexOf(this.props.setTab) > -1) {
                newFilteredTiles.push(thisTile);
              }
            }
  
            this.setState({
              allTiles:tileCollection,
              pivtTitles: tileCategories,
              filteredTiles: newFilteredTiles,
              pivotDefSelKey: defaultSelectedKey,
            });


          })

    }
    

    //Handle error?
  
  }  

}
