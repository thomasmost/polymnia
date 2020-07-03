import fetch from 'node-fetch';

type WordMatch = {
  word: string;
  score: number;
  tags?: [];
};

export const makeRequest = async (postUri: string) => {
  const response = await fetch(`https://api.datamuse.com/${postUri}`);
  const results = await response.json();
  return results as WordMatch[];
};
