import fs from "node:fs";
import {scriptParamsConst} from "../params/script-params.const.js";
import {IBookJson} from "../models/book-json.interface.js";
import {createDocx} from "./utils/create-docx-to-translate.js";

const files = fs.readdirSync(scriptParamsConst.fileFolder);

exportToTranslationForJsonBook();

export function exportToTranslationForJsonBook(): void {
    const jsonFiles = files
        .filter(name => name.includes('.book.json'));

    if (!jsonFiles?.length) {
        throw( new Error(`No epub files found.`));
    }

    for (const jsonFile of jsonFiles) {
        console.log('exportToTranslationForJsonBook: ', jsonFile);
        const jsonBook = JSON.parse(fs.readFileSync(scriptParamsConst.fileFolder + '/' + jsonFile, 'utf8')) as IBookJson;
        const fileNameWithoutExtension = jsonFile.replace('.book.json', '');

        if (!jsonBook.book) {
            throw new Error('jsonBook.book does not exist! Wrong json book.');
        }

        createDocx(jsonBook.book, scriptParamsConst, fileNameWithoutExtension);
    }
}