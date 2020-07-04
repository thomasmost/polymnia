Polymnia
---

Polymnia is a strictly typed wrapper for the datamuse API

Usage
---

```
npm install polymnia

import { suggest, words } from 'polymnia';
```

Currently supports many of the common query filters for the Words API as described here: http://www.datamuse.com/api/

Queries can be constructed using the typed Polymnia query config:

```
type WordsApiParams = {
  leftContext?: string;
  rightContext?: string;
  maxResults?: number;
  meansLike?: string;
  metadata?: Partial<Record<Metadata, boolean>>;
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
```

...or by passing in a `rawQuery`.
