export function selectNextNthElement(el:HTMLInputElement):HTMLInputElement | null {
  const colNum = Number(el.id.split('-')[0]) - 1;
  return el.parentElement?.nextElementSibling?.children[colNum] as HTMLInputElement | null;
}

export function selectNextSibling(el:HTMLInputElement):HTMLInputElement | null {
  return el.nextElementSibling as HTMLInputElement | null;
}

export function selectPrevNthElement(el:HTMLInputElement):HTMLInputElement | null {
  const colNum = Number(el.id.split('-')[0]) - 1;
  return el.parentElement?.previousElementSibling?.children[colNum] as HTMLInputElement | null;
}

export function selectPrevSibling(el:HTMLInputElement):HTMLInputElement | null {
  return el.previousElementSibling as HTMLInputElement | null;
}
