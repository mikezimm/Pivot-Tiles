export interface IGridProps {
  items: IGridItem[];
}

export interface IGridState {
  items: IGridItem[];
}

export interface IGridItem {
  thumbnail: string;
  title: string;
  name: string;
  profileImageSrc: string;
  location: string;
  activity: string;
}
