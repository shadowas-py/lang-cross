/* eslint-disable import/prefer-default-export */

export function submitAndEmit(data, obj) {
        const submitedData = [];
        data.forEach((element) => {
                submitedData.push(element.value);
        });
        obj.$emit('submitedData', submitedData);
}
