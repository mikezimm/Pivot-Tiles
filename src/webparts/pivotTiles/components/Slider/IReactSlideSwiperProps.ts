
import { IPivotTileItemProps } from "../TileItems/IPivotTileItemProps";

export interface IReactSlideSwiperProps {
  enableNavigation: boolean;
  enablePagination: boolean;
  enableAutoplay: boolean;
  delayAutoplay: number;
  disableAutoplayOnInteraction: boolean;
  slidesPerView: string;
  slidesPerGroup: string;
  spaceBetweenSlides: string;
  enableGrabCursor: boolean;
  enableLoop: boolean;
  onHoverZoom: string;
  listItems: Array<IPivotTileItemProps>;

}
