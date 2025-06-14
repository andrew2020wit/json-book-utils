import fs from "node:fs";
import {scriptParamsConst} from "../params/script-params.const.js";
import {IBook, IBookParagraph} from "../models/book.interface.js";
import {textSplitSeparators} from "../const/text-split-separators.const.js";
import {IBookJson} from "../models/book-json.interface.js";

const files = fs.readdirSync(scriptParamsConst.epubFolder);

textFilesToJsonFile();

function textFilesToJsonFile() {
    const fileName = files
        .filter(name => name.slice(-1 * '.txt'.length) === '.txt')?.[0];

    if (!fileName) {
        throw new Error('File not found.');
    }

    const fileNameWithoutExtension = fileName.slice(0, -1 * '.txt'.length);

    const textFileContent = fs.readFileSync(scriptParamsConst.epubFolder + '/' + fileName, 'utf8');

    if (!textFileContent) {
        throw new Error('wrong text file content.');
    }

    const jsonBook = createJsonBook(fileNameWithoutExtension, textFileContent);

    const jsonFileObj: IBookJson = {
        book: jsonBook,
        jsonContentDescription: 'JSON Book',
    }

    const jsonFilePath = scriptParamsConst.epubFolder + '/' + fileNameWithoutExtension + '.book.json'

    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonFileObj));
}

function createJsonBook(title: string, text: string): IBook {
    const textArr = text
        .split('\n')
        .map((x) => x.trim())
        .filter((item) => item);

    const content: IBookParagraph[] = textArr.map((item, index) => {
        let text = item;

        textSplitSeparators.forEach(separator => {
            text = text.replaceAll(separator, separator + '\n');
        });

        const p = text.split('\n').map(x => x.trim()).filter(x => !!x);

        return {
            id: index,
            text: p
        }
    })

    return {
        id: Date.now().toString(),
        title,
        description: '',
        content
    }
}