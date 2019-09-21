import * as React from 'react';
import styles from './../PivotTiles.module.scss';
import { IPivotTilesProps } from './IPivotTilesProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { DefaultButton, autobind } from 'office-ui-fabric-react';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';

import { sp, Web } from '@pnp/sp';

import * as strings from 'PivotTilesWebPartStrings';

import { ClassTile } from '../TileItems/ClassTile'

export default class PivotTiles extends React.Component<IPivotTilesProps, {}> {

  //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about setting constructor
  public constructor(props:IPivotTilesProps){
    super(props);
    this.state = { 
      allTiles:[],
      activeTiles:[],
    }
  }

  public componentDidMount() {
    console.log("functionDome:  default class PivotTiles props:");
    console.log(this.props);
    //this._loadListItems();
    this._getListItems();
  }
  
  public render(): React.ReactElement<IPivotTilesProps> {
    return (
      <div className={ styles.pivotTiles }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
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
            console.log("tileCategories");   
            console.log(tileCategories);        

            this.setState({allTiles:tileCollection});
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
              console.log("tileCategories");   
              console.log(tileCategories);        

              this.setState({allTiles:tileCollection});
              console.log(tileCollection);
            })          
  
      }
      
  
      //Handle error?
    
    }  

}
