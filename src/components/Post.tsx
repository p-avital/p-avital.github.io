import { Article } from "@/types/Article";
import { LocaleDate } from "./Date";
import Link from "next/link";

export function Post({ header: { title, publicationDate, link }, comments, children }: Article) {
	return <main>
		<div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5em" }} >
			<h1>{title}</h1>
			{publicationDate ? <LocaleDate date={publicationDate} /> : <span>Preview</span>}
		</div>
		{children}
		<h1>Comments</h1>
		{comments.map(comment => <div style={{ marginBottom: "2em" }}><div>{comment.author} - <LocaleDate date={comment.date} /></div>{comment.comment}</div>)}
		<div style={{ marginBottom: "1em" }}>Want to leave a comment? <Link href={`https://github.com/p-avital/p-avital.github.io/edit/main/src/app/${link}/page.tsx`}>Open a PR with your comment in it!</Link></div>
	</main>
}