import fs from "node:fs";
import {scriptParamsConst} from "../params/script-params.const.js";
import {IBookJson} from "../models/book-json.interface.js";
import {translateJsonBook} from "./utils/translate-via-net.js";

const dirContent = fs.readdirSync(scriptParamsConst.fileFolder);

await translateJsonBookViaNet();

async function translateJsonBookViaNet(): Promise<void> {
    const fileName = dirContent
        .filter(name => name.includes('.book.json'))?.[0];

    if (!fileName) {
        throw new Error('File not found.');
    }

    const jsonBook = JSON.parse(fs.readFileSync(scriptParamsConst.fileFolder + '/' + fileName, 'utf8')) as IBookJson;

    if (!jsonBook.book) {
        throw new Error('jsonBook.book does not exist! Wrong json book.');
    }

    await translateJsonBook(jsonBook.book, scriptParamsConst);

    fs.writeFileSync(scriptParamsConst.fileFolder + '/' + 'with-tr-'  + fileName, JSON.stringify(jsonBook, null, 2));
}