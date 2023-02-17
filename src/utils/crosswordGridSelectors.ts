export function selectNextNthElement(el: HTMLElement| null): HTMLInputElement | null {
  const colNr = Number(el?.id.split('-')[0]) - 1;
  const nextEl = el?.parentElement?.parentElement?.nextElementSibling?.children[
    colNr
  ].firstElementChild;
  return (nextEl instanceof HTMLInputElement) ? nextEl : null;
}

export function selectNextSibling(el: HTMLElement|null): HTMLInputElement | null {
  const nextEl = el?.parentElement?.nextElementSibling?.firstElementChild;
  return (nextEl instanceof HTMLInputElement) ? nextEl : null;
}

export function selectPrevNthElement(el: HTMLElement|null): HTMLInputElement | null {
  const colNum = Number(el?.id.split('-')[0]) - 1;
  const prevEl = el?.parentElement?.previousElementSibling?.children[colNum];
  return (prevEl instanceof HTMLInputElement) ? prevEl : null;
}

export function selectPrevSibling(el: HTMLElement|null): HTMLInputElement | null {
  const prevEl = el?.parentElement?.previousElementSibling?.firstElementChild;
  return (prevEl instanceof HTMLInputElement) ? prevEl : null;
}
