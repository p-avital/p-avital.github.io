'use client'
import { Post } from "@/components/Post";
import { Stabby } from "@/components/Crate";
import { header } from './header'
import Link from "next/link";
import { ReactElement, useRef, useState } from "react";
import { Footnotes } from "@/components/Footnote";

export default function Page() {
	return <Post header={header} comments={[
		// {
		// 	author: "YOUR NAME HERE",
		// 	date: new Date("1984/06/21"),
		// 	comment: <>YOUR COMMENT HERE</>
		// }
	]}>
		<p>SemVer Prime{footnotes().link("prime")} is one of my attempts at <Link href="/tfios">fixing SemVer</Link>. It's meant to get you to think a bit more about your versioning. If you'd like more freedom, check out  <Link href="/humane-semver">Humane SemVer</Link>!</p>

		<h2>SemVer Prime, or Gödel's SemVer</h2>
		<p>SemVer Prime is a new way of doing SemVer, which puts more SemVers in your SemVer!</p>
		<p>It works using prime numbers and a bit of madness; a bit like <Link href={"https://en.wikipedia.org/wiki/G%C3%B6del_numbering"}>Gödel's encoding</Link>, really. But an interactive demo is worth a thousand words:</p>
		<SemverPrime />

		<h2>Hmm... Yes I see, this version number is made of version numbers!</h2>
		<p>Exactly! Specifically, the version number is computed through the following math: each dimension <code>dim</code> of our versioning (API, ABI, Networking Protocol...) is assigned a prime number <code>p<sub>dim</sub></code>.</p>
		<p>Each section of the global semver is then computed with the following formula:</p>
		<code>
			V<sub>global</sub> = Π<sub>dim</sub>(p<sub>dim</sub><sup>V<sub>dim</sub></sup>)
		</code>
		<p>The beauty of this formula is that it has a few very convenient properties:</p>
		<ul>
			<li>It's bijective: provided that you know which prime goes with which dimension, factorizing <code>V<sub>global</sub></code> gives you each dimension's version <code>V<sub>dim</sub></code>. In fact, you can divide a new version by the previous one to deduce which dimensions have changed.</li>
			<li>It's monotonic: increasing any component of a dimension's version will increase the global version. This makes SemVer Prime a compliant subset of SemVer!</li>
			<li>It starts at <code>1.1.1</code>, meaning you've already outgrown the <Link href="/tfios#0_x_y"><code>0.x.y</code> trap</Link> the moment you start using SemVer Prime! This also means that you can transition from the trap to SemVer Prime whenever you decide to graduate from <code>MAJOR=0</code>.</li>
			<li>On that note, SemVer Prime is purely descriptive: one dimension's version being at <code>0.x.y</code> doesn't mean it's unstable, it just means there hasn't been a breaking change in it since it started getting tracked.</li>
			<li>SemVer Prime allows you to change which prime is assigned to which dimension in two cases: <ul>
				<li>The prime was assigned to a dimension whose version was <code>0.0.0</code>, and so was its new assigned dimension's version.</li>
				<li>When upgrading the "Versioning"'s dimension (something we'll discuss later), although doing so is discouraged as it can make decoding your versions confusing.</li></ul></li>
		</ul>
		<p>But ultimately, the true beauty in SemVer Prime is the fact that your version number can now have dimensions. This means that it can now communicate <em>what</em> is still compatible, instead of just telling the user that two versions have a given level of global compatibility.</p>
		<p>This can be even more precious for projects that want to keep orthogonal sub-projects' version synced: just add one dimension per subproject!</p>

		<h2>But won't the numbers get very big?</h2>
		<p>They will! :D</p>
		<p>Oh, you mean it as a bad thing? Well, that <em>is</em> SemVer Prime's weak point.</p>
		<p>More specifically, it may lead to issues with SemVer-based tooling that parses each number as a bounded integer (which is most of them).</p>
		<p>According to a bit of googling I've done, you should generally not expect SemVer tooling to play nice with numbers above JS's <code>MAX_SAFE_INTEGER</code>, i.e. <code>2<sup>53</sup> - 1</code>. That does give you a bit of wiggle room (even though the global version grows exponentially).</p>

		<h2>Soo... back to square one?</h2>
		<p>Not so fast! Notice that "New Dimension" in the interactive tool? Well that's our escape hatch! When you reach an overflow on one of your dimension, you can follow this protocol:</p>
		<ul>
			<li>Release a transition version: this version bumps the "Versioning" dimension's major, adding it to the schema if necessary, while resetting every other dimension to <code>0.0.0</code>. This transition version should be <em>identical</em> to the latest version of the previous "Versioning" version, and users should be informed of that.</li>
			<li>The next release can then bump the appropriate version dimensions as would normally be done.</li>
		</ul>
		<p>This transition version is SemVer-legal thanks to the fact that versions with differing majors are never expected to be compatible, but are allowed to. This means that seeing the major decrease, while surprising, is compliant thanks to the new number being guaranteed unique.</p>
		<p>One can argue that this breaks the "bigger number = more recent" aspect of versioning that's usually expected of a version numbering system, and it's a very fair critique. However, due to the exponential growth of SemVer Prime's values, I tend to think of it as "not something a human should interact with in its 'compressed' form": comparing 10-ish digit numbers is surprisingly hard!</p>
		<p>As such, SemVer Prime is mostly designed to allow compressing a set of versions into a single version number that interacts well with SemVer-based tools... Except for the ones that tell you which version is the "latest"{footnotes().link("latest")}...</p>

		<h2>Ok! I'm sold! How do I <em>actually</em> use this</h2>
		<p>You should start by defining your "key": the ordered list of dimensions you'll be keeping track of. You can always add more dimensions later, so you don't need to overthink it too much.</p>
		<p>You should sort your key such that versions that are likely to change more often get assigned smaller primes. For example, if your library is a networking protocol, you'll probably want "Network" to be near the end of your key, as this is usually something we avoid making breaking changes to as upgrading requires a full redeployment for users{footnotes().link("bidirectional")}.</p>
		<p>If your project has a set of "official" bindings, you may want to version each of them independently by adding one dimension per supported language familly; placing your higher support tiers at the begining of the list.</p>
		<p>You should advertise that you're using this specific way of versioning to your users, ideally giving them an easy way to obtain the multi-dimension equivalent of your current version{footnotes().link("cta")}.</p>

		<h2>Conclusion</h2>
		<p>While it is a lot more complicated than <Link href={"/humane-semver"}>Humane SemVer</Link>, SemVer Prime has the quality of allowing users to identify <em>what</em> changes have been enacted on their dependencies purely through version numbering alone. In fact, dividing a new version by the one you currently use (adding 1 to each before doing that) gives you a list of the dimensions that have changed!</p>
		<p>I find this property awesome, and will personally endeavour to push projects I have a voice in to transition to either SemVer Prime if they could also benefit from its mutli-dimensionality, or to <Link href={"/humane-semver"}>Humane SemVer</Link> if they don't.</p>
		<p>And on that note: at the time of writing, <Stabby />'s latest release is <code>5.1.0</code>, which will be its last non-SemVer Prime version, as I would like to start keeping track of its API and ABI separately.</p>
		<p>I leave you with a more convenient (and two-way) SemVer Prime translation tool:</p>
		<Translator />
		<p>Usage (describing each text area from left to right):</p>
		<ul>
			<li><b>Split versions</b>: a linebreak-separated list of <code>dimension = "x.y.z"</code>, editing it will refresh the global version.</li>
			<li><b>Key</b>: a comma-separated list of dimension names; each dimension is assigned a prime corresponding to its position. Editing it will refresh the global version.</li>
			<li><b>Global version</b>: Must be <code>global = "x.y.z"</code>, editing it will refresh the split versions.</li>
		</ul>
		{footnotes().footer()}
	</Post>
}

