export function selectNextNthElement(el: HTMLInputElement): HTMLInputElement | null {
  const colNr = Number(el.id.split('-')[0]) - 1;
  return el.parentElement?.parentElement?.nextElementSibling?.children[
    colNr
  ].firstElementChild as HTMLInputElement | null;
}

export function selectNextSibling(el: HTMLInputElement): HTMLInputElement | null {
  return el.parentElement?.nextElementSibling?.firstElementChild as HTMLInputElement | null;
}

export function selectPrevNthElement(el: HTMLInputElement): HTMLInputElement | null {
  const colNum = Number(el.id.split('-')[0]) - 1;
  return el.parentElement?.previousElementSibling?.children[colNum] as HTMLInputElement | null;
}

export function selectPrevSibling(el: HTMLInputElement): HTMLInputElement | null {
  console.log('SELECT PREV');
  return el.parentElement?.previousElementSibling?.firstElementChild as HTMLInputElement | null;
}