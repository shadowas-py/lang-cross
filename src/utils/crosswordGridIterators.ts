interface ParamsTraverseCswGridInputs {
  getNext: (arg: HTMLInputElement) => HTMLInputElement | null;
  runCondition: (arg: HTMLInputElement) => boolean;
  omitCondition: (arg: HTMLInputElement) => boolean;
}
type ParamsMapCswGrid = Omit<ParamsTraverseCswGridInputs, 'omitCondition'>

export function traverseCswGridInputs<T>(
  startEl: HTMLInputElement | null,
  callback: (target: HTMLElement, _args?: T[]) => void,
  args: T[],
  self: ParamsTraverseCswGridInputs = {
    getNext: () => null,
    runCondition: () => true,
    omitCondition: () => false,
  },
) {
  let el = startEl;
  while (el && self.runCondition(el)) {
    if (!self.omitCondition(el)) {
      callback(el, args);
    }
    el = self.getNext(el);
  }
}

export function mapCswGrid<T>(
  startEl: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: T) => string,
  self: ParamsMapCswGrid = {
    getNext: () => null,
    runCondition: () => true,
  },
) {
  let el = startEl;
  const mapArr: string[] = [];
  while (el && self.runCondition(el)) {
    mapArr.push(callback(el));
    el = self.getNext(el);
  }
  return mapArr;
}
