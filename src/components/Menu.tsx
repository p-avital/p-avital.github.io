import Link from "next/link"
import Image from "next/image"

export function Menu() {
	return <div style={{ padding: "1em", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
		<Link href="/"><Image src="/images/logo-tiny.png" height={48} width={48} alt="Home" title="Yes, this is a home button" /></Link>
	</div>
}