'use client'
import Link from "next/link";
import { LocaleDate } from "@/components/Date";
import { articles } from "./articles";
import { useState } from "react";


export default function Home() {
  const [selectedTags, setSelectedTags] = useState([] as string[]);
  const tags = articles.flatMap(a => a.tags).sort().filter((tag, i, arr) => !arr.slice(0, i).includes(tag))
  return (
    <main className="main">
      <h1>The Fox's Den</h1>
      <section>
        <b>Welcome to my blog! Have some articles!</b>
        <p>This is a blog about computer science, math, video games... All the nerd stuff!</p>
        <p>If you're wondering whose blog this is, you might be interested in my <Link href="/introductions">introduction post</Link>.</p>
        {tags.length ? <p>Tags: {tags.map(tag => <button key={tag} onClick={() => {
          const index = selectedTags.indexOf(tag);
          if (index === -1) { setSelectedTags([...selectedTags, tag]) } else { setSelectedTags([...selectedTags.slice(0, index), ...selectedTags.slice(index + 1)]) }
        }} style={{ backgroundColor: selectedTags.includes(tag) ? "violet" : "unset", margin: "0.4ex" }}>{tag}</button>)}</p> : <></>}
        {articles.filter(({ tags }) => selectedTags.length == 0 || selectedTags.some(tag => tags.includes(tag))).map(({ title, publicationDate, summary, link, tags }) => <div key={link} style={{ marginBottom: "2em" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "0.5em" }} >
            <h2 style={{ maxWidth: "80%" }}><Link href={link}>{title}</Link></h2>
            <LocaleDate date={publicationDate!} />
          </div>
          {summary}
          {tags.length ? <div style={{ marginTop: "0.3em" }}><b>Tags:</b> {tags.join(", ")} </div> : <></>}
        </div>)}
      </section>
      This site is still very much under construction work, but expect articles to come up soon(TM)!
    </main>
  );
}
