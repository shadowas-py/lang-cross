/* eslint-disable import/prefer-default-export */
export function generateRegexPattern(charList:string[]) {
  let pattern: string|RegExp = '';
  charList.forEach((ch:string) => {
    pattern += ch || '.';
  });
  pattern = new RegExp(pattern);
  return pattern;
}
