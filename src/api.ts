import * as querystring from 'querystring';

import { makeRequest } from './make_request';

type apiType = 'words' | 'suggest';

const apiEndpoint: Record<apiType, string> = {
  words: '/words?',
  suggest: '/sug?',
};

export const suggest = async (input: string) => {
  if (!input || input.length === 0) {
    throw Error('Must specify an input string');
  }
  const uri = `${apiEndpoint.suggest}s=${input}`;
  return makeRequest(uri);
};

type Metadata = 'definitions' | 'parts_of_speech' | 'syllables' | 'pronunciation' | 'frequency';

type WordsApiParams = {
  leftContext?: string;
  rightContext?: string;
  maxResults?: number;
  meansLike?: string;
  metadata?: Partial<Record<Metadata, boolean>>;
  oftenFollows?: string;
  oftenDescribedAs?: string;
  oftenDescribes?: string;
  rawQuery?: string;
  rhymesWith?: string;
  soundsLike?: string;
  startsWith?: string;
  endsWith?: string;
  topics?: string[];
  wildCount?: number;
};

type WordsQuery = 'ml' | 'max' | 'sl' | 'sp' | 'rel_rhy' | 'rel_jjb' | 'rel_jja' | 'lc' | 'rc' | 'rel_trg' | 'topics' | 'md';

export const words = async (params: WordsApiParams) => {
  if (!params || Object.keys(params).length === 0) {
    throw Error('Must specify at least one parameter');
  }
  const {
    leftContext,
    rightContext,
    maxResults,
    metadata,
    meansLike,
    oftenDescribedAs,
    oftenDescribes,
    oftenFollows,
    rawQuery,
    rhymesWith,
    soundsLike,
    startsWith,
    endsWith,
    topics,
    wildCount,
  } = params;

  if (rawQuery) {
    if (Object.keys(params).length > 1) {
      throw Error('Cannot specify any additional params when making a rawQuery');
    }
    const rawUri = `${apiEndpoint.words}${rawQuery}`;
    return makeRequest(rawUri);
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
    query.sp = `${startsWith || ''}${wild}${endsWith || ''}`;
  }
  if (oftenDescribes || oftenDescribedAs || oftenFollows) {
    let usageQueries = 0;
    if (oftenDescribedAs) {
      query.rel_jja = oftenDescribedAs;
      usageQueries++;
    }
    if (oftenDescribes) {
      query.rel_jjb = oftenDescribes;
      usageQueries++;
    }
    if (oftenFollows) {
      query.lc = oftenFollows;
      usageQueries++;
    }
    if (usageQueries > 1) {
      throw Error('You may only specify one usage query at a time (oftenDescribedAs, oftenDescribes, oftenFollows)');
    }
  }
  if (topics) {
    if (topics.length >= 1) {
      if (topics.length > 5) {
        throw Error('No more than 5 topics may be specified');
      }
      query.topics = topics.join(',');
    }
  }
  if (leftContext) {
    query.lc = leftContext;
  }
  if (rightContext) {
    query.rc = rightContext;
  }
  if (metadata) {
    let md = '';
    if (metadata.definitions) {
      md += 'd';
    }
    if (metadata.parts_of_speech) {
      md += 'p';
    }
    if (metadata.syllables) {
      md += 's';
    }
    if (metadata.pronunciation) {
      md += 'r';
    }
    if (metadata.frequency) {
      md += 'f';
    }
    if (md.length) {
      query.md = md;
    }
  }
  if (maxResults) {
    if (maxResults > 1000) {
      throw Error('May not request more than 1000 results');
    }
    query.max = maxResults;
  }
  const uri = apiEndpoint.words + querystring.unescape(querystring.stringify(query));
  return makeRequest(uri);
};
