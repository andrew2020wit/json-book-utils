# Adding a translation to a JsonBook

## Translation direction

Original language: English
Translation language: Ukrainian

You may change the languages here. Change only the two values above:
the rest of this file refers to them as "the original language" and "the translation language".

## JsonBook description

In this project, a JsonBook is a JSON file that contains the content of a book (usually fiction)
along with some other information.

JsonBook is intended for reading books in a foreign language (usually English), and optionally contains a section with the book's translation.

JsonBook is intended to be used together with the online service [Foreign Reader](https://andrew2020wit.github.io/foreign-reader/)

"Foreign Reader" is the best way to read books in a foreign language.

JsonBook conforms to the IBookJson interface defined in the file 'book-interface/book-json.interface.ts'
(the nested IBook interface is defined in the file 'book-interface/book.interface.ts').

Read IBookJson and IBook, and use them for this task.

jsonBook: IBookJson

jsonBook.book.content contains an array of the book's paragraphs.
Each paragraph is represented as an IBookParagraph object: `{ id: number, text: string[] }`,
where `text` is the array of the paragraph's lines.

The translation section is `jsonBook.book.translation` (inside the `book` object, next to `content`, not at the top level of the file).
It contains the book's translation in the format Record<string, string>,
where the key is the identifier of a paragraph line, and the value is the translation of that line.

The line key is built from the paragraph identifier (paragraph.id, not the position in the content array)
and the line index within the paragraph (lineIndex, the position in the paragraph.text array)
using the template: `${paragraph.id}-${lineIndex}`
lineIndex is zero-based.

## Example

The "example" folder contains an example of a translated book. Do not change anything in this folder.
The example shows only the structure and the keys; its translation language is just an illustration,
so do not copy its wording if the translation language is different.

## Translation requirements

The translation must be literal (close to the original in words and structure), not literary.
It is intended for learning a foreign language: the reader compares each line of the original with its translation.

Do not translate or transliterate proper nouns (people's names, animal names, geographical names, etc.);
keep them in the translation exactly as they are written in the original.

Keep dialogues and quotation marks as in the original: preserve the type of quotation marks and dashes, and do not merge or re-split replies.

## Correspondence between original lines and translation

Each line of the original (an element of a paragraph's `text`) is translated separately and gets a key based on its own index,
regardless of whether neighboring lines have a translation.

- Empty lines are not translated: no key is created in translation for them.
  A line consisting only of whitespace characters (spaces, tabs, etc.) is also considered empty.
  Skipping does not shift indices: the keys of the following lines stay the same as the indices in the original.
- If the translation of a line is exactly the same as the original (for example, a number, "***", or a proper noun),
  no key is created for that line.
- Lines are merged only when a line cannot be translated independently, that is, when it is not a complete unit of meaning
  and any independent translation of it would be broken or meaningless
  (for example, the line ends in the middle of a construction: with an article, preposition, conjunction, auxiliary verb,
  or an unfinished noun phrase, as in "The old man who lived at the end of the" / "street had never once spoken to anyone.").
  In this case the combined translation of these lines (two or more) is written under the key of the first of them,
  and no keys are created for the remaining lines of that phrase.
- In all other cases a line must not be merged with its neighbors: the translation stays attached to its own line,
  even if the line is only a fragment of a sentence and even if the sentence continues on the next line
  (for example, "Sometimes," / "very rarely, he smiled." are translated as two separate lines).
- If in doubt, do not merge: a separate translation of the line is preferable to a merged one.

## Translating large books

Do not translate the whole book at once. Translate 20 paragraphs at a time, taking into account the context of the previous paragraphs.
You may change the batch size at your discretion (for example, reduce it for very long paragraphs).
Before the first batch, make sure the translation section exists: if the file has no `translation` key in `book`
(for example, because you removed the previous one), create it as an empty object (`"translation": {}`) as the last key of `book`.
After each batch, append the resulting keys to the end of the translation section of the file, then move on to the next batch.
The file must remain valid JSON after every batch.
The keys in the translation section must go in the same order as the lines in `content`:
by the position of the paragraph in the content array, and within a paragraph by lineIndex ascending.
This way the work is not lost, and the translation quality does not degrade because of large volume.
Do not skip paragraphs and do not finish until the entire "content" section has been translated.

## Task

The "to-translate" folder contains JsonBooks that you must translate.
Process only files with the `.json` extension; ignore all other files (for example, `.gitkeep`) and do not move or modify them.
For each such file in this folder, do the following:

1. Read the file.
2. Remove the previous translation if there is one (the `translation` key of the `book` object, together with its value). Remember whether it existed (this is needed for the log).
3. Translate the "content" section from the original language into the translation language. Do not translate anything outside this section.
   Do not translate or modify the other fields (including `title`, `description`, `headers`, `markedItems`, `jsonContentDescription`).
   If any of these fields are missing from the file, do not add them. If they are present, leave them unchanged.
4. Save the translation in `jsonBook.book.translation` in the required format described above.
   Always add the `translation` key as the last key of the `book` object (after all existing keys, including `content`),
   regardless of where it was in the file before it was removed.
   Leave the rest of the file byte-for-byte unchanged: keep the key order, indentation, line breaks, trailing spaces,
   the way arrays are laid out (for example, several `text` lines on one line), and the presence or absence of a newline at the end of the file.
   Because of this, edit the file as plain text (insert and remove text fragments).
   Do NOT parse and re-serialize the whole file (`JSON.parse` + `JSON.stringify`, `json.dump`, etc.): that reformats everything.
   Take care of commas when editing:
   - when removing the old `translation` key, also remove the comma that separated it from its neighbor,
     so that no trailing comma is left after the previous key and no leading comma remains;
   - when adding `translation` after the last key of `book`, add a comma after the previous last key;
   - the `translation` key itself is the last one and has no trailing comma.
   Indent the `translation` block in the same style as the neighboring keys of `book`.
   The file must be UTF-8 encoded; write non-ASCII characters (Cyrillic, accented letters, etc.) as they are, without escaping (`\uXXXX`).
   Characters that JSON requires to be escaped must still be escaped: a double quote `"` inside a translation is written as `\"`
   (this is important for dialogues), a backslash as `\\`, and a line break as `\n`. Typographic quotes (`“ ”`, `« »`) and dashes are not escaped.
5. Check that the resulting file is valid JSON (for example, `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>`).
6. Move the file (a real move, not a copy - it must not remain in the "to-translate" folder) to the "translated" folder.
   If the "translated" folder does not exist, create it.
7. Add an entry to the log (see below).

While working, count:
- the total number of lines in the original text (the sum of the lengths of the `text` arrays of all paragraphs, including empty lines) -
  this is the maximum possible number of lines with a translation;
- the number of lines of the original that have a translation. Count lines, not keys:
  when a phrase is merged across several lines, the key exists only for the first line,
  but all lines of the phrase are counted as translated (so the number of lines can be greater than the number of keys).

## Log

After finishing the translation of each book, append an entry to the end of the file `log.txt` in the project root
(create the file if it does not exist; do not delete or modify existing entries).
The entry contains:

- the name of the JSON file (the name only, without the full path);
- whether the previous translation was removed: if it was, write the line `Previous translation: removed`;
  if there was no previous translation, do not write this line at all (write nothing in its place);
- the total number of lines in the original text;
- the number of lines for which a translation was added.

Example entry:

```
example.book.json
Previous translation: removed
Total lines in original: 20
Lines with added translation: 15
```

The user judges the success of the translation from this log.
