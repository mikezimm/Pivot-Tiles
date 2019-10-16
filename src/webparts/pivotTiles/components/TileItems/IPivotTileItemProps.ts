//Category may need to be defined optionally here
//https://www.logicbig.com/tutorials/misc/typescript/interface-to-describe-object-with-optional-properties.html

export interface IPivotTileItemProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
  category:string[];
  setTab: string;
  listWebURL: string;
  listTitle: string;
  Id: string;
  
  options: string;
  color: string;
  imgSize: string;
  heroType: string;

  setRatio: string;
  setSize: string;
  setImgFit: string;
  setImgCover: string;
  target: string;
  
  parentCat?:string;

  imageWidth: number;
  imageHeight: number;
  textPadding: number;
}