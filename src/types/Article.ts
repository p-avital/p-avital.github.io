import { ReactElement } from "react";

export interface ArticleHeader {
  title: ReactElement;
  publicationDate: Date;
  summary: ReactElement;
  link: string;
  tags: string[];
}
export interface Article {
  header: ArticleHeader;
  children: ReactElement | string;
}
