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
  // eslint-disable-next-line no-useless-constructor
  constructor(public width: number, public height: number, public tiles : {
          [coord: string]:CrosswordTile
        }) {
    console.log(this);
  }

  static fromComponent(width: number, height: number, cswEl: HTMLElement) {
    // Change this if it will be more than one element inside one tile
    const tilesList = Array.from(cswEl.querySelectorAll('td > *:first-child'));
    const tilesData: {[coord: string]: CrosswordTile} = {};
    tilesList.forEach((el: Element) => {
      const inputEl = el as HTMLInputElement;
      const coord = inputEl.getAttribute('coord');
      if (typeof coord === 'string') {
        tilesData[coord] = {
          tagName: inputEl.tagName as crosswordTileTag,
          value: inputEl.value,
        };
      } else {
        console.error(coord, ' coord must be string ');
      }
    });
    return new CrosswordState(width, height, tilesData);
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
}

export interface CrosswordData {
        width: number;
        height: number;
        tiles: {
          [coord: string]:CrosswordTile
        }
      }
