export type EventWithTarget = MouseEvent & { target: HTMLElement };
export type Coordinate = [number, number];
export type TileTagName = 'INPUT' | 'TEXTAREA';

export interface CrosswordTileData {
        value: string;
        tagName: TileTagName;
      }

export interface CrosswordData {
        width: number;
        height: number;
        tiles: Array<CrosswordTileData>;
      }
