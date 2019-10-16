import * as React from 'react';
import { Image, ImageFit, } from 'office-ui-fabric-react/lib/Image';

import { css, IImageProps, } from 'office-ui-fabric-react';

import styles from './PivotTileItem.module.scss';
import tUtils from './utilTiles'
import Utils from './../PivotTiles/utils'

import { IPivotTileItemProps } from './IPivotTileItemProps'
import { IPivotTileItemState } from './IPivotTileItemState'

import { imageOptionsGroup, } from '../../../../services/propPane';

export default class PivotTileItem extends React.Component<IPivotTileItemProps, IPivotTileItemState> {

  constructor(props: IPivotTileItemProps, state: IPivotTileItemState) {
    super(props);

    this.state = {
      hovering: 10,
      visible:10
    };
  }

  public mouseOver(event): void {
    this.setState({ hovering: true });
  }

  public mouseOut(event): void {
    this.setState({ hovering: false });
  }

  public specialClick(event): void {
    console.log(event);
    console.log(this);
  /*  
    const listURL = this.props.listWebURL + "lists/" + this.props.listTitle;
    console.log(listURL);

    const currentPageUrl = this.props.listWebURL + this.context.site.serverRequestPath;
    console.log(currentPageUrl);

    const editItemURL = listURL + "/EditForm.aspx?ID=" + this.props.Id + "&Source=" + currentPageUrl;
    console.log(editItemURL);
*/
    if (event.shiftKey) {
      if (event.altKey) {
        if (event.ctrlKey) {      


  /*  
          console.log(currentPageUrl);
          console.log(listURL);
          console.log(editItemURL);
          */
          window.open(this.props.listWebURL, '_blank');

          event.preventDefault();
          return
        }
      }
    }
  }

  public render(): React.ReactElement<IPivotTileItemProps> {

    if (this.props.heroType === "none" || this.props.heroType === "") {
      var iStyles= tUtils.getTheseStyles(this.props.setSize,this.props.setRatio);
    } else {
      var iStyles= tUtils.getHeroStyles(this.props.setSize,this.props.setRatio, this.props.heroType);
    }
    
    let thisTop = `${this.props.imageHeight / 3 * 2}px`;
    let thisHeight = `${this.props.imageHeight}px`;
    let thisWidth = `${this.props.imageWidth}px`;
    let thisFit = this.props.setImgFit.indexOf('cover') ?  'cover' : 'contain';
    //let imgURL = (item[this.props.backgroundImageField]) ? item[this.props.backgroundImageField].Url : this.props.fallbackImageUrl;
    //let thisTarget = (item[this.props.newTabField]) ? "_blank" : "";
    //let thisHref = (item[this.props.linkField]) ? item[this.props.linkField].Url : "#";
    let thisPadding = `${this.props.textPadding}px`;

    return (
      <div>
        <a href={this.props.href} 
          className={styles.pivotTiles}
          style={{ width: thisWidth, height: thisHeight }}
          target={imageOptionsGroup.getTarget(this.props.target)}
          role="listitem" 
          onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
          onClick={this.specialClick.bind(this)}
          >
          <div className={ [iStyles.iWrap, iStyles.iWrapExp].join(" ")}
            style={{ width: thisWidth, height: thisHeight }} 
            >

            <Image 
              className={iStyles.iItemImage} 
              src={this.props.imageUrl} 
              shouldFadeIn={true} 
              imageFit={imageOptionsGroup.getImgFit(this.props.setImgFit)}
              coverStyle={imageOptionsGroup.getImgCover(this.props.setImgCover)}      
            />

            <div className={[iStyles.iHovPan, 
              //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator#Conditional_chains
              this.state.hovering === true  ? iStyles.iHovPanExp
              : this.state.hovering === false  ? iStyles.iHovPanNot
              : iStyles.iHovPanNot
              ].join(" ")}
              style={{ width: thisWidth, height: thisHeight }} 
              >

              <div className={iStyles.iTitle}>{this.props.title}</div>
              <div className={styles.pTileItemDesc}>{this.props.description}</div>
            </div>
          </div>
        </a>
      </div>

    );
  }

}
