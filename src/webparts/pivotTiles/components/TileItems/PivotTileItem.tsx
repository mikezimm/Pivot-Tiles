import * as React from 'react';
import { Image, ImageFit, } from 'office-ui-fabric-react/lib/Image';

import { css, IImageProps, sizeToPixels, } from 'office-ui-fabric-react';

import styles from './PivotTileItem.module.scss';
import tUtils from './utilTiles';

import { IPivotTileItemProps } from './IPivotTileItemProps';
import { IPivotTileItemState } from './IPivotTileItemState';

import { imageOptionsGroup, } from '../../../../services/propPane';

import { createIconButton } from '../createButtons/IconButton';

export default class PivotTileItem extends React.Component<IPivotTileItemProps, IPivotTileItemState> {

  public iHoverZoomStyle = tUtils.getOnHoverStyle(this.props.onHoverZoom);

  public thisHeight = `${this.props.imageHeight}px`;
  public thisWidth = `${this.props.imageWidth}px`;

  public isFabricIcon = this.props.imageUrl && this.props.imageUrl.length < 20 && this.props.imageUrl.indexOf('/') === -1 ? true : false;

  public colors = this.props.color && this.props.color.length > 0 ? this.props.color : '';


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

    //var iHoverZoomStyle = tUtils.getOnHoverStyle(this.props.onHoverZoom);

    if (this.props.heroType === "none" && this.props.setSize === "Custom"){
      return (
        <div>
          <a href={this.props.href} 
            className={styles.pivotTiles}
            style={ {width: this.thisWidth, height: this.thisHeight }  }
            target={imageOptionsGroup.getTarget(this.props.target)}
            role="listitem" 
            onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
            onClick={this.specialClick.bind(this)}
            >
            <div className={ [styles.pTileItemWrapper, styles.pTileItemWrapperExpanded].join(" ")}
              style={ { width: this.thisWidth, height: this.thisHeight , textAlign : this.isFabricIcon === true ? 'center' : null } } 
              >

              { this.getImageOrIcon() }
  
              <div className={[styles.pTileItemHoverPanel, 
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator#Conditional_chains
                this.state.hovering === true  ? styles.pTileItemHoverPanelExpanded
                : this.state.hovering === false  ? styles.pTileItemHoverPanelNotExpanded
                : styles.pTileItemHoverPanelNotExpanded
                ].join(" ")}
                style={{ width: this.thisWidth, height: this.thisHeight, top: ( this.state.hovering === true ? 0 : thisTop ), padding: thisPadding }} 
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
            <div className={ [iStyles.iWrap, iStyles.iWrapExp].join(" ")} style={{ textAlign : this.isFabricIcon === true ? 'center' : null }}>
  
              { this.getImageOrIcon() }
  
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


  private getThisColor ( what: 'font' | 'background' ) {


    let colorStyles = this.colors.split(';');
    let resultColor = what === 'font' ? 'darkgray' : 'transparent';

    colorStyles.map( c => {
      let thisColor = c.split('=');
      if ( thisColor.length === 2 ) {
        if ( thisColor[0] === what) { resultColor=thisColor[2] ; }
      }
    });

    return resultColor;

  }
  private getImageOrIcon ( ) {

    let result = null;

    if ( this.isFabricIcon === true ) {
      let iconHeight = parseInt(this.thisHeight, 10) * .65;

      let defCommandIconStyles = {
        root: {padding:'10px !important', height: this.thisHeight, width: this.thisWidth, top: '-10px' },//color: 'green' works here
        icon: { 
          fontSize: iconHeight,
          fontWeight: "normal",
          margin: '0px 2px',
          color: this.getThisColor('font'), //This will set icon color
       },
      };

      result = <div
        style={{ background: this.getThisColor('background')}}
        className={[
          styles.pTileItemImageCustom,
          ( this.state.hovering === true  ? this.iHoverZoomStyle : styles.imgHoverZoom )].join(" ")} >
        { createIconButton( this.props.imageUrl, '', null, '', defCommandIconStyles ) }
      </div>

      ;

    } else {

      result = <Image 
        className={[
          styles.pTileItemImageCustom, styles.themeBackground,
          ( this.state.hovering === true  ? this.iHoverZoomStyle : styles.imgHoverZoom )
        ].join(" ")} 
        src={this.props.imageUrl} 
        shouldFadeIn={true} 
        imageFit={imageOptionsGroup.getImgFit(this.props.setImgFit)}
        coverStyle={imageOptionsGroup.getImgCover(this.props.setImgCover)}      
      />;

    }

    return result;

  }
}
