// export function traverseCswGrid(
//  startElement: HTMLInputElement | null,
//  callback: (target: HTMLInputElement, arg: string[]) => void,
//  getNextEl: (arg: HTMLInputElement) => HTMLInputElement | null,
//  args: string[],
//  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
// ) {
//  let target = startElement;
//  while (target && target?.tagName === 'INPUT' && !stopCondition(target)) {
//    callback(target, args);
//    target = getNextEl(target);
//  }
// }

export function mapCswGrid(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: unknown) => string,
  getNextEl: (arg: HTMLInputElement) => HTMLInputElement | null,
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
) {
  let nextEl = startElement;
  const _data: string[] = [];
  while (nextEl && !stopCondition(nextEl)) {
    _data.push(callback(nextEl));
    nextEl = getNextEl(nextEl);
  }
  return _data;
}

export function traverseCswGridInputs<T>(
  startElement: HTMLInputElement|null,
  callback: (target: HTMLElement, _args: T[]) => void,
  getNextEl: (arg: HTMLInputElement) => HTMLInputElement | null,
  args: T[],
  runCondition: (arg?:HTMLInputElement)=>boolean = () => true,
  cbCondition: (arg?:HTMLInputElement)=>boolean = () => true,
):void {
  let target: HTMLInputElement | null = startElement;
  while (target && target instanceof HTMLInputElement && runCondition(target)) {
    if (cbCondition(target)) {
      callback(target, args);
    }
    target = getNextEl(target);
  }
}
