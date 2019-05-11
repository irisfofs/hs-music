import {Rect} from './rect';

// TODO: Look if this exists in d3 code.
export interface D3Item {
  x?: number;
  displayX?: number;
  y?: number;
  baseY?: number;
}

export class Track implements D3Item {
  page: number;
  title: string;
  trackLink?: string;
  pageLink: string;
  album: string;
  albumLink: string;
  artist?: string;
  artistLink?: string;
  pageTitle: string;

  heightLevel: number = 0;

  rect?: Rect;
  // coverSize?: Size;

  x?: number;
  displayX?: number;
  y?: number;
  baseY?: number;

  constructor(trackJson: {
    page_link: string,
    album: string,
    album_link: string,
    artist?: string,
    artist_link?: string, page: number,
    title?: string,
    track_link?: string,
    page_title?: string,
  }) {
    this.page = trackJson.page;
    this.title = trackJson.title;
    this.trackLink = trackJson.track_link;
    this.pageLink = trackJson.page_link;
    this.album = trackJson.album;
    this.albumLink = trackJson.album_link;
    this.artist = trackJson.artist;
    this.artistLink = trackJson.artist_link;
    this.pageTitle = trackJson.page_title;
  }
}
