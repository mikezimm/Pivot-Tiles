import * as React from 'react';
import { Image, ImageFit, } from 'office-ui-fabric-react/lib/Image';

import { css, IImageProps, sizeToPixels, } from 'office-ui-fabric-react';

import styles from './PivotTileItem.module.scss';
import tUtils from './utilTiles';
import Utils from './../PivotTiles/utils';

import { IPivotTileItemProps } from './IPivotTileItemProps';
import { IPivotTileItemState } from './IPivotTileItemState';

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

    if (event.shiftKey) {
      if (event.altKey) {
        if (event.ctrlKey) {      
          window.open(this.props.listWebURL, '_blank');
          event.preventDefault();
          return ;
        }
      }
    }
  }

  public render(): React.ReactElement<IPivotTileItemProps> {
    
    let thisTop = `${this.props.imageHeight * .6 }px`;
    let thisHeight = `${this.props.imageHeight}px`;
    let thisWidth = `${this.props.imageWidth}px`;
    let thisFit = this.props.setImgFit.indexOf('cover') ?  'cover' : 'contain';
    //let imgURL = (item[this.props.backgroundImageField]) ? item[this.props.backgroundImageField].Url : this.props.fallbackImageUrl;
    //let thisTarget = (item[this.props.newTabField]) ? "_blank" : "";
    //let thisHref = (item[this.props.linkField]) ? item[this.props.linkField].Url : "#";
    let thisPadding = `${this.props.textPadding}px`;
    let iStyles = null;
    
    if (this.props.heroType === "none" || this.props.heroType === "") {
        iStyles= tUtils.getTheseStyles(this.props.setSize,this.props.setRatio);
    } else {
        iStyles= tUtils.getHeroStyles(this.props.setSize,this.props.setRatio, this.props.heroType);
    }

    var iHoverZoomStyle = tUtils.getOnHoverStyle(this.props.onHoverZoom);

    if (this.props.heroType === "none" && this.props.setSize === "Custom"){
      return (
        <div>
          <a href={this.props.href} 
            className={styles.pivotTiles}
            style={ {width: thisWidth, height: thisHeight }  }
            target={imageOptionsGroup.getTarget(this.props.target)}
            role="listitem" 
            onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
            onClick={this.specialClick.bind(this)}
            >
            <div className={ [styles.pTileItemWrapper, styles.pTileItemWrapperExpanded].join(" ")}
              style={ { width: thisWidth, height: thisHeight } } 
              >
  
              <Image 
                className={[
                  styles.pTileItemImageCustom,
                  ( this.state.hovering === true  ? iHoverZoomStyle : styles.imgHoverZoom )
                ].join(" ")} 
                src={this.props.imageUrl} 
                shouldFadeIn={true} 
                imageFit={imageOptionsGroup.getImgFit(this.props.setImgFit)}
                coverStyle={imageOptionsGroup.getImgCover(this.props.setImgCover)}      
              />
  
              <div className={[styles.pTileItemHoverPanel, 
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator#Conditional_chains
                this.state.hovering === true  ? styles.pTileItemHoverPanelExpanded
                : this.state.hovering === false  ? styles.pTileItemHoverPanelNotExpanded
                : styles.pTileItemHoverPanelNotExpanded
                ].join(" ")}
                style={{ width: thisWidth, height: thisHeight, top: ( this.state.hovering === true ? 0 : thisTop ), padding: thisPadding }} 
                >
                <div className={styles.pTileItemTitle}>{this.props.title}</div>
                <div className={styles.pTileItemDesc}>{this.props.description}</div>
              </div>
            </div>
          </a>
        </div>
  
      );
    } else {
      return (
        <div>
          <a href={this.props.href} 
            className={styles.pivotTiles}
            target={imageOptionsGroup.getTarget(this.props.target)}
            role="listitem" 
            onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
            onClick={this.specialClick.bind(this)}
            >
            <div className={ [iStyles.iWrap, iStyles.iWrapExp].join(" ")}>
  
              <Image 
                className={[
                  styles.pTileItemImageCustom,
                  ( this.state.hovering === true  ? iHoverZoomStyle : styles.imgHoverZoom )
                ].join(" ")} 
                
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

}
