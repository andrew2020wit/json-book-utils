export interface IBook {
  id: string;
  title: string;
  description: string;
  content: IBookParagraph[];
  translation?: Record<string, string>;
  markedItems?: IBookParagraph['id'][];
  headers?: IBookHeader[];
}

export interface IBookParagraph {
  id: number;
  text: string[];
}

export type IBookHeader = {
  id: IBookParagraph['id'];
  isMarked?: boolean;
  text: string;
};
