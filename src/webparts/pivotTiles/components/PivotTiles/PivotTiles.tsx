import * as React from 'react';
import styles from './../PivotTiles.module.scss';
import { IPivotTilesProps } from './IPivotTilesProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { DefaultButton, autobind } from 'office-ui-fabric-react';
import { IPivotTileItemProps } from './../TileItems/IPivotTileItemProps';

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
    this._loadListItems();
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
      const listItems: IPivotTileItemProps[] = await this.props.loadListItems();
  
      //https://www.youtube.com/watch?v=4nsGhYjfRsw 9:01-ish talks about this line to update props
      this.setState({allTiles:listItems});
      console.log("_loadListItems:  listItems=");
      console.log(listItems);
    }

}
