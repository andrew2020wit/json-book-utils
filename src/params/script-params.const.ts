import {IScriptParams} from "./script-params.interface.js";

export const scriptParamsConst: IScriptParams = {
    translateFromLang: 'en',
    translateToLang: 'ru',
    translateDelayMs: 100,
    skipAllEmptyParagraphs: false,
    skipFirstEmptyParagraph: false,
    skipSecondEmptyParagraph: false,
    skipThirdEmptyParagraph: false,
    fileFolder: './json-book-files',
    convertHtmlToTextOption: {
        wordwrap: false,
        preserveNewlines: false
    }
} as const;