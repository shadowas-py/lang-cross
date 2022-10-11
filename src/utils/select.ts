export function selectNextNthElement(el:HTMLInputElement):HTMLInputElement | null {
  if (el.parentElement && el.parentElement.nextElementSibling) {
    const colNum = Number(el.id.split('-')[0]) - 1;
    return el.parentElement.nextElementSibling.children[colNum] as HTMLInputElement;
  }
  return null;
}

export function selectNextSibling(el:HTMLInputElement):HTMLInputElement | null {
  return el.nextElementSibling as HTMLInputElement || null;
}
