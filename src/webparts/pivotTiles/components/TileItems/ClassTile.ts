import { IPivotTileItemProps } from './IPivotTileItemProps';

//https://www.youtube.com/watch?v=4nsGhYjfRsw

export class ClassTile {

    public imageUrl: string;
    public title: string;
    public description: string;
    public href: string;
    public category:string;
    constructor(item: IPivotTileItemProps ){
        this.title = item.title
        this.imageUrl = item.imageUrl
        this.description = item.description
        this.href = item.href
        this.category = item.category

    }

}