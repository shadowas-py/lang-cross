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
  width: number;

  height: number;

  tiles: {
          [coord: string]:CrosswordTile
        };

  constructor(width: number, height: number, cswEl: HTMLElement) {
    this.width = width;
    this.height = height;
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
        console.error('coord cannot be: ', typeof coord);
      }
    });
    this.tiles = tilesData;
  }

  update(coord:string, target:HTMLInputElement) {
    const { value, tagName } = target;
    this.tiles[coord].value = value;
    (this.tiles[coord].tagName as string) = tagName;
  }

  save() {
    window.localStorage.setItem('crosswordState', JSON.stringify(this));
  }
}

// interface CrosswordData {
//        width: number;
//        height: number;
//        tiles: {
//          [coord: string]:CrosswordTile
//        }
//      }
