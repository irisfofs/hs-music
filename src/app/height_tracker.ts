import {Rect} from './rect';
import {D3Item, Track} from './track';

export class HeightTracker {
  items = [];

  tracks: Track[] = [];

  itemWidth: number;

  constructor(itemWidth: number) {
    this.itemWidth = itemWidth;
  }

  testHeight2(track: Track) {
    // Get the cover size from the track.
    // const coverSize = track.coverSize;

    // const rect = Rect.createFromPositionAndSize(new Coordinate(0, 0),
    // coverSize);

    // Find first available height at that point. Maybe we could even store
    // this in a data structure rather than finding it each time.
    //
    // Use a Rect to store the bounds of the covers. Maybe add Rect to the
    // Track class.
    //
    // Are we updating the item's rect each time? Are we re-scanning for
    // conflicts whenever we update it?

    let firstAvailableHeight = 0;  // TODO: What is a good start?
    for (const t of this.tracks) {
      // if (track.rect.intersects(t.rect)) {
      //   firstAvailableHeight = Math.max(firstAvailableHeight, t.y)
      // }
    }
  }

  testHeight(x: number): {index: number, height: number} {
    // binary search
    const insert_at = this.binarySearch(x, 0, this.items.length - 1);

    // now traverse left and right and see how many are within 'range'
    const blocked_heights = new Set();
    for (let i = insert_at - 1; i >= 0 && i < this.items.length; i--) {
      const item = this.items[i];
      if (x - item.displayX > this.itemWidth) {
        break;
      }
      blocked_heights.add(item.heightLevel);
    }

    for (let i = insert_at; i >= 0 && i < this.items.length; i++) {
      const item = this.items[i];
      if (item.displayX - x > this.itemWidth) {
        break;
      }
      blocked_heights.add(item.heightLevel);
    }

    // get the first not-blocked height
    let height = 0;
    do {
      height *= -1;  // flip sign again
      height++;
      if (!blocked_heights.has(height)) {
        break;
      }
      height *= -1;  // flip sign
    } while (blocked_heights.has(height));

    return {index: insert_at, height};
  }

  addTrack(track: Track): number {
    const testXs = [
      track.x,
    ];

    let best = Number.POSITIVE_INFINITY;
    let bestIndex = -1;
    for (const x of testXs) {
      const potential = this.testHeight(x);

      if (Math.abs(potential.height) < Math.abs(best)) {
        track.displayX = x;
        track.heightLevel = potential.height;
        best = potential.height;
        bestIndex = potential.index;
      }
    }

    // finally insert this track at the index
    this.items.splice(bestIndex, 0, track);

    return track.heightLevel;
  }


  private binarySearch(x: number, start: number, end: number) {
    if (this.items.length === 0) {
      return 0;
    }
    // end case: one or two element range
    if (x < this.items[start].displayX) {
      return start;  // insert before start
    } else if (x > this.items[end].displayX) {
      return end + 1;  // insert after end
    }

    if (start === end || end - start === 1) {
      return start + 1;  // insert right after start
    }

    const midpoint = Math.floor((start + end) / 2);
    if (x <= this.items[midpoint].displayX) {
      return this.binarySearch(x, start, midpoint);
    }
    return this.binarySearch(x, midpoint + 1, end);
  }
}
