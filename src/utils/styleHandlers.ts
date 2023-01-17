export function addStyle(element: HTMLElement, classNames: string[]) {
  // console.log('ADD', classNames, element?.id);
  classNames.forEach((cls) => {
    element.classList.add(cls);
  });
}
export function removeStyle(element: HTMLElement, classNames: string[]) {
  console.log('REMOVE', classNames, element?.id);
  classNames.forEach((cls) => {
    element.classList.remove(cls);
  });
}
