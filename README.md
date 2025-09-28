# Json book utils

## JSON Book conception

A JSON book is mainly a text file, which can contain additional information like headers.

see /src/model/

It's used by [foreign-reader](https://github.com/andrew2020wit/foreign-reader) and my other private project.

## Params

see 'src/params/'

## scripts

Each script can use the param file from 'src/params/'

Each script takes only one file with a certain extension (the first one);

1. epub-to-json - convert an epub file to a JSON file.
2. export-to-translation - create a translation file from json-file for the next translation
   (via Google Translate, for example).
3. todo: create import translation script
4. translate-json-book-via-net - it uses Bing to translate, it modifies json-book.
5. text-file-to-json-book
6. import-translation - translation must be in "1.txt" with utf-8.

## See also

[https://github.com/andrew2020wit/foreign-reader](https://github.com/andrew2020wit/foreign-reader)

## licence

MIT licence