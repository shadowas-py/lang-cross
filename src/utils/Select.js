export function selectNextNthElement(el) {
  const colNr = el.id.split('-')[0] - 1;
  if (el.parentElement.nextElementSibling) {
    return el.parentElement.nextElementSibling.children[colNr];
  }
  return null;
}

export function selectNextSibling(el) {
  return el.nextElementSibling;
}
