type writingOrientation = 'vertical' | 'horizontal';

type crosswordTileTag = 'INPUT' | 'TEXTAREA'
type Coordinate = [number, number];
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

export default class CrosswordState {
  constructor(public width: number, public height: number, public tiles : {
          [coord: string]:CrosswordTile
        }) {
    console.log(this);
  }

  update(coord:string, target:HTMLInputElement) {
    console.log(target.value);
    const { value, tagName } = target;
    console.log(this.tiles);
    debugger;
    this.tiles[coord].value = value;
    (this.tiles[coord].tagName as string) = tagName;
    console.log(this);
  }

  save() {
    window.localStorage.setItem('crosswordState', JSON.stringify(this));
  }

  getTileDataByCoord(coord:Coordinate) {
    return this.tiles[coord.toString()];
  }
}

export interface CrosswordData {
        width: number;
        height: number;
        tiles: {
          [coord: string]:CrosswordTile
        }
      }
