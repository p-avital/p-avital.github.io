'use client'
import { Post } from "@/components/Post";
import { header } from './header'
import Link from "next/link";
import { ReactElement, useState } from "react";

const primes = [2, 3, 5];
function prime(index: number) {
	for (let n = primes[primes.length - 1]; primes.length <= index; n += 2) {
		if (primes.every(p => n % p != 0)) {
			primes.push(n);
		}
	}
	return primes[index]
}
function SemverPrime(): ReactElement {
	const [versions, setVersions] = useState({
		API: [2, 0, 2],
		ABI: [1, 3, 0],
		Network: [1, 0, 0],
		Storage: [0, 1, 0],
	} as Record<string, [number, number, number]>)
	const tdStyle = { paddingRight: "2em" }
	return <table>
		<thead>
			<tr>
				<td>Category</td>
				<td>Major</td>
				<td>Minor</td>
				<td>Patch</td>
			</tr>
		</thead>
		<tbody>
			{
				Object.entries(versions).map(([name, version], index) => <tr key={index}>
					<td style={tdStyle}>{name}</td>
					<td style={tdStyle}><sub>{prime(index)}</sub>{version[0]}</td>
					<td style={tdStyle}><sub>{prime(index)}</sub>{version[1]}</td>
					<td style={tdStyle}><sub>{prime(index)}</sub>{version[2]}</td>
				</tr>)
			}
			<tr>
				<td style={tdStyle}>Total</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[0]) * current, 1)}</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[1]) * current, 1)}</td>
				<td style={tdStyle}>{Object.values(versions).reduce((current, version, index) => Math.pow(prime(index), version[2]) * current, 1)}</td>
			</tr>
		</tbody>
	</table>
}

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
	</Post>
}
