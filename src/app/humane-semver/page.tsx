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
		<h2>A recap of SemVer</h2>
		<p>Semantic Versioning (SemVer for short) is a versioning convention that has gained much traction over the recent years, notably thanks to its integration within <code>npm</code> and <code>cargo</code></p>
		<p>The way SemVer works is by defining versions as a set of 3 integers, generally formatted <code>MAJOR.MINOR.PATCH</code>. While its rules are often described as a set of "when you do X, you should increment this integer to be SemVer compliant".</p>
		<p>I find this way of describing SemVer to be counter-productive. Instead, let's focus on the <em>spirit</em> of SemVer; by looking at it not from the author's perspective, but from the API consumer's:</p>
		<ul>
			<li>Any two versions of a software package with a common <code>MAJOR</code> and <code>MINOR</code> <b>MUST</b> be <em>entirely</em> compatible.</li>
			<li>Any version with a given <code>MAJOR</code> <b>MUST</b> be compatible with <em>all</em> of its predecessors.</li>
		</ul>

		<h2>The problems with SemVer (or how we're using it)</h2>
		<p>I do have a few bones to pick with SemVer, although they mostly stem from a form of social pressure we've constructed around it that really needs not exist. Still, <Link href={"https://semver.org/"}>semver.org</Link>'s wording plays a part in these falacies we've deluded ourselves into.</p>

		<h3>The <code>1.0.0</code> falacy and the <code>0.x.y</code> trap</h3>
		<p>SemVer explicitly encourages you to stay in <code>0.x.y</code> until you've defined and stabilized your project's API; waiting until your API is defined and stable to declare <code>1.0.0</code>.</p>
		<p>While the spirit behind this is to provide projects with a grace period in which everything flies, what this creates instead is a "fear" of getting to <code>MAJOR=1</code>: <em>"Once I hit <code>1.0.0</code>, I'll be stuck with the choices I've made until now... Am I really ready for that?"</em>.</p>
		<p>In turn, this is very observable when looking at popular projects on <Link href={"https://crates.io"}>crates.io</Link>: of the top 10 most downloaded crates, 4 are still on <code>0.x.y</code> despite their API having been notoriously stable:</p>
		<ul>
			<li><code>rand</code> hasn't received a new version for over 2 years!</li>
			<li><code>hashbrown</code> is part of the standard library, and as such is straight up forbidden from making changes that would force a <code>MAJOR</code> change!</li>
			<li><code>libc</code> has been planning <code>0.3.0</code> release for more than a year!</li>
		</ul>
		<p>You'll notice when looking in closer at <code>rand</code> and <code>libc</code> that these projects <em>do</em> intend on making some breaking changes, some of which are already in the pipeline. But all of these projects are factually <em>stable</em> considering they're being dependended on by most of the rest of the Rust ecosystem!</p>
		<p>And here lies the greatest abheration about SemVer: you're not deemed "stable" or "ready to use" before <code>1.0.0</code>, but you shouldn't go to <code>1.0.0</code> until your API is stable.</p>

		<h3>The <code>MAJOR</code> bump phobia</h3>
		<p>The problems don't stop once you reach <code>1.0.0</code>: <code>MAJOR</code> bumps scare developers and users alike!</p>
		<ul>
			<li>The devs push from <code>2.3.0</code> to <code>3.0.0</code>, reshaping the entire API.</li>
			<li>The users look at the scale of this update in horror, having to pick between staying on the now unsupported <code>MAJOR=2</code> branch, or accept delays in their own timelines to join up to <code>MAJOR=3</code></li>
			<li>The dev look at the chaos this caused in their community and over-correct their course; swearing to themselves never to up the <code>MAJOR</code> again.</li>
			<li>A year later, newcomers ask if they can make a small breaking change in order to gain performance: they are instead informed that management dislikes <code>MAJOR</code> upgrades for fear of losing customers, as they had been very negative about the last <code>MAJOR</code> bump.</li>
		</ul>
		<p>And like that, the project's future innovations are stunted, doomed to carry around any tech debt that slipped through.</p>

		<h3>Multi-package projects</h3>
		<p>Some projects encompass multiple packages: bindings in various languages, plugins, associated custom debug tools...</p>
		<p>Many projects then opt to keep versions synchronized between these packages to make their cross-compatibility more readable. This also helps mutualize documentation between bindings by being able to make sweeping statements about a given version.</p>
		<p>This leads to an additional conundrum: is a breaking change in one of the packages desirable enough that all other packages would see their version bumped as well?</p>

		<h3>What even <em>is</em> compatibility</h3>
		<p>SemVer decrees that your version should be guided by what you define as your public API. However, the classical definition of API is not enough to encompass what some projects may define as their API, or even what users expect the projects treat as such:</p>
		<ul>
			<li>Invariants: you can keep a public API identical in every regard but for a few invariants that need to be upheld. Does changing these invariants constitute an API break? (YES)</li>
			<li>IO protocols: can the user expect two SemVer-compatible version of a package to be able to communicate with each other on the network? Or to load each-other's save/config files?</li>
			<li>ABI: can the user expect that swapping out a package's binary for one of a SemVer-compatible version would work? While this question is irrelevant to a lot of languages, it is relevant to Rust.</li>
		</ul>

		<h3>SemVer is often assumed but rarely enforced</h3>
		<p>Due to it being misunderstood and the stigma around <code>MAJOR</code> bumps, people will often misuse SemVer to associate their own meanings to it.</p>
		<p>I was notably guilty of this with <code>stabby</code>, originally positing that "small" breaking changes would only get a minor bump.</p>
		<p>I have also been bitten by this several times: by crates pushing breaking changes in patches, by subcrates pinning different patches of such a crate (leading to cargo refusing to resolve the dependency)... If the tooling expects SemVer, infringing it becomes a pain in the neck for users as well! But it is just <em>so</em> easy to fail to notice that you did a subtle compatibility break... <b>But no more!</b></p>

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
		<p>With just a few integers, it's hard to convey intricate meaning. But that's what changelogs are for! The true goal of Humane SemVer is to reduce the strange pressure we feel from a set of 3 tiny integers, while retaining the usefulness they do have for automated tools.</p>
		<p>Does Humane SemVer solve everything? No. Do I find it better than SemVer Classic? Yes! I'd be very happy to hear your suggestions for usages of SemVer that stay conform to it while being also more human friendly!</p>
	</Post>
}
