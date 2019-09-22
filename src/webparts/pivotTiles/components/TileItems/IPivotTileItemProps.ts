//Category may need to be defined optionally here
//https://www.logicbig.com/tutorials/misc/typescript/interface-to-describe-object-with-optional-properties.html

export interface IPivotTileItemProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
  category:string[];
  parentCat?:string;
}