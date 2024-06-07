import { Post } from "@/components/Post";
import { header } from './header'
import Link from "next/link";

export default function Page() {
	return <Post header={header} comments={[
		// {
		// 	author: "YOUR NAME HERE",
		// 	date: new Date("1984/06/21"),
		// 	comment: <>YOUR COMMENT HERE</>
		// }
	]}>
		<h2>Welcome to my blog!</h2>
		<p>This is a space where I'll be talking about all sorts of interesting stuff: mostly programming, but also more general sciency stuff, video games... If I find it worthy of talking about, I will!</p>
		<p>My promise to you is to try to have the highest ratio of cool/line that I can: no padding out articles just to fit in some arbitrary format, no AI generated nonsense... But I might still do detours if they're worth it :)</p>
		<h2>Who even are you?</h2>
		<p>I'm Pierre Avital! A Frenchman with PhD in Signal Processing <small>(my advisors still wonder why I didn't go for computer science)</small>. I've spent most of my carrier doing software engineering, with a large part of that in Rust, which has been my go-to since 2018.</p>
		<p>I've notably worked on <Link href={"https://zenoh.io"}>Zenoh</Link> and <Link href={"https://ditto.live/"}>Ditto</Link>, and am the author of <Link href={"https://crates.io/crates/stabby"}><code>stabby</code></Link>. I've given a few talks which I'll summarize in future posts, published a few papers... The usual nerd stuff</p>
		<p>I hope you enjoy my future ramblings! <small>I've never actually used it, but I'll try to make an RSS feed for you RSS stans, I know y'all still exist</small></p>

	</Post>
}
