import fs from "node:fs";
import {scriptParamsConst} from "../params/script-params.const.js";
import {IBookJson} from "../models/book-json.interface.js";
import {createDocx} from "./utils/create-docx-to-translate.js";

const dirContent = fs.readdirSync(scriptParamsConst.epubFolder);

exportToTranslationForJsonBook();

export function exportToTranslationForJsonBook(): void {
    const fileName = dirContent
        .filter(name => name.includes('.book.json'))?.[0];

    if (!fileName) {
        throw new Error('File not found.');
    }

    const jsonBook = JSON.parse(fs.readFileSync(scriptParamsConst.epubFolder + '/' + fileName, 'utf8')) as IBookJson;
    const fileNameWithoutExtension = fileName.replace('.book.json', '');

    if (!jsonBook.book) {
        throw new Error('jsonBook.book does not exist! Wrong json book.');
    }

    createDocx(jsonBook.book, scriptParamsConst, fileNameWithoutExtension);
}