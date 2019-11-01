import * as React from 'react';
import { ICardProps } from './ICardProps';
import { ICardState } from './ICardState';
import styles from './Card.module.scss';
import iStyles from '../../TileItems/PivotTileItem.module.scss';
import tUtils from '../../TileItems/utilTiles';

export default class Card extends React.Component<ICardProps, ICardState> {

  private iHoverZoomStyle = tUtils.getOnHoverStyle(this.props.onHoverZoom);

  constructor(props: ICardProps, state: ICardState) {
    super(props);

    this.state = {
      hovering: 10,
    };
  }

  public mouseOver(event): void {
    this.setState({ hovering: true });
  }

  public mouseOut(event): void {
    this.setState({ hovering: false });
  }

  public render(): React.ReactElement<ICardProps> {

    return (
      <div className={styles.card}>
        <div className={styles.wrapper}>
          <div 
            className={[ 'ms-Image',
              iStyles.pTileItemImageCustom,
              ( this.state.hovering === true  ? this.iHoverZoomStyle : iStyles.imgHoverZoom ) ,'root-151'
            ].join(" ")} 
          >
            <img src={this.props.listItem.imageUrl}
              className={ styles.image }
              onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
            />
          </div>

          <a href="#" className={styles.url} >
            <h3 className={styles.title}>{this.props.listItem.title}</h3>
          </a>
          <p className={styles.description}>{this.props.listItem.description}</p>
        </div>
      </div>
    );
  }
}
