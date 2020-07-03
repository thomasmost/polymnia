export declare const suggest: (input: string) => Promise<any>;
declare type WordsApiParams = {
    meansLike?: string;
    rawQuery?: string;
    rhymesWith?: string;
    soundsLike?: string;
    startsWith?: string;
    endsWith?: string;
    wildCount?: number;
};
export declare const words: (params: WordsApiParams) => Promise<any>;
export {};
