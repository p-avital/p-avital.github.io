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
		<p>Humane SemVer is one of my attempts at <Link href="/tfios">fixing SemVer</Link>. It's meant to get you to think a bit more about your versioning. If you're interested in a much more rigorous fix, check out <Link href="/semver-prime">SemVer Prime</Link>!</p>

		<h2>Humane SemVer</h2>
		<p>Humane SemVer is a convention I'd like you to consider for your software projects. It is strictly a subset of SemVer, which means you can use it without fear of breaking SemVer-based tooling.</p>
		<p>Humane SemVer works by gently nudging you to include more meaning in your versions:</p>
		<ul>
			<li>To do so, simply bump your versions by numbers that scale with "how much pain" goes into up/down-grading:
				<ul>
					<li>Changed a single function's name or tweaked its signature? Bump by 1!</li>
					<li>Fundamentally changed the way you interact with a core feature? Bump by 50!</li>
					<li>Changed an invariant in a way that can't be detected at compile time? Go to jail you monster!</li>
				</ul>
			</li>
			<li>Stop fearing big numbers! So what if you <Link href={"https://semver.org/#if-even-the-tiniest-backward-incompatible-changes-to-the-public-api-require-a-major-version-bump-wont-i-end-up-at-version-4200-very-rapidly"}>hit version 42.0.0</Link> in a few months? We're developers! We regularly think of numbers above 2<sup>32</sup>!</li>
			<li>Inform your users of your usage of Humane SemVer, explaining in your changelog why that even though <code>212.0.0</code> came only a week after <code>211.0.0</code>, they don't even need to change their code to use it because it's <em>"just a change in the memory layout of <code>SendHandle</code>, and we treat ABI breaks as 'tiny majors', but hey, 20% more bandwidth!"</em>. <details><summary style={{ color: "cyan" }}>Want to know how they got to <code>211.0</code> in the first place? Unpack this spoiler tag!</summary>
				<ul>
					<li><code>1.0</code> (I'll omit patch numbers for brevity) came out when John first finished writing <code>homing-pigeon</code>, a distributed systems library, and decided it was time to release it.</li>
					<li><code>2.0</code> and <code>3.0</code> came out of as John renamed a few methods in two steps when he discovered that the rest of the community used certain terms differently in the same problem space. John decided those were tiny bumps because the semantics stayed exactly the same and "Just find and replace and Bob's your uncle!".</li>
					<li>Time goes on, John allies with Caitlin to found the <em>Dove Networking Company</em>, turning <code>homing-pigeon</code> into a product. They get plenty of funding and hire very clever people</li>
					<li>Rupert proposes a brand new API: it's a total break, but the team decides to move to it due to how many bugs it could eliminate. Luckily, Caitlin had heard of Humane SemVer and asks that the release be branded <code>60.0</code>, a stark jump from <code>3.15</code> that had been reached just last month.</li>
					<li>Thanks to Velma's efforts, <code>homing-pigeon</code>'s network overhead could get 60% lower! But upgrading a distributed system library can be pretty gnarly; they decide to act extremely carefully:
						<ul><li>A first transition version, capable of using both versions of the protocol, is released as <code>60.3</code>.</li>
							<li>It was followed by 6 minors, over the following year, reaching <code>60.9</code>. A tool was also made available to help detect if versions that couldn't speak the new protocol were still online.</li>
							<li>Finally, they got rid of the old protocol's codebase in <code>200.0</code>. This huge bump was meant to alert users that even though they could upgrade from <code>60.0</code> to <code>200.0</code> without so much as changing a character of their code if they wanted, that upgrade would probably <em>not</em> be painless.</li>
						</ul>
					</li>
					<li><code>200.0</code> was also <code>homing-pigeon</code>'s first ABI-stable release: from now on, any change in the library's ABI will lead to a major bump. In fact, the next 11 versions were all majors that only contained ABI changes.</li>
				</ul>
			</details></li>
		</ul>
		<p>With just a few integers, it's hard (but <Link href={"/semver-prime"}>not impossible</Link>) to convey intricate meaning. But that's what changelogs are for! The true goal of Humane SemVer is to reduce the strange pressure we feel from a set of 3 tiny integers, while retaining the usefulness they do have for automated tools.</p>
		<p>Does Humane SemVer solve everything? No. Do I find it better than SemVer Classic? Yes! I'd be very happy to hear your suggestions for usages of SemVer that stay conform to it while being also more human friendly!</p>
	</Post>
}
