interface ParamsTraverseCswGridInputs {
  getNext?: (arg: HTMLInputElement) => HTMLInputElement | null;
  stopCondition?: (arg: HTMLInputElement) => boolean;
  omitCondition?: (arg: HTMLInputElement) => boolean;
}

export function createCswGridIterator({ getNext = () => null }: ParamsTraverseCswGridInputs) {
  return function traverseCswGridInputs<T>(
    startEl: HTMLInputElement | null,
    callback: (target: HTMLElement, _args: T[]) => void,
    args: T[],
    { omitCondition, stopCondition }: ParamsTraverseCswGridInputs = {},
  ) {
    // console.log('IN ITERATOR', callback.name, getNext.name, stopCondition);
    let el = startEl;
    // console.log(callback.name, getNext.name);
    while (el && !stopCondition?.(el)) {
      // console.log(el,'EL')
      if (!omitCondition?.(el)) {
        callback(el, args);
      }
      el = getNext(el);
    }
  };
}

type ParamsMapCswGrid = Omit<ParamsTraverseCswGridInputs, 'omitCondition'>;
export function mapCswGrid<T>(
  startEl: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: T) => string,
  getNext: (el:HTMLInputElement) => HTMLInputElement | null,
  { stopCondition }: ParamsMapCswGrid = {},
) {
  let el = startEl;
  const mapArr: string[] = [];
  while (el && !stopCondition?.(el)) {
    mapArr.push(callback(el));
    el = getNext(el) || null;
  }
  return mapArr;
}
