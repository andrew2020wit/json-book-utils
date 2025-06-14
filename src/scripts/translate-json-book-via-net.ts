import fs from "node:fs";
import {scriptParamsConst} from "../params/script-params.const.js";
import {IBookJson} from "../models/book-json.interface.js";
import {translateJsonBook} from "./utils/translate-via-net.js";

const dirContent = fs.readdirSync(scriptParamsConst.epubFolder);

await translateJsonBookViaNet();

export async function translateJsonBookViaNet() {
    const fileName = dirContent
        .filter(name => name.includes('.book.json'))?.[0];

    if (!fileName) {
        throw new Error('File not found.');
    }

    const jsonBook = JSON.parse(fs.readFileSync(scriptParamsConst.epubFolder + '/' + fileName, 'utf8')) as IBookJson;

    if (!jsonBook.book) {
        throw new Error('jsonBook.book does not exist! Wrong json book.');
    }

    await translateJsonBook(jsonBook.book, scriptParamsConst);
}