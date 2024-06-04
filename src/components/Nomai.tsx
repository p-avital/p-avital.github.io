export class Vec2 {
	x: number
	y: number
	constructor(x: number, y: number) { this.x = x; this.y = y }
	add(other: Vec2): Vec2 { return new Vec2(this.x + other.x, this.y + other.y) }
	sub(other: Vec2): Vec2 { return new Vec2(this.x - other.x, this.y - other.y) }
	len(): number { return Math.sqrt(this.x * this.x + this.y * this.y) }
	angle(): number { return Math.atan2(this.y, this.x) }
}
class Letter {
	shape: number
	edges: number
	mirrored: boolean
	constructor(shape: number, edges: number, mirrored: boolean) { this.edges = edges, this.shape = shape, this.mirrored = mirrored }
	static firstWithShape(shape: number): Letter { return new Letter(shape, 1 + ((shape + 1) / 2), false) }
	next(): Letter {
		if (this.edges < this.shape) {
			return new Letter(this.shape, this.edges + 1, this.mirrored)
		} else if (this.mirrored) {
			return Letter.firstWithShape(this.shape + 1)
		} else {
			const ret = Letter.firstWithShape(this.shape)
			ret.mirrored = true
			return ret
		}
	}
	point(i: number): Vec2 {
		const angle = i * (2 * Math.PI) / this.shape;
		return new Vec2(1 - Math.cos(angle), -Math.sin(angle))
	}
	draw([start, end]: [Vec2, Vec2], drawFn: (segment: [Vec2, Vec2]) => any) {
		const Y = end.sub(start)
		const X = this.point(Math.floor((this.shape + 1) / 2))
		const transformA = (X.x * Y.x + X.y * Y.y) / (X.x * X.x + X.y * X.y)
		const transformB = (Y.y - transformA * X.y) / X.x
		// console.log({ X, Y, transformA, transformB })
		let previous = start
		for (let i = 1; i <= this.edges; i++) {
			const point = this.point(i);
			const next = new Vec2(start.x + transformA * point.x - transformB * point.y,
				start.y + transformB * point.x + transformA * point.y)
			drawFn([previous, next])
			previous = next
		}
	}
}
export class Alphabet {
	alphabet: Letter[]
	constructor() {
		this.alphabet = [];
		for (let letter = Letter.firstWithShape(3); this.alphabet.length < 16; letter = letter.next()) {
			this.alphabet.push(letter)
		}
	}
	translitterate(text: Buffer, onChar: (char: [Letter, Letter]) => any) {
		for (let i = 0; i < text.length; i++) {
			const c = text[i];
			onChar([this.alphabet[c & 0xf], this.alphabet[(c >> 4) & 0xf]])
		}
	}
	translate(text: string, curve: (t: number) => Vec2, drawFn: (segment: [Vec2, Vec2]) => any) {
		const buffer = Buffer.from(text);
		const len = buffer.length;
		let i = 0;
		this.translitterate(buffer, ([l, r]) => {
			const start = curve(i / len)
			const lr = curve((i + 0.45) / len)
			const rp = curve((i + 0.9) / len)
			const end = curve((i + 1) / len)
			l.draw([lr, start], drawFn)
			r.draw([lr, rp], drawFn) // invert start and end to turn the symbol around
			drawFn([rp, end])
			i += 1
		})
	}
}

export const alphabet = new Alphabet()