let footnotesSingleton: Footnotes | undefined;
function footnotes(): Footnotes {
	if (!footnotesSingleton) {
		footnotesSingleton = new Footnotes({
			prime: <>I swear this one's not yet another streaming service. That would be SemVer Plus...</>,
			latest: <>This is actually SemVer Prime's biggest issue in my opinion, as this could make it hard for package repositories to accurately show your project's latest version.</>,
			bidirectional: () => <>As an aside, certain dimensions, like "Networking", may refer to bidirectional dependencies: network peers both depend on each other using a compatible protocol. In such conditions, any update is either a patch or a major{footnotes().link("networking")}.</>,
			cta: <>I'm planning on eventually creating a badge system for SemVer Prime, but I'll first need to figure out a 0-cost way to host that. If you know of such a hosting solution, please let me know :)</>,
			networking: <>Note that if your networking protocol supports multiple internal versions of your protocol, you're probably better off giving each of these internal versions their own dimension. When a release adds support for that protocol, bump that dimension's minor; and bump that dimension's major when support is removed. If it doesn't, keep your life simple and just bump the major of a single networking dimension everytime you break it.</>,
		})
	}
	return footnotesSingleton
}

const primes = [2, 3, 5];
function prime(index: number) {
	for (let n = primes[primes.length - 1]; primes.length <= index; n += 2) {
		if (primes.every(p => n % p != 0)) {
			primes.push(n);
		}
	}
	return primes[index]
}
function Counter({ base, value, setValue }: { base: number, value: number, setValue: (value: number) => any }) {
	return <><sub>{base}</sub><input type="number" style={{ width: "4em" }} value={value} onChange={(e) => setValue(parseInt(e.target.value))} /></>
}
function parseVersions(versions: string): Record<string, [number, number, number]> {
	const result: Record<string, [number, number, number]> = {}
	for (const line of versions.split('\n')) {
		if (!line.trim()) { continue }
		let [dimension, version] = line.split("=")
		version = line.split('"')[1]
		const parsed = version.split('.').map(s => { return parseInt(s) })
		if (parsed.length != 3 || parsed.some(Number.isNaN)) {
			throw `ParseError: Versions must be 3 integers separated by dots with no spaces ${version} ${parsed}`
		}
		result[dimension.trim()] = parsed as [number, number, number]
	}
	return result
}
function uncomment(text: string) {
	return text.split('\n').map(s => s.split('#')[0]).join('\n')
}
function translateForward(versions: string, key: string): string {
	const errors: string[] = []
	let major = 1
	let minor = 1
	let patch = 1
	const keys = uncomment(key).split(',').map(s => s.trim()).filter(s => s)
	try {
		const parsed = parseVersions(uncomment(versions))
		for (const key in parsed) {
			const index = keys.indexOf(key)
			if (index == -1) { throw `${key} is not in your dimensions`; }
			const base = prime(index)
			major *= Math.pow(base, parsed[key][0])
			minor *= Math.pow(base, parsed[key][1])
			patch *= Math.pow(base, parsed[key][2])
		}
	} catch (e) {
		errors.push((e as any).toString())
	}
	if (errors.length) {
		errors.unshift("Errors detected:")
		return errors.join('\n')
	}
	return `global = "${major}.${minor}.${patch}"`
}
function factorize(x: number, by: number): number {
	let r = 0;
	while (x % by == 0 && x != 0) {
		x /= by
		r++
	}
	return r
}
function translateBackward(versions: string, key: string): string {
	const errors: string[] = []
	const keys = uncomment(key).split(',').map(s => s.trim()).filter(s => s)
	const result: string[] = []
	let major = 1
	let minor = 1
	let patch = 1
	try {
		const parsed = parseVersions(uncomment(versions)).global
		major = parsed[0]
		minor = parsed[1]
		patch = parsed[2]
		keys.forEach((key, index) => {
			const base = prime(index)
			const version = [factorize(major, base), factorize(minor, base), factorize(patch, base)]
			major /= Math.pow(base, version[0])
			minor /= Math.pow(base, version[1])
			patch /= Math.pow(base, version[2])
			if (version.some(s => s)) {
				result.push(`${key} = "${version.join('.')}"`)
			}
		})
		if (major != 1) {
			errors.push(`major not fully factorized: your key must be missing the dimensions corresponding to the factors of ${major}`)
		}
		if (minor != 1) {
			errors.push(`minor not fully factorized: your key must be missing the dimensions corresponding to the factors of ${minor}`)
		}
		if (patch != 1) {
			errors.push(`patch not fully factorized: your key must be missing the dimensions corresponding to the factors of ${patch}`)
		}
	} catch (e) {
		errors.push((e as any).toString())
	}
	if (errors.length) {
		errors.unshift("Errors detected:")
		return errors.join('\n')
	}
	return result.join('\n')
}
function Translator(): ReactElement {
	const [key, setKey] = useState("api,\nabi,\nnetwork,\nstorage,\nversioning");
	const [versions, setVersions] = useState('api = "1.0.0"\nabi = "1.0.0"')
	const [global, setGlobal] = useState(translateForward(versions, key))
	const rows = Math.max(key.split('\n').length)
	return <div>
		<textarea rows={rows} value={versions} onChange={(e) => { setVersions(e.target.value); setGlobal(translateForward(e.target.value, key)) }} />
		<textarea rows={rows} value={key} onChange={(e) => { setKey(e.target.value); setGlobal(translateForward(versions, e.target.value)) }} />
		<textarea rows={rows} value={global} onChange={(e) => { setGlobal(e.target.value); setVersions(translateBackward(e.target.value, key)) }} />
	</div>
}
function SemverPrime(): ReactElement {
	const presetDimensions = ["API", "ABI", "Network", "Storage", "Potatoes", "Pandas", "Bananas"]
	const [versions, setVersions] = useState({
		API: [1, 0, 0],
		ABI: [0, 1, 0],
		Network: [0, 1, 0],
	} as Record<string, [number, number, number]>)
	const setVersion = (name: string, index: number, value: number) => {
		const edited = Object.fromEntries(Object.entries(versions).map(([key, version]) => key != name ? [key, version] : [key, [...version.slice(0, index), value, ...version.slice(index + 1)]]))
		setVersions(edited as any)
	}
	const newDim = useRef(null as any)
	const tdStyle = { paddingRight: "2em" }
	return <table>
		<thead>
			<tr>
				<td><b>Category</b></td>
				<td><b>Major</b></td>
				<td><b>Minor</b></td>
				<td><b>Patch</b></td>
			</tr>
		</thead>
		<tbody>
			{
				Object.entries(versions).map(([name, version], index) => <tr key={index}>
					<td style={{ ...tdStyle, display: "flex", justifyContent: "space-between" }}>
						{name}
						<button onClick={() => { setVersions(Object.fromEntries(Object.entries(versions).filter(([key, _]) => name != key))) }}>X</button>
					</td>
					<td style={tdStyle}><Counter base={prime(index)} value={version[0]} setValue={(value) => setVersion(name, 0, value)} /></td>
					<td style={tdStyle}><Counter base={prime(index)} value={version[1]} setValue={(value) => setVersion(name, 1, value)} /></td>
					<td style={tdStyle}><Counter base={prime(index)} value={version[2]} setValue={(value) => setVersion(name, 2, value)} /></td>
				</tr>)
			}
			<tr>
				<td style={{ ...tdStyle, display: "flex", justifyContent: "space-between" }}>
					<input type="text" placeholder="New Dimension" ref={newDim} style={{ width: "10em", marginRight: "1em" }} />
					<button onClick={() => {
						const version = newDim.current?.value || presetDimensions[Object.keys(versions).length]
						if (version) { setVersions({ ...versions, [version]: [0, 0, 0] }); newDim.current.value = ""; }
					}}>Add</button>
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>Global Version</td>
				<td style={{ ...tdStyle, color: Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[0]) * current, 1) - 1 > Number.MAX_SAFE_INTEGER ? "red" : "unset" }}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[0]) * current, 1)}</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[1]) * current, 1)}</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[2]) * current, 1)}</td>
			</tr>
		</tbody>
	</table >
}