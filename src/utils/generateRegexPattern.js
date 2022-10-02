/* eslint-disable import/prefer-default-export */
export function generateRegexPattern(charList) {
  let pattern = '';
  charList.forEach((ch) => {
    pattern += ch || '.';
  });
  pattern = new RegExp(pattern);
  console.log(pattern);
  return pattern;
}
