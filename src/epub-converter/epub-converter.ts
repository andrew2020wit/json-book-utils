import fs from "node:fs";
import {translateJsonBook} from "../scripts/utils/translate-via-net.js";
import EPub from "epub";
import {IBook, IBookHeader} from "../models/book.interface.ts";
import {IBookJson} from "../models/book-json.interface.ts";
import {convert} from "html-to-text";
import {textSplitSeparators} from "../const/text-split-separators.const.ts";
import {scriptParamsConst} from "../params/script-params.const.js";
import {createDocx} from "../scripts/utils/create-docx-to-translate.js";

const cmdLineParams = {
    translate: 'translate',
    translateDocx: 'translateDocx',
    translateFromLang: 'translateFromLang:',
    translateToLang: 'translateToLang:',
    translateDelayMs: 'translateDelayMs:',
};

await main();

async function main() {
    const params = process.argv.slice(2);

    scriptParamsConst.translate = params.includes(cmdLineParams.translate);
    scriptParamsConst.translateDocx = params.includes(cmdLineParams.translateDocx);

    const translateFromLang = params.find(item => item.includes(cmdLineParams.translateFromLang))?.slice(cmdLineParams.translateFromLang.length);
    const translateToLang = params.find(item => item.includes(cmdLineParams.translateToLang))?.slice(cmdLineParams.translateToLang.length);
    const translateDelayMs = +(params.find(item => item.includes(cmdLineParams.translateDelayMs))?.slice(cmdLineParams.translateDelayMs.length) || 0);

    if (translateFromLang) scriptParamsConst.translateFromLang = translateFromLang;
    if (translateToLang) scriptParamsConst.translateToLang = translateToLang;
    if (translateDelayMs) scriptParamsConst.translateDelayMs = translateDelayMs;

    console.log(scriptParamsConst);

    await convertEpubFilesToJsonFile();
}

async function convertEpubFilesToJsonFile() {
    const dirContent = fs.readdirSync(scriptParamsConst.epubFolder);

    const fileNames = dirContent
        .filter(name => name.slice(-5) === '.epub');

    for (const fileName of fileNames) {
        await convertEpubFileToJsonFile(fileName);
    }
}

async function convertEpubFileToJsonFile(fileName: string) {
    const fileNameWithoutExtension = fileName.slice(0, -1 * '.json'.length);

    const epub = new EPub(scriptParamsConst.epubFolder + '/' + fileName);

    await new Promise<void>((resolve, reject) => {
        epub.on('end', () => resolve());

        epub.on('error', (err) => {
            console.error(err);
            reject(err);
        });

        epub.parse();
    });

    const extendedName = epub.metadata.creator + ' - ' + epub.metadata.title;

    const jsonBook: IBookJson['book'] = {
        id: Date.now().toString(),
        title: extendedName,
        description: convertHtmlToText(epub.metadata.description),
        content: []
    };

    const bookContent: IBook['content'] = [];
    const bookHeaders: IBook['headers'] = [];

    for (const chapter of epub.flow) {
        const chapterHtml = await new Promise<string>((resolve, reject) => {
            epub.getChapter(chapter.id, (err, chapterText) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(chapterText);
                }
            });
        });

        // it fills bookContent and bookHeaders;
        makeContentItem(chapter, chapterHtml, bookContent, bookHeaders);
    }

    jsonBook.content = bookContent;
    jsonBook.headers = bookHeaders;

    if (scriptParamsConst.translate) {
        await translateJsonBook(jsonBook, scriptParamsConst);
    }

    const fileNameWithoutExtensionNormal = fileNameWithoutExtension.toLowerCase()
        .replaceAll('  ', '-')
        .replaceAll('\t', '-')
        .replaceAll(' ', '-')
        .replaceAll(',', '')
        .replaceAll('!', '')
        .replaceAll('?', '')
        .replaceAll('"', '')
        .replaceAll('`', '')
        .replaceAll(`'`, '')
        .replaceAll(':', '-')
        .replaceAll('.', '')
        .replaceAll('---', '-')
        .replaceAll('--', '-');

    fs.writeFileSync(scriptParamsConst.epubFolder + '/' + fileNameWithoutExtensionNormal + '.book.json', JSON.stringify({
        jsonContentDescription: "ForeignReaderBook",
        book: jsonBook
    }, null, 2));

    if (scriptParamsConst.translateDocx) {
        createDocx(jsonBook, scriptParamsConst, fileNameWithoutExtensionNormal);
    }
}

function convertHtmlToText(html: string) {
    return convert(html, scriptParamsConst.convertHtmlToTextOption);
}

// it fills bookContent and bookHeaders;
function makeContentItem(chapter: EPub.TocElement, chapterHtml: string, bookContent: IBook['content'], bookHeaders: IBookHeader[]) {
    const chapterText = convertHtmlToText(chapterHtml);

    const lastContentIndex = bookContent.length - 1;

    const notFilteredTextArr = chapterText
        .split('\n')
        .map((x) => x.trim());

    const textArr = notFilteredTextArr
        .filter((item, index) => {
            if (!!item) {
                return true;
            }

            if (scriptParamsConst.skipAllEmptyParagraphs) {
                return false;
            }

            if (scriptParamsConst.skipThirdEmptyParagraph
                && !notFilteredTextArr[index - 1]
                && !notFilteredTextArr[index - 2]
                && !!notFilteredTextArr[index - 3]
            ) {
                return false;
            }

            if (scriptParamsConst.skipSecondEmptyParagraph
                && !notFilteredTextArr[index - 1]
                && !!notFilteredTextArr[index - 2]
            ) {
                return false;
            }

            if (scriptParamsConst.skipFirstEmptyParagraph
                && !!notFilteredTextArr[index - 1]
            ) {
                return false;
            }

            return true;
        })

    const paragraphContent = textArr.map((item, index) => {
        let text = item;

        textSplitSeparators.forEach(separator => {
            text = text.replaceAll(separator, separator + '\n');
        });

        const phrases = text.split('\n').map(x => x.trim()).filter(x => !!x);

        return {
            id: lastContentIndex + 1 + index,
            text: phrases
        }
    })

    const headerIndex = lastContentIndex + 1;
    const headerTitle = '[' + (chapter.level || 0) + '] ' + (chapter.order) + ': ' + chapter.title;

    bookContent.push(...paragraphContent);

    if (chapter.order) {
        bookHeaders.push({
            id: headerIndex,
            text: headerTitle
        });
    }
}
