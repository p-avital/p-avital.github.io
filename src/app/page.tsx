import Link from "next/link";
import styles from "./page.module.css";
import { LocaleDate } from "@/components/Date";
import { articles } from "./articles";


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
        <ul>{articles.map(({ title, publicationDate, summary, link, tags }) => <div key={link} style={{ width: "30vw", border: "solid 1px black", borderRadius: "5px", padding: "1em", margin: "0.5em" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "0.5em" }} >
            <h3 style={{ maxWidth: "80%" }}><Link href={link}>{title}</Link></h3>
            <LocaleDate date={publicationDate!} />
          </div>
          {summary}
          {tags.length ? <div style={{ marginTop: "0.3em" }}><b>Tags:</b> {tags.join(", ")} </div> : <></>}
        </div>)}</ul>
      </section>
      This site is still very much under construction work, but expect articles to come up soon(TM)!
    </main>
  );
}
