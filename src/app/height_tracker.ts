import {D3Item, Track} from './track';

export class HeightTracker {
  items = [];

  itemWidth: number;

  constructor(itemWidth: number) {
    this.itemWidth = itemWidth;
  }

  getHeight(track: Track) {
    // use the stored x
    console.log(`${track.x}: ${track.title}`);
    // binary search
    const insert_at = this.binarySearch(track, 0, this.items.length - 1);

    // now traverse left and right and see how many are within 'range'
    const blocked_heights = new Set();
    for (let i = insert_at - 1; i >= 0 && i < this.items.length; i--) {
      if (track.x - this.items[i].x > this.itemWidth) {
        break;
      }
      blocked_heights.add(this.items[i].heightLevel);
    }

    for (let i = insert_at; i >= 0 && i < this.items.length; i++) {
      if (this.items[i].x - track.x > this.itemWidth) {
        break;
      }
      blocked_heights.add(this.items[i].heightLevel);
    }

    // get the first not-blocked height
    let potential_height = 0;
    do {
      potential_height *= -1;  // flip sign again
      potential_height++;
      if (!blocked_heights.has(potential_height)) {
        break;
      }
      potential_height *= -1;  // flip sign
    } while (blocked_heights.has(potential_height));

    track.heightLevel = potential_height;

    // finally insert this track at the index
    this.items.splice(insert_at, 0, track);

    return track.heightLevel;
  }

  private binarySearch(track: D3Item, start: number, end: number) {
    if (this.items.length === 0) {
      return 0;
    }
    // end case: one or two element range
    if (track.x < this.items[start].x) {
      return start;  // insert before start
    } else if (track.x > this.items[end].x) {
      return end + 1;  // insert after end
    }

    if (start === end || end - start === 1) {
      return start + 1;  // insert right after start
    }

    const midpoint = Math.floor((start + end) / 2);
    if (track.x <= this.items[midpoint].x) {
      return this.binarySearch(track, start, midpoint);
    }
    return this.binarySearch(track, midpoint + 1, end);
  }
}
