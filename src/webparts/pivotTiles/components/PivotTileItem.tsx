import * as React from 'react';
import { Image, ImageFit, } from 'office-ui-fabric-react/lib/Image';

import { css, IImageProps, } from 'office-ui-fabric-react';

import styles from './PivotTileItem.module.scss';

//Category may need to be defined optionally here
//https://www.logicbig.com/tutorials/misc/typescript/interface-to-describe-object-with-optional-properties.html

export interface IPivotTileItemProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
  category:string;
}
export interface IPivotTileItemState {
  hovering: any;
  visible: any;
}
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

  public render(): JSX.Element {

    /*    main wrapper was this:
        <div className={[
          styles.pTileItemWrapper,
          this.state.visible === true  ? styles.pTileItemWrapperExpanded
          : this.state.visible === false  ? styles.pTileItemWrapperNotExpanded
          : ""
          ].join(" ")}>
    */


    return (
      <a href={this.props.href} 
         className={styles.pivotTiles}
         target="_top" 
         role="listitem" 
         onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}>
        <div className={ [styles.pTileItemWrapper, styles.pTileItemWrapperExpanded].join(" ")}>

          <Image className={styles.pTileItemImage} src={this.props.imageUrl} shouldFadeIn={true} imageFit={ImageFit.centerCover} />
          <div className={[styles.pTileItemHoverPanel, 
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator#Conditional_chains
            this.state.hovering === true  ? styles.pTileItemHoverPanelExpanded
            : this.state.hovering === false  ? styles.pTileItemHoverPanelNotExpanded
            : ""
            ].join(" ")}>
            <div className={styles.pTileItemTitle}>{this.props.title}</div>
            <div className={styles.pTileItemDesc}>{this.props.description}</div>
          </div>
        </div>
      </a>
    );
  }

}
