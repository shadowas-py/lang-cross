export function selectNextNthElement(el) {
  if (el && el.parentElement.nextElementSibling) {
    const colNum = el.id.split('-')[0] - 1;
    return el.parentElement.nextElementSibling.children[colNum];
  }
  return null;
}

export function selectNextSibling(el) {
  if (el) {
    return el.nextElementSibling;
  }
  return null;
}

export function selectPrevNthElement(el) {
  if (el && el.parentElement.previousElementSibling) {
    const colNum = el.id.split('-')[0] - 1;
    return el.parentElement.previousElementSibling.children[colNum];
  }
  return null;
}

export function selectPrevSibling(el) {
  if (el) {
    return el.previousElementSibling;
  }
  return null;
}
