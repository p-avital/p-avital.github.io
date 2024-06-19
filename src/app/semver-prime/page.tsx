'use client'
import { Post } from "@/components/Post";
import { Stabby } from "@/components/Crate";
import { header } from './header'
import Link from "next/link";
import { ReactElement, useRef, useState } from "react";

export default function Page() {
	return <Post header={header} comments={[
		// {
		// 	author: "YOUR NAME HERE",
		// 	date: new Date("1984/06/21"),
		// 	comment: <>YOUR COMMENT HERE</>
		// }
	]}>
		<p>SemVer Prime is one of my attempts at <Link href="/tfios">fixing SemVer</Link>. It's meant to get you to think a bit more about your versioning. If you'd like more freedom, check out  <Link href="/humane-semver">Humane SemVer</Link>!</p>

		<h2>SemVer Prime, or Gödel's SemVer</h2>
		<p>SemVer Prime is a new way of doing SemVer, which puts more SemVers in your SemVer!</p>
		<p>It works using prime numbers and a bit of madness: it works a bit like <Link href={"https://en.wikipedia.org/wiki/G%C3%B6del_numbering"}>Gödel's encoding</Link>. But an interactive demo is worth a thousand words:</p>
		<SemverPrime />

		<h2>Hmm... Yes I see, this version number is made of version numbers!</h2>
		<p>Exactly! Specifically, the version number is computed through the following math: each dimension <code>dim</code> of our versioning (API, ABI, Networking Protocol...) is assigned a prime number <code>p<sub>dim</sub></code>.</p>
		<p>Each section of the global semver is then computed with the following formula:</p>
		<code>
			V<sub>global</sub> = Π<sub>dim</sub>(p<sub>dim</sub><sup>V<sub>dim</sub></sup>) - 1
		</code>
		<p>The beauty of this formula is that it has a few very convenient properties:</p>
		<ul>
			<li>It's bijective: provided that you know which prime goes with which dimension, factorizing <code>V<sub>global</sub> + 1</code> gives you each dimension's version <code>V<sub>dim</sub></code>.</li>
			<li>It's monotonic: increasing any component of a dimension's version will increase the global version. This makes SemVer Prime a compliant subset of SemVer!</li>
		</ul>
		<p>But ultimately, the true beauty in Prime SemVer is the fact that your version number can now have dimensions. This means that it can now communicate <em>what</em> is still compatible, instead of just telling the user that two versions have a given level of global compatibility.</p>
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

		<h2>Conclusion</h2>
		<p>While it is a lot more complicated than <Link href={"/humane-semver"}>Humane SemVer</Link>, Prime SemVer has the quality of allowing users to identify <em>what</em> changes have been enacted on their dependencies purely through version numbering alone. In fact, dividing a new version by the one you currently use (adding 1 to each before doing that) gives you a list of the dimensions that have changed!</p>
		<p>I find this property awesome, and will personally endeavour to push projects I have a voice in to transition to Prime SemVer.</p>
		<p>And on that note: <Stabby />'s current release is <code>5.1.0</code>, which corresponds to <code>API="1.1.0" ABI="1.0.0"</code>, and this is now its full version decoding: <Stabby /> now officially follows Prime SemVer!</p>
		<p>I leave you with a more convenient (and two-way) Prime SemVer translation tool:</p>
		<Translator />
		<p>Usage (describing each text area from left to right):</p>
		<ul>
			<li><b>Split versions</b>: a linebreak-separated list of <code>dimension = "x.y.z"</code>, editing it will refresh the global version.</li>
			<li><b>Key</b>: a comma-separated list of dimension names; each dimension is assigned a prime corresponding to its position. Editing it will refresh the global version.</li>
			<li><b>Global version</b>: Must be <code>global = "x.y.z"</code>, editing it will refresh the split versions.</li>
		</ul>
	</Post>
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
	return `global = "${major - 1}.${minor - 1}.${patch - 1}"`
}
function factorize(x: number, by: number): number {
	let r = 0;
	while (x % by == 0) {
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
		major += parsed[0]
		minor += parsed[1]
		patch += parsed[2]
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
	const [versions, setVersions] = useState('api = "1.1.0"\nabi = "1.0.0"')
	const [global, setGlobal] = useState('global = "5.1.0"')
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
				<td style={{ ...tdStyle, color: Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[0]) * current, 1) - 1 > Number.MAX_SAFE_INTEGER ? "red" : "unset" }}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[0]) * current, 1) - 1}</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[1]) * current, 1) - 1}</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[2]) * current, 1) - 1}</td>
			</tr>
		</tbody>
	</table >
}