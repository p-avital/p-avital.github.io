import { ArticleHeader } from "@/types/Article";

import { header as introductions } from "@/app/introductions/header";
import { header as rustconf2023 } from "@/app/stabby-rustconf2023/header";

export const articles: ArticleHeader[] = [introductions, rustconf2023]
  .filter((item) => item.publicationDate?.getTime() <= Date.now())
  .sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
