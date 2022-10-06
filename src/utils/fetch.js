// eslint-disable-next-line consistent-return
export default async function fetchDictionary(source) {
  try {
    const response = await fetch(source);
    if (response.status !== 200) {
      throw new Error(`Can't fetch data from ${source}`);
    }
    const rawText = await response.text();
    const res = rawText
      .split('\n')
      .map((word) => word.trim())
      .filter((word) => word.length > 1);
    return res;
  } catch (e) {
    console.error('ERROR:', e.message);
    return [];
  }
}
