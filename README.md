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
npm install react-slick

```
# Configuration and Setup
## List based analytics
1. update strings in en-us.js for your analytics web and list.
*    **analyticsList**: "TilesCycleTesting",
*    **analyticsWeb**: "https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/",
2. update analytics save details in /src/services/createAnalytics.ts
    refer to: export function saveAnalytics
    update variables and static column names in your list to save information you want
    insure that "Everyone" can at least create items on your analytics list

## Pre-configured options
The web part has 3 built in configurations defined in the manifest.json file.
1. DEV - Developer web part which includes all CORP and TEAM definitions plus custom/test definitions.
2. CORP - Corporate standard tile definitions refering to corporate portals.
* Intended to have web part option that can make it easy to display slices of standard corporate libraries.
3. TEAM - Intended more for Team site with total customization features

* **AvailableListMapping.ts** contains all the list defintion choices and definitions for the webpart.
* **DevListMapping.ts** contains the list defintions used in the DEV Scenario. - pulls from AvailableListMapping.ts.
* **CorpListMapping.ts** contains all list defintions used in the CORP Scenario. - pulls from AvailableListMapping.ts.
* **TeamListMapping.ts** contains all list defintions used in the TEAM Scenario. - pulls from AvailableListMapping.ts.
* Make sure Corp and Team mappings have same spelling for the listChoice keys that are used in AvailableListMapping.ts.

* uses **scenario** prop in pre-configured properties to determine prop pane dropdown for list definition.
* eventually you could use the **secnario** prop to limit access to other parts of the property pane.
* possibly even limit which tile list/library urls could be used with different configurations.
### ToDos:
- [ ] Fix TestImages listDefinition with multiple **Others** categories.
- [ ] Add **maxDynamicSearchQty** property so that search only happens upon Enter when exceeding that quantity
- [ ] Add webPartProperty to **enableSearch**
- [ ] Create alternate **Hover** styles besides slide up panel
- [ ] Improve **Help** panel layout/look/feel
- [ ] **CTRL-ALT-SHFT-Click** on Icons does not go to correct Url:  /sites/Templates/Icons/sites/Forms/DispForm.aspx
        This seems to be because Site and Library are the same **Icons**
        This also impacts the **Links in help panel** (only on this list)
- [ ] Fix when Category columns are number arrays (like Author/ID)
- [ ] Add image **cover/fit** options to **DocumentCard** layout (Icons are very big and not correct aspect ratio)
- [ ] Add image **cover/fit/size** options in **Carousel**.   9/16 can sometimes just be to wide and tall on full page
- [ ] Improve **onHover** on **DocumentCard** layout


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
