import { Article } from "@/types/Article";
import { LocaleDate } from "./Date";

export function Post({ header: { title, publicationDate, tags }, children }: Article) {
	return <div style={{ maxWidth: "min(60em, 90%)", margin: "auto", marginTop: "5em" }}>
		<div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "0.5em" }} >
			<h1>{title}</h1>
			<LocaleDate date={publicationDate!} />
		</div>
		{children}
	</div>
}