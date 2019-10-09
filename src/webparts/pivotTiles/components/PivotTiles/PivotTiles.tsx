import * as React from 'react';
import styles from './PivotTiles.module.scss';
import tileStyles from './../TileItems/PivotTileItem.module.scss';

import { IPivotTilesProps } from './IPivotTilesProps';
import { IPivotTilesState } from './IPivotTilesState';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';
import PivotTileItem from './../TileItems/PivotTileItem';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { escape } from '@microsoft/sp-lodash-subset';
import Utils from './utils'
import tUtils from './../TileItems/utilTiles'

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, autobind } from 'office-ui-fabric-react';
import { sp, Web } from '@pnp/sp';
import * as strings from 'PivotTilesWebPartStrings';

import * as ErrorMessages from './ErrorMessages'

import { pivotOptionsGroup, } from '../../../../services/propPane';

import * as myErrors from './ErrorMessages';
import * as tileBuilders from './TileBuilder';

export default class PivotTiles extends React.Component<IPivotTilesProps, IPivotTilesState> {

  //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about setting constructor
//  public constructor(props:IPivotTilesProps){
  public constructor(props:IPivotTilesProps){
    super(props);
    this.state = { 
      allTiles:[],
      filteredTiles:[],
      heroTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
      pivotDefSelKey:"",
      loadStatus:"Loading",

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
    //alert('this.props.heroCategory.length');
    //alert(this.props);
  }
  
  public componentDidUpdate(prevProps){

    //alert('componentDidUpdate 1');

    let rebuildTiles = false;
    if (this.props.setTab !== prevProps.setTab) {  rebuildTiles = true  }
    if (this.props.setSize !== prevProps.setSize) {  rebuildTiles = true  }
    if (this.props.heroType !== prevProps.heroType) {  rebuildTiles = true  }
    if (this.props.setRatio !== prevProps.setRatio) {  rebuildTiles = true  }
    if (this.props.setImgFit !== prevProps.setImgFit) {  rebuildTiles = true  }
    if (this.props.setImgCover !== prevProps.setImgCover) {  rebuildTiles = true  }
    if (this.props.heroCategory !== prevProps.heroCategory) {  rebuildTiles = true  }

    if (rebuildTiles === true) {

      this._updateStateOnPropsChange();
    }

  }


  public render(): React.ReactElement<IPivotTilesProps> {
    let heroFullLineBuild = ""
    if (this.props.heroCategory) {
      if (this.state.loadStatus === "Ready" ) {
        let heroFullLineBuild = tileBuilders.heroBuilder(this.props,this.state);
      }
    }


    let tileBuild = tileBuilders.tileBuilder(this.props,this.state);

    let noListFound = myErrors.NoListFound(this.props,this.state);

    let noItemsFound = myErrors.NoItemsFound(this.props,this.state);

    let loadingSpinner = myErrors.LoadingSpinner(this.state);

    const defIndex = Utils.convertCategoryToIndex(this.props.setTab);

    return (
      <div>

        { ( (this.props.heroType === "header" && this.state.loadStatus === "Ready"  ) ? ( heroFullLineBuild ) : ""  ) }

      <div className={styles.pivotTiles}>

        { /*( this.props.heroType === "header" ? ( heroFullLineBuild ) : ""  )*/ }
        
        { /* 
        (
          this.state.heroTiles.map(newTile => (
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
              setRatio={this.props.setRatio}
              setSize={this.props.setSize}
              setImgFit={'landscape'}
              setImgCover={newTile.setImgCover}
              target={newTile.target}
              heroType = {newTile.heroType}
              />
            ))
          )
          */
          }
          { /*
            this.state.heroTiles.length > 0 ?
             <PivotTileItem
             parentCat = {this.state.filteredCategory}
             imageUrl={this.state.heroTiles[0].imageUrl}
             title={this.state.heroTiles[0].title}
             description={this.state.heroTiles[0].description}
             href={this.state.heroTiles[0].href}
             category={this.state.heroTiles[0].category}
             setTab={this.state.heroTiles[0].setTab}
             Id={this.state.heroTiles[0].Id}
             options={this.state.heroTiles[0].options}
             color={this.state.heroTiles[0].color}
             imgSize={this.state.heroTiles[0].imgSize}
             listWebURL={this.state.heroTiles[0].listWebURL}
             listTitle={this.state.heroTiles[0].listTitle}
             setRatio={this.props.setRatio}
             setSize={this.props.setSize}
             setImgFit={'landscape'}
             setImgCover={this.state.heroTiles[0].setImgCover}
             target={this.state.heroTiles[0].target}
             heroType = {this.state.heroTiles[0].heroType}
             />
          : ""
            */
          }

        <div className={styles.container}>

          {/*//https://developer.microsoft.com/en-us/fabric#/controls/web/pivot*/}
          <div className={styles.tableRow}>
          <Pivot 
            linkSize= { pivotOptionsGroup.getPivSize(this.props.setPivSize) }
            linkFormat= { pivotOptionsGroup.getPivFormat(this.props.setPivFormat) }
            onLinkClick= { this.onLinkClick }
            defaultSelectedKey={ defIndex }>
              {this.createPivots(this.state)}
          </Pivot>
          </div>
          <br/>

          { ( (this.props.heroType === "left" && this.state.loadStatus === "Ready" ) ? ( heroFullLineBuild ) : ""  ) }
          { ( (this.props.heroType === "right" && this.state.loadStatus === "Ready" ) ? ( heroFullLineBuild ) : ""  ) }
          { ( (this.props.heroType === "inLine" && this.state.loadStatus === "Ready" ) ? ( heroFullLineBuild ) : ""  ) }

            { ( tileBuild ) }
            { /* Originally instead of this:  ( tileBuild ) */ }           
            { /* had this
                this.state.filteredTiles.map(newTile => (
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
                    heroType = {'none'}
                    />
                ))
              */
            }
            <div className={styles.tableRow}>
            { ( loadingSpinner ) }
            { ( noListFound )}
            { ( noItemsFound )}

            </div>


        </div>
        { ( this.props.heroType === "footer" ? ( heroFullLineBuild ) :""  ) }
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

  private _updateStateOnPropsChange(): void {

    let newCollection = this.state.allTiles;
    let newFiltered = this.state.filteredTiles;
    let newHeros = this.state.heroTiles;

    for (let thisTile of newCollection) {
      thisTile.setTab = this.props.setTab;
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    for (let thisTile of newFiltered) {
      thisTile.setTab = this.props.setTab;
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    for (let thisTile of newHeros) {
      thisTile.setTab = this.props.setTab;
      thisTile.setSize = this.props.setSize;
      thisTile.heroType = this.props.heroType;
      thisTile.setRatio = this.props.setRatio;
      thisTile.setImgFit = this.props.setImgFit;
      thisTile.setImgCover = this.props.setImgCover;
    }

    //alert('componentDidUpdate 3');

    //console.log('componentDidUpdate 4 State');
    //console.log(this.state);    

    this.setState({
      allTiles:newCollection,
      filteredTiles: newFiltered,
      loadStatus:"Ready",
      heroTiles : newHeros,
    });


  }

  //    private async loadListItems(): Promise<IPivotTileItemProps[]> {
  private _getListItems(): void {

    let useTileList: string = strings.DefaultTileList;
    
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

/*
For hero filtering, try this... works with single category but not array yet.

let array = [
    { id: 1, value: "itemname" },
    { id: 2, value: "itemname" },
    {id: 3, value: "testname"}
];

let filtered = array.filter(p => p.value === "itemname")
console.log(filtered);



    let array = [
      { id: 1, value: "itemname",cats:["1","2"] },
      { id: 2, value: "itemname",cats:["1","3"] },
      {id: 3, value: "testname",cats:["4","5"]}
    ]
    
let x = 1;
let filtered = array.filter(p => p.cats === "1")
console.log(filtered);


*/




      web.lists.getByTitle(useTileList).items
      .select(selectCols).filter(restFilter).orderBy(restSort,true).get().then
        ((response) => {

          if (response.length===0){
            this.setState({ loadStatus: "NoItemsFound" })
            return
          }

          let pivotProps = this.props;
          let tileCollection = Utils.buildTileCollectionFromResponse(response, pivotProps);

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

          let heroTiles = [];
          for (let thisTile of tileCollection) {
            if(thisTile.category.indexOf(this.props.heroCategory) > -1) {
              heroTiles.push(thisTile);
            }
          }
          
          var randomItem = heroTiles[Math.floor(Math.random()*heroTiles.length)];
          heroTiles = [randomItem];

          this.setState({
            allTiles:tileCollection,
            pivtTitles: tileCategories,
            filteredTiles: newFilteredTiles,
            pivotDefSelKey: defaultSelectedKey,
            loadStatus:"Ready",
            heroTiles : heroTiles,
          });

        }).catch((e) => {
          console.log("Can't load data");
          //var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
          //alert(m);
          console.log(e);
          this.setState({  loadStatus: "ListNotFound" })
        });

    } else {

        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
//           let tileCollection = response.map(item=>new ClassTile(item));
//           https://stackoverflow.com/questions/47755247/typescript-array-map-return-object

            if (response.length===0){
              this.setState({  loadStatus: "NoItemsFound"  })
              return
            }
            
            let pivotProps = this.props;
            let tileCollection = Utils.buildTileCollectionFromResponse(response, pivotProps);
  
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

            let heroTiles = [];
            for (let thisTile of tileCollection) {
              if(thisTile.category.indexOf(this.props.heroCategory) > -1) {
                heroTiles.push(thisTile);
              }
            }
            
            var randomItem = heroTiles[Math.floor(Math.random()*heroTiles.length)];
            heroTiles = [randomItem];

            this.setState({
              allTiles:tileCollection,
              pivtTitles: tileCategories,
              filteredTiles: newFilteredTiles,
              pivotDefSelKey: defaultSelectedKey,
              loadStatus:"Ready",
              heroTiles : heroTiles,
            });

          }).catch((e) => {
            console.log("Can't load data");
            //var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
            //alert(m);
            console.log(e);
            this.setState({  loadStatus: "ListNotFound"  })
          });

    }

  }  

}

