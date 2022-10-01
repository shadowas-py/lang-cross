export function selectNextNthElement(el) {
  if (el && el.parentElement.nextElementSibling) {
    const colNr = el.id.split('-')[0] - 1;
    return el.parentElement.nextElementSibling.children[colNr];
  }
  return null;
}

export function selectNextSibling(el) {
  if (el) {
    return el.nextElementSibling;
  }
  return null;
}
