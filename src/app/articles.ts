import { ArticleHeader } from "@/types/Article";

import { header as introductions } from "@/app/introductions/header";
import { header as rustconf2023 } from "@/app/stabby-rustconf2023/header";
import { header as outer_wilds } from "@/app/outer-wilds/header";
import { header as tfios } from "@/app/tfios/header";
import { header as humane_semver } from "@/app/humane-semver/header";
import { header as semver_prime } from "@/app/semver-prime/header";

export const articles: ArticleHeader[] = [
  introductions,
  rustconf2023,
  outer_wilds,
  humane_semver,
  tfios,
  semver_prime,
]
  .filter(
    (item) =>
      item.publicationDate && item.publicationDate.getTime() <= Date.now()
  )
  .sort((a, b) => b.publicationDate!.getTime() - a.publicationDate!.getTime());
