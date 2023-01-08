type writingOrientation = 'vertical' | 'horizontal';

type Coordinate = [number, number];

interface clueTile {
  tagName: 'TEXTAREA';
  value: string;
  inputLocation: Coordinate;
  inputOrientation: writingOrientation;
}

interface inputTile {
  tagName: 'INPUT';
  value: string;
}

type CrosswordTile = inputTile | clueTile;

// interface CrosswordData {
//        width: number;
//        height: number;
//        tiles: {
//          [coord: string]:CrosswordTile
//        }
//      }

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
    const tilesData: any = {};
    tilesList.forEach((el: any) => {
      const coord = el.getAttribute('coord');
      tilesData[coord] = { tagName: el.tagName, value: el.value };
    });

    this.tiles = tilesData;
  }

  update(coord:string, target:HTMLInputElement) {
    // TO REFACTOR
    const { value, tagName } = target;
    this.tiles[coord].value = value;
    (this.tiles[coord].tagName as string) = tagName;
    console.log(this.tiles);
  }

  save() {
    window.localStorage.setItem('crosswordState', JSON.stringify(this));
    console.log('crosswordState', JSON.stringify(this.tiles));
  }
}
