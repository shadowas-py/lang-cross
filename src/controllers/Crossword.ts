type writingDirection = 'vertical' | 'horizontal'
export type Coordinate = [number, number];

export interface clueTile{
  tagName:'TEXTAREA'
  coord: Coordinate;
  clueTiles:[{
    value: string;
    inputLocation: Coordinate;
    inputDirection: writingDirection;
  }]
}

export interface inputTile{
  tagName: 'INPUT'
  value: string;
  coord: Coordinate;
}

export type CrosswordTile = inputTile | clueTile

export interface CrosswordData {
        width: number;
        height: number;
        tiles: Array<CrosswordTile>;
      }

export default class Crossword implements CrosswordData {
  width: number;

  height: number;

  tiles: Array<CrosswordTile>;

  constructor(width, height, tiles) {
    this.width = width;
    this.height = height;
    this.tiles = tiles;
  }
}
