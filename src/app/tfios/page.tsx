import { Post } from "@/components/Post";
import { header } from './header'
import Link from "next/link";
import { Footnotes } from "@/components/Footnote";
import { Stabby } from "@/components/Crate";

export default function Page() {
	const footnotes = new Footnotes({
		calvaire: <>Calendar Versioning, also sounds like "calvaire", which is french for "suffering".</>,
		corporate: <>I have seen companies where this is written policy...</>,
		versions_are_boring: <>Admit it, you also hate thinking of supply chain stuff for too long.</>,
		tooling: <>One could argue that a tool doesn't need to be perfect to be useful, and I agree, but those are valid concerns.</>
	})
	return <Post header={header} comments={[
		// {
		// 	author: "YOUR NAME HERE",
		// 	date: new Date("1984/06/21"),
		// 	comment: <>YOUR COMMENT HERE</>
		// }
	]}>
		<p>Semantic Versioning (SemVer for short) is a versioning convention that has gained much traction over the recent years, notably thanks to its integration within <code>npm</code> and <code>cargo</code>.</p>
		<p>While it is a serious step up from CalVer{footnotes.link("calvaire")}, and that I prefer it to most other version numbering systems I've encountered, I still have quite a few gripes with it; to the point that I've tried to come up with a few compatible systems that attempt to fix the things I dislike about it.</p>
		<p>This post is focused on summarizing SemVer's shortcomings, so that later posts explaining alternatives can focus on that rather than the ranting.</p>

		<h2>A recap of SemVer</h2>
		<p>The way SemVer works is by defining versions as a set of 3 integers, generally formatted <code>MAJOR.MINOR.PATCH</code>. While its rules are often described as a set of "when you do X, you should increment this integer to be SemVer compliant".</p>
		<p>I find this way of describing SemVer to be counter-productive. Instead, let's focus on the <em>spirit</em> of SemVer; by looking at it not from the author's perspective, but from the API consumer's:</p>
		<ul>
			<li>Any two versions of a software package with a common <code>MAJOR</code> and <code>MINOR</code> <b>MUST</b> be <em>entirely</em> compatible.</li>
			<li>Any version with a given <code>MAJOR</code> <b>MUST</b> be compatible with <em>all</em> of its predecessors.</li>
		</ul>
		<p>These rules are simple in concept, and easy for package consumers (be they developers or automated tools). However, they can get pretty nerve wracking for producers (also developers).</p>
		<p>As a disclaimer, I'll state that while I have gripes with SemVer, which I'll expand on for the rest of this post; it's still "the worst form of [version numbering], except for all the others" in my opinion: it just needs a few touch ups now that we've learned on the field.</p>

		<h2>The problems with SemVer (or how we're using it)</h2>
		<p>Note that a lot of these gripes are not necessarily due to <Link href={"https://semver.org/"}>semver.org</Link>'s intent. However, I do find that the wording in that document is often counter-productive by being overly prescriptive; and I personally find their stance the whole "where does an OSS developer's responsibility start and end for work that they are making available for free" debate too extreme, but I'll try to avoid that subject so as to not detract from the point.</p>

		<h3>The <code>1.0.0</code> falacy and the <code>0.x.y</code> trap</h3>
		<p>SemVer explicitly encourages you to stay in <code>0.x.y</code> until you've defined and stabilized your project's API; waiting until your API is defined and stable to declare <code>1.0.0</code>.</p>
		<p>While the spirit behind this is to provide projects with a grace period in which everything flies, what this creates instead is a "fear" of getting to <code>MAJOR=1</code>: <em>"Once I hit <code>1.0.0</code>, I'll be stuck with the choices I've made until now... Am I really ready for that?"</em>.</p>
		<p>In turn, this is very observable when looking at popular projects on <Link href={"https://crates.io"}>crates.io</Link>: of the top 10 most downloaded crates, 4 are still on <code>0.x.y</code> despite their API having been notoriously stable:</p>
		<ul>
			<li><code>rand</code> hasn't received a new version for over 2 years!</li>
			<li><code>hashbrown</code> is part of the standard library, and as such is straight up forbidden from making changes that would force a <code>MAJOR</code> change, lest it gets demoted from that position as "Rust's standard HashMap"...</li>
			<li><code>libc</code> has been planning <code>0.3.0</code> release... for more than a year!</li>
		</ul>
		<p>You'll notice when looking in closer at <code>rand</code> and <code>libc</code> that these projects <em>do</em> intend on making some breaking changes, some of which are already in the pipeline. But all of these projects are factually <em>stable</em> considering they're being dependended on by most of the rest of the Rust ecosystem!</p>
		<p>And here lies the greatest abheration about SemVer: you're not deemed "stable" or "ready to use" before <code>1.0.0</code>{footnotes.link("corporate")}, but you shouldn't go to <code>1.0.0</code> until your API is stable.</p>

		<h3>The <code>MAJOR</code> bump phobia</h3>
		<p>The problems don't stop once you reach <code>1.0.0</code>: <code>MAJOR</code> bumps scare developers and users alike!</p>
		<p>Here's a little anecdote highlighting and exaggerating an issue I have observed a few times:</p>
		<ul>
			<li>The devs push from <code>2.3.0</code> to <code>3.0.0</code>, reshaping the entire API.</li>
			<li>The users look at the scale of this update in horror, having to pick between staying on the now unsupported <code>MAJOR=2</code> branch; or dedicate time to upgrading to <code>MAJOR=3</code>, possibly delaying other aspects of their project.</li>
			<li>The dev look at the chaos this caused in their community and over-correct their course: swearing to themselves never to up the <code>MAJOR</code> again.</li>
			<li>A year later, newcomers ask if they can make a small breaking change in order to gain performance: they are instead informed that management dislikes <code>MAJOR</code> upgrades for fear of losing customers, as they had been very negative about the last <code>MAJOR</code> bump.</li>
		</ul>
		<p>And just like that, the project's future innovations are stunted, doomed to carry around any tech debt that slipped through.</p>

		<h3>Multi-package projects</h3>
		<p>Some projects encompass multiple packages: bindings in various languages, plugins, associated custom debug tools...</p>
		<p> Most of these projects then opt to keep versions synchronized between these packages to make their cross-compatibility more readable. This also helps mutualize documentation between bindings by being able to make sweeping statements about a given version.</p>
		<p>This leads to an additional conundrum: is a breaking change in one of the packages desirable enough that all other packages would see their version bumped as well?</p>

		<h3>What even <em>is</em> compatibility</h3>
		<p>SemVer decrees that your version should be guided by what you define as your public API. However, the classical definition of API is not enough to encompass what some projects may define as their API, or even what users expect the projects treat as such:</p>
		<div style={{ margin: "auto", display: "block", width: "50ex" }}>
			<img src="https://imgs.xkcd.com/comics/workflow.png" alt="XKCD 'Workflow' Comic where a user complains that they used CPU temperature to trigger actions, and that optimizing the software was a breaking change to them" style={{ margin: "auto", display: "block" }} />
			<p style={{ textAlign: "center" }}><Link href={"https://www.hyrumslaw.com/"}>Hyrum's Law</Link> at work</p>
		</div>
		<ul>
			<li>Invariants: you can keep a public API identical in every regard but for a few invariants that need to be upheld. Does changing these invariants constitute an API break? (YES)</li>
			<li>IO protocols: can the user expect two SemVer-compatible version of a package to be able to communicate with each other on the network? Or to load each-other's save/config files?</li>
			<li>ABI: can the user expect that swapping out a package's binary for one of a SemVer-compatible version would work? While this question is irrelevant to a lot of languages, it is relevant to Rust.</li>
			<li>Side effects: every now and then, you hear of "that client" who parses your internal <code>debug</code> in a background thread to raise events based on them.</li>
		</ul>

		<h3>SemVer is often assumed...</h3>
		<p>One of SemVer's greatest boons to us is how tooling can use it to do smart stuff around versions, allowing them to have to think less about them{footnotes.link("versions_are_boring")}.</p>
		<p>The value of this boon can be argued on grounds of "this opens you up to low-visibility changes in your program", increasing your vulnerability to supply-chain attack.</p>
		<p>But even without malicious intent, this boon can easily become a curse if a dependency fails to uphold the SemVer contract they tacitly agree to by publishing themselves on SemVer-based distribution systems.</p>

		<h3>...but rarely enforced</h3>
		<p>The problem here is that it's extremely easy to accidentally break one of your APIs, and just as easy to voluntarily break one, and forget about having done that by the time you actually do the release.</p>
		<p>I've been personally bit by this several times: a dependency releases a "breaking patch" and your CI starts emailing you; and once you pin a version to avoid future issues, you become implicitly incompatible with other packages that pinned a different patch version for the same reason. Why this incompatibility? Because <code>cargo</code> assumes that all crates respect SemVer and that a situation where 2 distinct patches of a given dependency should not be allowed in the same binary; which makes sense until you remember how fallible humans are, and how easy it is to break your API.</p>
		<p>In Rust, we even have the notion of semver-hazards: API properties that can accidentally break through subtle acts. One such example is the <code>Sync</code> trait: this trait indicates that it is safe to access an object from another thread by reference; it's automatically implemented by the compiler for types that are composed only of <code>Sync</code> fields, which means that adding a field that isn't <code>Sync</code> to a previously <code>Sync</code> type is an API breaking change.</p>
		<p><code>Sync</code>'s existence is a good thing, it lets us prove that a given type is "thread-safe"; and the fact that one doesn't need to systematically remember to implement it is a good thing; but it does mean that adding a raw pointer to your struct is a breaking change unless you remember to manually implement <code>Sync</code> for it (provided it <em>is</em> still <code>Sync</code>).</p>
		<p>One could argue that this is a tooling issue: "you should use tool X that lets you know what your changes since commit Y qualify as". I agree, but how would that tool measure invariants and networking protocols?{footnotes.link("tooling")} Could such a tool warn you of semver-mines you've just set at your own feet?</p>

		<h3>Non-compliant spin-offs</h3>
		<p>Due to it being misunderstood and the stigma around <code>MAJOR</code> bumps, people will often misuse SemVer to associate their own meanings to it.</p>
		<p>I was notably guilty of this with <Stabby />, originally positing that "small" breaking changes would only get a minor bump, as I was back then under the (false) impression that <code>cargo</code> would only implicitly upgrade patch-level changes.</p>

		<h2>OK, you done ranting? What do you propose to fix this then?</h2>
		<p>Well, a couple of things actually, both opting to work with a strict subset of SemVer to stay compatible with it while providing more information:</p>
		<ul>
			<li><Link href={"/humane-semver"}>Humane SemVer</Link> is a trivial concept: don't bump your release by 1, but by a rough qualifier of how much has changed.</li>
			<li><Link href={"/semver-prime"}>SemVer Prime</Link>: I heard you liked versions, so I put versions in your versions so you can version your versions.</li>
		</ul>
		{footnotes.footer()}
	</Post>
}
