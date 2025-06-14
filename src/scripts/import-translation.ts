import fs from "node:fs";
import {scriptParamsConst} from "../params/script-params.const.js";
import {IBookJson} from "../models/book-json.interface.js";
import {
    bookIdCloseMarker,
    bookIdOpenMarker,
    lineIdCloseMarker, lineIdCloseMarker2,
    lineIdOpenMarker, lineIdOpenMarker2
} from "./utils/create-docx-to-translate.js";

const files = fs.readdirSync(scriptParamsConst.fileFolder);

importTranslation();

export function importTranslation(): void {
    const translationTextFilePath = scriptParamsConst.fileFolder + '/1.txt';

    const translationText = fs.readFileSync(translationTextFilePath, 'utf8');

    const fileName = files
        .filter(name => name.includes('.book.json'))?.[0];

    if (!fileName) {
        throw new Error('File not found.');
    }

    const jsonBook = JSON.parse(fs.readFileSync(scriptParamsConst.fileFolder + '/' + fileName, 'utf8')) as IBookJson;

    if (!jsonBook.book) {
        throw new Error('jsonBook.book does not exist! Wrong json book.');
    }

    const bookId = jsonBook.book.id;

    if (!bookId) {
        throw new Error('bookId not found.');
    }

    jsonBook.book.translation = computeTranslationObj(translationText, bookId);

    fs.writeFileSync(scriptParamsConst.fileFolder + '/' + 'with-tr-'  + fileName, JSON.stringify(jsonBook));
}

function computeTranslationObj(translationText: string, bookId: string): Record<string, string> {
    const translationArr = translationText.split('\n');

    const id = translationArr[0]
        .trim()
        .slice(bookIdOpenMarker.length, -1 * bookIdCloseMarker.length)
        .trim();

    if (id !== bookId) {
        throw new Error('wrong bookId.');
    }

    const translationObj: Record<string, string> = {};

    for (let i = 1; i < translationArr.length; i = i + 2) {
        const idLine = translationArr[i];
        const line = translationArr[i+1];

        const startIndex = idLine.indexOf(lineIdOpenMarker);
        const endIndex = idLine.indexOf(lineIdCloseMarker) + lineIdCloseMarker.length;
        const startIndex2 = idLine.indexOf(lineIdOpenMarker2);
        const endIndex2 = idLine.indexOf(lineIdCloseMarker2) + lineIdCloseMarker2.length;

        if (startIndex < 0 || startIndex2 < 0) {
            i = i - 1;
            continue;
        }

        if (!line.trim()) {
            continue;
        }

        if (line.indexOf(lineIdOpenMarker) !== -1) {
            i = i - 1;
            continue;
        }

        const id = idLine
            .slice(startIndex, endIndex)
            .trim()
            .slice(lineIdOpenMarker.length, -1 * lineIdCloseMarker.length)
            .trim();

        const id2 = idLine
            .slice(startIndex2, endIndex2)
            .trim()
            .slice(lineIdOpenMarker2.length, -1 * lineIdCloseMarker2.length)
            .trim();

        const resultId = computeTranslationId(id, id2);

        translationObj[resultId] = line.trim();

        if (isNaN(+id) || isNaN(+id2)) {
            console.warn( 'warn: ', id + '-' + id2);
        }
    }

    return translationObj;
}


function computeTranslationId(pId: number | string, id: number | string): string {
    const lineIdSeparator = '-';
    return pId + lineIdSeparator + id;
}