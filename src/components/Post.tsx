import { Article } from "@/types/Article";
import { LocaleDate } from "./Date";

export function Post({ header: { title, publicationDate, tags }, children }: Article) {
	return <main>
		<div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "0.5em" }} >
			<h1>{title}</h1>
			{publicationDate ? <LocaleDate date={publicationDate} /> : <span>Preview</span>}
		</div>
		{children}
	</main>
}