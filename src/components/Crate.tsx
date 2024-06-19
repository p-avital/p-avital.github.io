import Link from "next/link";
import { ReactElement } from "react";

export function Crate({ children }: { children: string }): ReactElement {
	return <Link href={`https://crates.io/crates/${children}`}><code>{children}</code></Link>
}

export function Stabby(): ReactElement {
	return Crate({ children: "stabby" })
}