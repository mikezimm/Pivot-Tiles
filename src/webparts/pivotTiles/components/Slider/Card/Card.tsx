import * as React from 'react';
import { ICardProps } from './ICardProps';
import { ICardState } from './ICardState';
import styles from './Card.module.scss';

export default class Card extends React.Component<ICardProps, ICardState> {

  constructor(props: ICardProps, state: ICardState) {
    super(props);

    this.state = {
      hovering: 10,
    };
  }

  public mouseOver(event): void {
    this.setState({ hovering: true });
    console.log('mouseOver: ' + this.props.listItem.title);
  }

  public mouseOut(event): void {
    this.setState({ hovering: false });
    console.log('mouseOut: ' + this.props.listItem.title);
  }

  public render(): React.ReactElement<ICardProps> {
    return (
      <div className={styles.card}>
        <div className={styles.wrapper}>
          <img src={this.props.listItem.imageUrl} className={styles.image}
            onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
          />
          <a href="#" className={styles.url} >
            <h3 className={styles.title}>{this.props.listItem.title}</h3>
          </a>
          <p className={styles.description}>{this.props.listItem.description}</p>
        </div>
      </div>
    );
  }
}
