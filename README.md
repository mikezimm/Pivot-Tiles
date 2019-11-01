## pivot-tiles

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

### General Notes
* Copied src\common from https://github.com/SharePoint/sp-dev-fx-controls-react.git
* Copied src\services from https://github.com/SharePoint/sp-dev-fx-controls-react.git

### Additional npm installs
```
npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save
npm install @microsoft/sp-listview-extensibility   (Required from copying services folder from react repo)
npm install @pnp/sp  ( Required to get list items from web )
npm install --save @pnp/polyfill-ie11 ( Required for Internet Explorer Expand/Select calls )
npm install swiper ( Required for React Swipe gallery )
    close VSCode and restart to see folder
    change import 
        from  @import '~swiper/dist/css/swiper.min.css';
        to:  @import '~swiper/css/swiper.min.css';
        from  const Swiper: any = require('swiper/dist/js/swiper.min');
        to  const Swiper: any = require('swiper/js/swiper.min');
npm install @pnp/spfx-controls-react --save --save-exact  (to test using [react carousel](https://sharepoint.github.io/sp-dev-fx-controls-react/controls/Carousel/))

```
### Create log:
* Copied prop pane strings/interface/props from SPFx Properties Formulas Apr 30 - Editable.xlsx (5 places).
* Removed un-neccessary modules from common and services folder that were causing serve errors.
* Tested in dev tenant - Props Pane works :)
* Added default prop pane values in webpart.manifset.json.  NOTE you do need to re-add webpart to page to see these updates.
* Broke props pane into 3 pages.  About, Main Settings, Column settings.
* Importing PropertyPaneLabel with BaseClientSideWebPart
* Created component folders for PivotTiles and TileItems
* Added public onInit():Promise<void> {  ( inside base webpart class )

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
