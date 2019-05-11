/**
 * A reimplementation of a rectangle because working with the Closure library is
 * terrible for some reason. Definitely not bitter or anything.
 */
export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  intersects(other: Rect): boolean {
    return this.x < other.x + other.w && this.x + this.w > other.x &&
        this.y < other.y + other.h && this.y + this.h > other.y;
  }
}
