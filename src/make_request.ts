import fetch from 'node-fetch';

export const makeRequest = async (postUri: string) => {
  const response = await fetch(`https://api.datamuse.com/${postUri}`);
  return response.json();
};
