import { ReactElement } from "react"

export interface ArticleHeader {
	title: ReactElement,
	publicationDate: Date,
	summary: ReactElement,
	link: string
	tags: string[]
}