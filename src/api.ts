import * as querystring from 'querystring';

import { makeRequest } from "./make_request"


type apiType = 'words' | 'suggest'

const apiEndpoint: Record<apiType, string> = {
  words: '/words',
  suggest: '/sug'
}

export const suggest = async (input: string) => {
  if (!input || input.length === 0) {
    throw Error('Must specify an input string')
  }
  const uri = `${apiEndpoint.suggest}?s=${input}`
  return makeRequest(uri);
}

type WordsApiParams = {
  meansLike?: string;
  rawQuery?: string;
  rhymesWith?: string;
  soundsLike?: string;
  startsWith?: string;
  endsWith?: string;
  wildCount?: number;
}

type WordsQuery =
  'ml'
| 'sl'
| 'sp'
| 'rel_rhy'
| 'rel_jjb'
| 'rel_jja'
| 'lc'
| 'rel_trg';

export const words = async (params: WordsApiParams) => {
  if (!params || Object.keys(params).length === 0) {
    throw Error('Must specify at least one parameter')
  }
  const {
    rawQuery,
    meansLike,
    rhymesWith,
    soundsLike,
    startsWith,
    endsWith,
    wildCount
  } = params;

  if (rawQuery) {
    if (Object.keys(params).length > 1) {
      throw Error('Cannot specify any additional params when making a rawQuery')
    }
    const uri = `${apiEndpoint.words}${rawQuery}`
    return makeRequest(uri)
  }
  const query: Partial<Record<WordsQuery, string>> = {};

  if (meansLike) {
    query.ml = meansLike;
  }
  if (rhymesWith) {
    query.rel_rhy = rhymesWith;
  }
  if (soundsLike) {
    query.sl = soundsLike;
  }
  if (startsWith || endsWith || wildCount) {
    let wild = '*';
    if (wildCount) {
      if (wildCount <= 0 || !Number.isInteger(wildCount)) {
        throw Error('wildCount must be a positive integer');
      }
      wild = '?';
      while (wild.length < wildCount) {
        wild += '?';
      }
    }
    query.sp = `${startsWith || ''}${wild}${endsWith || ''}`
  }
  const uri = apiEndpoint.words + querystring.stringify(query);
  return makeRequest(uri);
}