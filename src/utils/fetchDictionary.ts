export default async function fetchDictionary(source: string): Promise<string[]> {
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
  } catch (error) {
    if (error instanceof Error) console.error('ERROR:', error.message);
    return [];
  }
}
