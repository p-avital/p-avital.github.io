import { ReactElement } from "react";

export interface ArticleHeader {
  title: ReactElement;
  publicationDate: Date | null;
  summary: ReactElement;
  link: string;
  tags: string[];
}
export interface Comment {
  author: string;
  date: Date;
  comment: ReactElement;
}
export interface Article {
  header: ArticleHeader;
  comments: Comment[];
  children: ReactElement | ReactElement[] | string;
}
