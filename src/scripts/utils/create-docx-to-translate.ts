import {IBookParagraph} from "../../models/book.interface.js";
import fs from "node:fs";
import {IBookJson} from "../../models/book-json.interface.ts";
import {IScriptParams} from "../../params/script-params.interface.ts";
import * as docx from "docx";

// create docx-file for google-translate

export const bookIdOpenMarker = '[[[[';
export const bookIdCloseMarker = ']]]]';
export const lineIdOpenMarker = '[[[';
export const lineIdCloseMarker = ']]]';
export const lineIdOpenMarker2 = '(((';
export const lineIdCloseMarker2 = ')))';

export function createDocx(jsonBook: IBookJson['book'], scriptParams: IScriptParams, fileNameWithoutExtension: string) {
    const docxChildren = [];

    docxChildren.push(
        new docx.Paragraph({
            children: [
                new docx.TextRun(bookIdOpenMarker + jsonBook.id + bookIdCloseMarker),
            ],
        }),
    );

    jsonBook.content.forEach((contentItem: IBookParagraph, contentItemIndex: number) => {
        contentItem.text.forEach((textLine, textLineIndex) => {
            const id = lineIdOpenMarker + contentItemIndex + lineIdCloseMarker + lineIdOpenMarker2 + textLineIndex + lineIdCloseMarker2;

            docxChildren.push(
                new docx.Paragraph({
                    children: [
                        new docx.TextRun(id),
                    ],
                }),
            );

            docxChildren.push(
                new docx.Paragraph({
                    children: [
                        new docx.TextRun(textLine),
                    ],
                }),
            );
        });
    });

    const docxDocument = new docx.Document({
        sections: [
            {
                properties: {},
                children: docxChildren,
            },
        ],
    });

    docx.Packer.toBuffer(docxDocument).then(
        (buffer: Buffer) => {
            fs.writeFileSync(scriptParams.fileFolder + '/' + fileNameWithoutExtension + '.to-translate.docx', buffer);
        },
        (err: Error) => console.error(err)
    );
}