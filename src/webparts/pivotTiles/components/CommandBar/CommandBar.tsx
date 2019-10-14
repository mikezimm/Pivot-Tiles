import * as React from 'react';

import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";

import styles from './CommandBar.module.scss';
//import tUtils from './utilTiles'

import { ICommandBarProps } from './ICommandBarProps'
import { ICommandBarState } from './ICommandBarState'
import Utils from './utils'

export default class MyCommandBar extends React.Component<ICommandBarProps, ICommandBarState> {

    constructor(props: ICommandBarProps, state: ICommandBarState) {
        super(props);
    
        this.state = {
          hovering: 10,
          visible:10
        };
/*
        console.log('Constructor: MyCommandBar');
        console.log(this.props);
        console.log(this.state);
*/
      }

    public render(): JSX.Element {

      const _utils = new Utils();
//      let ttips = new this.props.toggleTips();
//      let farItems = _utils.getFarItems(ttips);
      let farItems = _utils.getFarItems();

        return (
          <div className={styles.container}>
            <CommandBar 
              items={Utils.getMainItems()}
              farItems={this.getFarItems()}
            />
          </div>
        );
      }

      private getFarItems() {
        return [
          { key: 'mini',    name: '',    ariaLabel: 'Minimize',    iconProps: { iconName: 'ChromeMinimize' },
            onClick: () => this.props.minimizeTiles()
          },
          { key: 'tips',    name: '',     ariaLabel: 'Tips',        iconProps: { iconName: 'Help' },
            onClick: () => this.props.toggleTips()
          },
        ]
      }



      private getItems = () => {
          return []
      }

      private getOverlflowItems = () => {
          return []
      }
      private getItemsExample = () => {
        return [
          {
            key: 'newItem',
            name: 'New',
            cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
            iconProps: {
              iconName: 'Add'
            },
            ariaLabel: 'New',
            subMenuProps: {
              items: [
                {
                  key: 'emailMessage',
                  name: 'Email message',
                  iconProps: {
                    iconName: 'Mail'
                  },
                  ['data-automation-id']: 'newEmailButton'
                },
                {
                  key: 'calendarEvent',
                  name: 'Calendar event',
                  iconProps: {
                    iconName: 'Calendar'
                  }
                }
              ]
            }
          },
          {
            key: 'upload',
            name: 'Upload',
            iconProps: {
              iconName: 'Upload'
            },
            href: 'https://dev.office.com/fabric',
            ['data-automation-id']: 'uploadButton'
          },
          {
            key: 'share',
            name: 'Share',
            iconProps: {
              iconName: 'Share'
            },
            onClick: () => console.log('Share')
          },
          {
            key: 'download',
            name: 'Download',
            iconProps: {
              iconName: 'Download'
            },
            onClick: () => console.log('Download')
          }
        ];
      };
    
      private getOverlflowItemsExample = () => {
        return [
          {
            key: 'move',
            name: 'Move to...',
            onClick: () => console.log('Move to'),
            iconProps: {
              iconName: 'MoveToFolder'
            }
          },
          {
            key: 'copy',
            name: 'Copy to...',
            onClick: () => console.log('Copy to'),
            iconProps: {
              iconName: 'Copy'
            }
          },
          {
            key: 'rename',
            name: 'Rename...',
            onClick: () => console.log('Rename'),
            iconProps: {
              iconName: 'Edit'
            }
          }
        ];
      };
    
      private getFarItemsExample = () => {
        return [
          {
            key: 'sort',
            name: 'Sort',
            ariaLabel: 'Sort',
            iconProps: {
              iconName: 'SortLines'
            },
            onClick: () => console.log('Sort')
          },
          {
            key: 'tile',
            name: 'Grid view',
            ariaLabel: 'Grid view',
            iconProps: {
              iconName: 'Tiles'
            },
            iconOnly: true,
            onClick: () => console.log('Tiles')
          },
          {
            key: 'info',
            name: 'Info',
            ariaLabel: 'Info',
            iconProps: {
              iconName: 'Info'
            },
            iconOnly: true,
            onClick: () => console.log('Info')
          }
        ];
      };
  }
  