import { ReactElement } from "react";

export class Footnotes {
	constructor(public notes: Record<string, ReactElement | (() => ReactElement)>) { }
	link(key: string): ReactElement {
		const index = Object.keys(this.notes).indexOf(key)
		return <sup id={`up-${key}`}><a href={`#${key}`}>{index + 1}</a></sup>
	}
	footer(): ReactElement {
		return <div style={{ width: "100%", borderTop: "1px solid grey", paddingTop: "1ex" }}>{
			Object.entries(this.notes).map(([key, note], index) => <small style={{ display: "block" }} id={key} key={key}><a href={`#up-${key}`}>{index + 1}</a>: {typeof note === "function" ? note() : note}</small>)
		}</div>
	}
}