import { Post } from "@/components/Post";

export const header = {
	title: <>Introductions!</>,
	publicationDate: new Date("2024/05/28"),
	summary: <>Welcome to my blog! Time for me to introduce myself!</>,
	link: "/introductions",
	tags: []
}
const body = <>Hi There!</>

export default function Page() {
	return <Post header={header}>Hi there!</Post>
}