import {HtmlToTextOptions} from "html-to-text";

export interface IScriptParams {
    translateFromLang: string,
    translateToLang: string,
    translateDelayMs: number,
    skipAllEmptyParagraphs: boolean,
    skipFirstEmptyParagraph: boolean,
    skipSecondEmptyParagraph: boolean,
    skipThirdEmptyParagraph: boolean,
    epubFolder: string,
    convertHtmlToTextOption: HtmlToTextOptions
}