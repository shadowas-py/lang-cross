type writingOrientation = 'vertical' | 'horizontal';
type crosswordTileTag = 'INPUT' | 'TEXTAREA';
type Coordinate = [number, number];
export type CoordKey = `${number},${number}`;
interface clueTile {
  tagName: 'TEXTAREA';
  value: string;
  inputLocation?: Coordinate;
  inputOrientation?: writingOrientation;
}
interface inputTile {
  tagName: 'INPUT';
  value: string;
}

type CrosswordTile = inputTile | clueTile;
export interface ICrosswordData {
  width: number;
  height: number;
  tiles: {
    [coord: CoordKey]: CrosswordTile;
  };
}
export default class CrosswordData {
  width: number;

  height: number;

  tiles: {
    [coord: CoordKey]: CrosswordTile;
  };

  constructor({ width, height, tiles }: ICrosswordData) {
    this.width = width;
    this.height = height;
    if (tiles) {
      this.tiles = tiles;
    } else {
      this.tiles = {};
      for (let x = 1; x <= width; x += 1) {
        for (let y = 1; y <= height; y += 1) {
          this.tiles[`${x},${y}`] = { value: '', tagName: 'INPUT' };
        }
      }
    }
  }

  // updateTile(coord: CoordKey, target: HTMLInputElement | HTMLTextAreaElement) {
  //  const { value, tagName } = target;
  //  if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
  //    this.tiles[coord] = { tagName, value };
  //  }
  //  this.tiles[coord].value = value;
  //  (this.tiles[coord].tagName as string) = tagName;
  // }

  getTileAttr(coord: CoordKey, attribute: keyof CrosswordTile) {
    return this.tiles[coord]?.[attribute];
  }

  setTileAttr<K extends keyof CrosswordTile>(
    coord: CoordKey,
    key: K,
    value: CrosswordTile[K],
  ): void {
    this.tiles[coord][key] = value;
    console.log(this.tiles);
  }

  getState() {
    return this.tiles;
  }
  // setTileAttribute(
  //  coord: CoordKey,
  //  attribute: keyof CrosswordTile,
  //  newValue: CrosswordTile<T>,
  // ) {
  //  this.tiles[coord][attribute] = newValue;
  // }

  saveLocally() {
    window.localStorage.setItem('crosswordState', JSON.stringify(this));
  }
}
