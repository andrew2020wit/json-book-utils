# Convert epub-files to json-book files for Foreign Reader

## Json Book conception

A json book is mainly a text file, which can contain additional information.

It's uses by [foreign-reader](https://github.com/andrew2020wit/foreign-reader) and my other private project.

## Epub converter

## install

- install node.js
- run ```npm install``` in this folder
- put files in the epub-files folder
- run ```npm run epub-converter``` to create json-book without translation
- or run ```npm run translate``` to create json-book with translation
- or run ```npx tsx src/epub-converter.ts translateDocx translate translateDelayMs:100 translateFromLang:en translateToLang:ru```
   (in project folder)
- take json files from the epub-files folder

It also creates docx files for translation.

see also: [https://github.com/andrew2020wit/foreign-reader](https://github.com/andrew2020wit/foreign-reader)

MIT licence