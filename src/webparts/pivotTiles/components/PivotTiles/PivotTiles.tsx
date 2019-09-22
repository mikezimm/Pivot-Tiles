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
    this.state = { 
      allTiles:[],
      filteredTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
      pivotDefSelKey:"9",
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
    console.log("functionDome:  default class PivotTiles props:");
    console.log(this.props);
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
        {console.log("public render:  this.state")}
        {console.log(this.state)}
        
          {/*//https://developer.microsoft.com/en-us/fabric#/controls/web/pivot*/}

          <Pivot linkSize={PivotLinkSize.large} onLinkClick={this.onLinkClick} defaultSelectedKey={this.state.pivotDefSelKey}>
            {this.createPivots(this.state)}
          </Pivot>

          <br/>
          <div>
            {console.log("in Return() this.state - look for .filteredTiles")}
            {console.log(this.state)}
            { (tileBuild ) }

          </div>
        </div>
      </div>
    );
  }

  private onLinkClick = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    console.log("onLinkClick:  item.props.headerText");
    console.log(item.props.headerText);
    //debugger;
    console.log("onLinkClick:  this.state - before setState");
    console.log(this.state);

//    const filteredTiles: IPivotTileItemProps[] = this.state.allTiles.filter(tile => tile.category === item.props.headerText);

    console.log("this.state.allTiles:");
    console.log(this.state.allTiles);    
    let newFilteredTiles = [];
      for (let thisTile of this.state.allTiles) {
        console.log("thisTile:");
        console.log(thisTile);
        console.log("thisTile.category:" + thisTile.category);
        console.log("item.props.headerText:" + item.props.headerText);
        console.log(thisTile.category.indexOf(item.props.headerText))
        console.log(thisTile.category.indexOf(item.props.headerText) > -1)
        if(thisTile.category.indexOf(item.props.headerText) > -1) {
          newFilteredTiles.push(thisTile);
        }
    }

    this.setState({
      filteredCategory: item.props.headerText,
      filteredTiles: newFilteredTiles,
    });

    console.log("onLinkClick: this.state - after setState");
    console.log(this.state);
    console.log("onLinkClick: this.state.allTiles");
    console.log(this.state.allTiles);
    console.log("onLinkClick: newFilteredTiles");
    console.log(newFilteredTiles);

  } //End onClick

  //http://react.tips/how-to-create-reactjs-components-dynamically/ - based on createImage
  public createPivot(pivT,def) {
    /*
    if (pivT == def) {
      return (
        <PivotItem headerText={pivT} />
      )
    } else {
      */
      return (
        <PivotItem headerText={pivT} />
      )
    //}

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
    console.log("Hello1");
    console.log(this);
    const listItems: IPivotTileItemProps[] = await this.props.loadListItems();

    //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
    this.setState({allTiles:listItems});
    console.log("_loadListItems:  listItems=");
    console.log(listItems);
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
    console.log("Hello2");
    console.log("private _getListItems");
    console.log(this);

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
    console.log("The rest filter is: " + restFilter);

    let restSort: string = "Title";
    if ( this.props.colSort ) {
      restSort = this.props.colSort;
    }
    console.log("The Sort column is: " + restSort);

    let selectCols: string = "*";
    
    
    if ( this.props.listWebURL.length > 0 ){
      let web = new Web(this.props.listWebURL);

      web.lists.getByTitle(useTileList).items
      .select(selectCols).filter(restFilter).orderBy(restSort,true).get().then
        ((response) => {
          console.log("Hello4");
          console.log("private _getListItems: tileCollection");
          console.log(response);

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
            
          console.log("defaultSelectedKey");   
          console.log(defaultSelectedKey);        

          console.log("tileCategories");   
          console.log(tileCategories);    

          console.log("this.state.allTiles:");
          console.log(this.state.allTiles);    
          let newFilteredTiles = [];
            for (let thisTile of response) {
              console.log("thisTile:");
              console.log(thisTile);
              console.log("thisTile.category:" + thisTile.category);
              console.log("this.props.setTab:" + this.props.setTab);

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

          console.log(tileCollection);
        })

    } else {

        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
            console.log("Hello4");
            console.log("private _getListItems: tileCollection");
            console.log(response);

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

            tileCategories.sort();
            const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
            const defaultSelectedKey = defaultSelectedIndex.toString();
            //defaultselectedkey = tileCategories.indexOf(this.props.setTab).toString;
              
            console.log("defaultSelectedKey");   
            console.log(defaultSelectedKey);        
  
            console.log("tileCategories");   
            console.log(tileCategories);    
  
            console.log("this.state.allTiles:");
            console.log(this.state.allTiles);    
            let newFilteredTiles = [];
            for (let thisTile of response) {
              console.log("thisTile:");
              console.log(thisTile);
              console.log("thisTile.category:" + thisTile[this.props.colCategory]);
              console.log("this.props.setTab:" + this.props.setTab);

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
