import fs from "node:fs";
import {IBookJson} from "../../models/book-json.interface.ts";
import {convert} from "html-to-text";
import {scriptParamsConst} from "../../params/script-params.const.js";
import {normalizeFileName} from "../utils/normalize-file-name.js";
import {parseSrt} from "./parse-srt/parse-srt.js";

const files = fs.readdirSync(scriptParamsConst.fileFolder);
const fileExtension = '.srt';

await convertSrtFilesToJsonFile();

async function convertSrtFilesToJsonFile(): Promise<void> {
    const fileName = files
        .filter(name => name.slice(-1 * fileExtension.length) === fileExtension)?.[0];

    if (!fileName) {
        throw new Error('File not found.');
    }

    await convertSrtFileToJsonFile(fileName);
}

async function convertSrtFileToJsonFile(fileName: string): Promise<void> {
    const fileNameWithoutExtension = fileName.slice(0, -1 * fileExtension.length);
    const fileNameWithoutExtensionNormal = normalizeFileName(fileNameWithoutExtension);

    const textFileContent = fs.readFileSync(scriptParamsConst.fileFolder + '/' + fileName, 'utf8');


    const jsonBook: IBookJson['book'] = {
        id: Date.now().toString(),
        title: fileNameWithoutExtensionNormal,
        description: '',
        content: srtToArray(textFileContent)
            .map((text, index) => ({text: [text], id: index}))
    };


    fs.writeFileSync(scriptParamsConst.fileFolder + '/' + fileNameWithoutExtensionNormal + '.book.json', JSON.stringify({
        jsonContentDescription: "ForeignReaderBook",
        book: jsonBook
    }, null, 2));
}

function convertHtmlToText(html: string): string {
    return convert(html, scriptParamsConst.convertHtmlToTextOption);
}

function srtToArray(srt: string): string[] {
    return parseSrt(srt).map(x => x.text).filter(x => !!x)
        .map(x => convertHtmlToText(x || ''));
}