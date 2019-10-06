import * as React from 'react';
import styles from './PivotTiles.module.scss';

import { IPivotTilesProps } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';
import PivotTileItem from './../TileItems/PivotTileItem';
import { escape } from '@microsoft/sp-lodash-subset';
import Utils from './utils'

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, autobind } from 'office-ui-fabric-react';
import { sp, Web } from '@pnp/sp';
import * as strings from 'PivotTilesWebPartStrings';

import { pivotOptionsGroup, } from '../../../../services/propPane';


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
    const defIndex = Utils.convertCategoryToIndex(this.props.setTab);

    tileBuild = this.state.filteredTiles.map(newTile => (
      <PivotTileItem
        parentCat = {this.state.filteredCategory}
        imageUrl={newTile.imageUrl}
        title={newTile.title}
        description={newTile.description}
        href={newTile.href}
        category={newTile.category}
        setTab={newTile.setTab}
        Id={newTile.Id}
        options={newTile.options}
        color={newTile.color}
        imgSize={newTile.imgSize}
        listWebURL={newTile.listWebURL}
        listTitle={newTile.listTitle}
        setRatio={newTile.setRatio}
        setSize={newTile.setSize}
        setImgFit={newTile.setImgFit}
        setImgCover={newTile.setImgCover}
        target={newTile.target}
        />
      ));

    return (
      <div className={styles.pivotTiles}>
        <div className={styles.container}>
        
          {/*//https://developer.microsoft.com/en-us/fabric#/controls/web/pivot*/}

          <Pivot 
            linkSize={ pivotOptionsGroup.getPivSize(this.props.setPivSize) }
            linkFormat={ pivotOptionsGroup.getPivFormat(this.props.setPivFormat) }
            onLinkClick={this.onLinkClick}
            defaultSelectedKey={defIndex}>
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
  public createPivot(pivT) {
    const thisItemKey :string = Utils.convertCategoryToIndex(pivT);
      return (
        <PivotItem headerText={pivT} itemKey={thisItemKey}/>
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

          let pivotProps = this.props;
          let tileCollection = Utils.buildTileCollectionFromResponse(response, pivotProps);

          console.table(response);
          console.table(tileCollection);   

          let tileCategories = Utils.buildTileCategoriesFromResponse(response, pivotProps);

          const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
          const defaultSelectedKey = defaultSelectedIndex.toString();
          //defaultselectedkey = tileCategories.indexOf(this.props.setTab).toString;

          let newFilteredTiles = [];
            for (let thisTile of tileCollection) {
              if(thisTile.category.indexOf(this.props.setTab) > -1) {
                newFilteredTiles.push(thisTile);
              }
          }

          if (response.length===0){
            alert("No Items found in your list based on your filtering: " + useTileList);
          }

          this.setState({
            allTiles:tileCollection,
            pivtTitles: tileCategories,
            filteredTiles: newFilteredTiles,
            pivotDefSelKey: defaultSelectedKey,
          });

        }).catch((e) => {
          console.log("Can't load data");
          var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
          alert(m);
          console.log(e);
        });

    } else {

        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
//           let tileCollection = response.map(item=>new ClassTile(item));
//           https://stackoverflow.com/questions/47755247/typescript-array-map-return-object

            console.table(response);
            
            let pivotProps = this.props;
            let tileCollection = Utils.buildTileCollectionFromResponse(response, pivotProps);
  
            console.table(response);
            console.table(tileCollection);   
  
            let tileCategories = Utils.buildTileCategoriesFromResponse(response, pivotProps);
            
            const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
            const defaultSelectedKey = defaultSelectedIndex.toString();
            //defaultselectedkey = tileCategories.indexOf(this.props.setTab).toString;

            let newFilteredTiles = [];
            for (let thisTile of tileCollection) {
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

    }
    

    //Handle error?
  
  }  

}
