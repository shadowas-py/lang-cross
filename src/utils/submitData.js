/* eslint-disable import/prefer-default-export */

export function submitAndEmit(data, component) {
  const submitedData = [];
  data.forEach((element) => {
    submitedData.push(element.value);
  });
  component.$emit('submitedData', submitedData);
}
