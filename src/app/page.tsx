import Image from "next/image";
import styles from "./page.module.css";
import { ArticleHeader } from "@/types/Article";

const articles: ArticleHeader[] = [
  {
    title: <>Introductions!</>,
    publicationDate: new Date("2024/05/28"),
    summary: <>Welcome to my blog! Time for me to introduce myself!</>,
    link: "/introductions",
    tags: []
  },
  {
    title: <>Fine! I'll just make my own stable ABI! <br /><small>With compact sum-types and stable <code>rustc</code></small></>,
    publicationDate: new Date("2024/05/29"),
    summary: <>Want to learn about ABI, and how I created one as a library for Rust? Well I talked about all of that at RustConf 2023, here's a text version :)</>,
    link: "/stabby-rustconf2023",
    tags: ["rust", "stabby"]
  }
].sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome to my blog!</h1>
      <section>
        <h2>This is a site with the following goals</h2>
        <ul>
          <li>Share knowledge about cool stuff</li>
          <li>Be terse: no padding out articles, I won't run any ads anyway</li>
          <li>Not a single AI paragraph (unless this would be the subject of the article)</li>
          <li>Disclose any conflict of interest when talking about <em>my</em> cool stuff</li>
        </ul>
      </section>
      <section>
        <ul>{articles.map(({ title, publicationDate, summary, link, tags }) => <div style={{ width: "30vw", border: "solid 1px black", borderRadius: "5px", padding: "1em", margin: "0.5em" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "0.5em" }} >
            <h3 style={{ maxWidth: "80%" }}><a href={link}>{title}</a></h3>
            <span>{publicationDate.toLocaleDateString()}</span>
          </div>
          {summary}
          {tags.length ? <div style={{ marginTop: "0.3em" }}><b>Tags:</b> {tags.join(", ")} </div> : <></>}
        </div>)}</ul>
      </section>
      This site is still very much under construction work, but expect articles to come up soon(TM)!
    </main>
  );
}
