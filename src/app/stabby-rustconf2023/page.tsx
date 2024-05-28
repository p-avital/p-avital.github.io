import { Post } from "@/components/Post";
import { header } from "./header"

const body = <>Hi There!</>

export default function Page() {
	return <Post header={header}>Hi there!</Post>
}