type writingOrientation = 'vertical' | 'horizontal';
export type crosswordTileTag = 'INPUT' | 'TEXTAREA';
type Coordinate = [number, number];
export type CoordKey = `${number},${number}`;
interface clueTile {
  tileType : 'CLUE';
  tagName: 'TEXTAREA';
  value: string;
  inputLocation?: Coordinate;
  inputOrientation?: writingOrientation;
}
interface inputTile {
  tileType : 'INPUT';
  tagName: 'INPUT';
  value: string;
}

export type CrosswordTile = inputTile | clueTile;
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
          this.tiles[`${x},${y}`] = { value: '', tagName: 'INPUT', tileType: 'INPUT' };
        }
      }
    }
  }

  getTileAttr(coord: CoordKey, attribute: keyof CrosswordTile) {
    return this.tiles[coord]?.[attribute];
  }

  setTileAttr<K extends keyof CrosswordTile>(
    coord: CoordKey,
    key: K,
    value: CrosswordTile[K],
  ): void {
    this.tiles[coord][key] = value;
  }

  getState() {
    return this.tiles;
  }

  toogleTileType(coord: CoordKey) {
    if (this.getTileAttr(coord, 'tileType') === 'INPUT') {
      this.setTileAttr(coord, 'tileType', 'CLUE');
    } else {
      this.setTileAttr(coord, 'tileType', 'INPUT');
      this.setTileAttr(coord, 'value', '');
    }
  }

  saveLocally() {
    window.localStorage.setItem('crosswordState', JSON.stringify(this));
  }
}