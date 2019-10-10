import * as React from 'react';
import { Image, ImageFit, } from 'office-ui-fabric-react/lib/Image';

import { css, IImageProps, } from 'office-ui-fabric-react';

import styles from './PivotTileItem.module.scss';
import tUtils from './utilTiles'

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
    if (event.shiftKey) {
      if (event.altKey) {
        if (event.ctrlKey) {      
          alert("ctrKey is pressed");
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
              ].join(" ")}>
              <div className={iStyles.iTitle}>{this.props.title}</div>
              <div className={styles.pTileItemDesc}>{this.props.description}</div>
            </div>
          </div>
        </a>
      </div>

    );
  }

}
