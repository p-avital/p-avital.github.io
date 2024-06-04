'use client'
import { header } from './header'
import { Post } from "@/components/Post";
import Link from 'next/link';
import { CSSProperties, ReactElement, useEffect, useRef, useState } from "react";
import { alphabet, Vec2 } from '@/components/Nomai';

interface SpiralArgs { textLength: number, root: Vec2, rootAngle: number, clockwise: boolean, scale: number }
class GoldenSpiral {
  length: number
  shift: Vec2
  beta: number
  rootAngle: number
  scale: number
  angleScale: number
  textLength: number
  constructor({ textLength = 10,
    root = new Vec2(0, 0),
    rootAngle = 0,
    scale = 1,
    clockwise = true }: SpiralArgs) {
    this.textLength = textLength
    this.length = 0.8 + (0.15 - 0.3 * Math.exp(-textLength))
    const phi = (1 + Math.sqrt(5)) / 2
    this.beta = Math.PI / (2 * Math.log(phi))
    this.scale = scale
    this.angleScale = clockwise ? -1 : 1
    this.rootAngle = rootAngle + Math.atan(1 / this.beta) * this.angleScale + (clockwise ? 0 : Math.PI)
    this.shift = root.sub(this.unrooted(1))
  }
  angle(r: number): number { return this.angleScale * this.beta * Math.log(r) + this.rootAngle }
  radius(angle: number): number {
    angle -= this.rootAngle
    if (angle < 0) {
      angle += 2 * Math.PI
    }
    angle *= this.angleScale
    angle /= this.beta
    return Math.exp(angle) * this.scale
  }
  unrooted(r: number): Vec2 {
    const angle = this.angle(r)
    return new Vec2(
      r * Math.cos(angle) * this.scale,
      r * Math.sin(angle) * this.scale
    )
  }
  render(t: number): Vec2 { return this.unrooted(1 - (t * this.length)).add(this.shift) }
  contains(p: Vec2, margin?: number): boolean {
    p = p.sub(this.shift)
    const angle = p.angle()
    margin ??= this.render(1 / this.textLength).sub(this.render(0)).len()
    const r = this.radius(angle);
    const len = p.len()
    return len <= margin + r
  }
}

class Stroke {
  constructor(
    public start: Vec2,
    public end: Vec2,
    public style: string = "white",
    public width: number = 0.2) { }
}
class Triangle {
  constructor(
    public a: Vec2,
    public b: Vec2,
    public c: Vec2
  ) { }
  contains(v: Vec2): boolean { return false }
}
class Hitbox {
  constructor(
    public predicate: (p: Vec2) => boolean,
    public callback: (event: React.MouseEvent<HTMLCanvasElement>) => any
  ) {
  }
  checkAndRun(event: React.MouseEvent<HTMLCanvasElement>, translated: Vec2) {
    if (this.predicate(translated)) {
      this.callback(event)
    }
  }
}
function Canvas({ strokes, hitboxes, width, height, style }: { strokes: Stroke[], hitboxes: Hitbox[], width: number, height: number, style?: CSSProperties }) {
  const canvas: any = useRef(null)
  useEffect(() => {
    if (!canvas) { return }
    const context: CanvasRenderingContext2D = canvas.current.getContext("2d")
    context.clearRect(0, 0, width, height)
    context.beginPath();
    let [minx, maxx, miny, maxy] = [1, 0, 1, 0]
    for (const { start, end } of strokes) {
      minx = Math.min(minx, start.x, end.x)
      miny = Math.min(miny, start.y, end.y)
      maxx = Math.max(maxx, start.x, end.x)
      maxy = Math.max(maxy, start.y, end.y)
    }
    const scale = Math.min(width / (maxx - minx), height / (maxy - miny))

    for (const stroke of strokes) {
      context.strokeStyle = stroke.style
      context.lineWidth = stroke.width
      context.moveTo((stroke.start.x - minx) * scale, (stroke.start.y - miny) * scale);
      context.lineTo((stroke.end.x - minx) * scale, (stroke.end.y - miny) * scale);
      context.stroke()
    }
    const triggerHitbox = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!event) { return }
      const rect = (event.target as any).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const translated = new Vec2(
        x / scale + minx,
        y / scale + miny
      )
      for (const hitbox of hitboxes) {
        hitbox.checkAndRun(event, translated)
      }
    }
    canvas.current.onmousemove = triggerHitbox
    canvas.current.onmousedown = triggerHitbox
  }, [canvas, strokes, hitboxes])
  return <canvas style={style} ref={canvas} width={width} height={height} />
}

interface Nomai {
  text: ReactElement
  next?: Nomai[]
}

function dbg<T>(x: T): T {
  console.log(x)
  return x
}
function extractText(component: ReactElement | string): string {
  if (typeof component == "string") { return component }
  const children = component.props?.children;
  switch (typeof children) {
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol':
    case 'function':
      return children.toString()
    case 'string': return children
    case 'undefined': return ""
    case 'object':
      return children.constructor.name == "Array" ? children.map(extractText).join('\n') :
        extractText(children)
  }
}

function generateTree({ nomai, position = [], setPosition, currentPosition, spiralArgs = {}, disable = false }: { nomai: Nomai, currentPosition: number[] | undefined, position?: number[], setPosition: (position: number[]) => any, disable?: boolean, spiralArgs?: Partial<SpiralArgs> }, strokes: Stroke[], hitboxes: Hitbox[]): [Stroke[], Hitbox[],] {
  const text = extractText(nomai.text);
  const args: SpiralArgs = {
    scale: 0.6, root: new Vec2(1, 0), rootAngle: 0, clockwise: true, textLength: text.length, ...spiralArgs
  }
  const spiral = new GoldenSpiral(args)
  alphabet.translate(text, (t) => spiral.render(t), ([start, end]) => { strokes.push(new Stroke(start, end)); })
  hitboxes.push(new Hitbox((p) => spiral.contains(p), (e) => { console.log(e.buttons) }))
  return [strokes, hitboxes]
}

function ButtonTree(args: { nomai: Nomai, currentPosition: number[] | undefined, position?: number[], setPosition: (position: number[]) => any, disable?: boolean }) {
  const [strokes, hitboxes] = generateTree(args, [], [])
  return <Canvas strokes={strokes} hitboxes={hitboxes} width={800} height={1000} />
}

function Screen({ children }: { children: ReactElement }) {
  return <div style={{ fontFamily: "Consolas, monospace", width: "100%", marginTop: "10ex" }}>{children}</div>
}

function TranslatorTool({ nomai }: { nomai: Nomai }) {
  const [position, setPosition] = useState([] as number[])
  let selected: Nomai | undefined = nomai
  for (const index of position) {
    selected = selected?.next?.[index]
  }
  if (!selected) {
    return <>You reached an easter egg! <button onClick={() => setPosition([])}>Get back to safety</button></>
  }
  return <div style={{ width: "100%" }}>
    <ButtonTree setPosition={setPosition} nomai={nomai} currentPosition={position} />
    <Screen>{selected.text}</Screen>
  </div>
}

export default function Page() {
  return <Post header={header}>
    <>This article is built to emulate a core mechanic of the game: translating nomai text bit by bit.</>
    <TranslatorTool nomai={{
      text: <>Have you ever played a game that's since lived in your head rent-free?<br />
        One that changes how you perceive some of the things around you?</>,
      next: [
        {
          text: <>Outer Wilds is one of these games. It's done this to thousands of us.<br />
            It's like a cognito-hazard, and now, I'm gonna infect you with it ::)</>,
          next: [{
            text: <>How can the Outer Wilds be described?</>,
            next: [
              { text: <>It's a five years old indie video game.</> },
              {
                text: <>It's an escape game... In space!</>,
                next: [
                  {
                    text: <>What, you're already convinced?<br />Well, here's the <Link href="https://store.steampowered.com/app/753640/Outer_Wilds/">steam link</Link></>,
                    next: [{
                      text: <>Oh, if you're wondering: <em>Yes</em>, you should absolutely play the DLC!</>,
                      next: [{
                        text: <>But my opinion is that you'd better finish the base game before buying it.<br />
                          Otherwise, you might lack context for some of its reveals.</>
                      }]
                    }]
                  },
                  {
                    text: <>You'll explore a tiny stellar system in your ricketty spaceship<br />
                      Your goal? Uncover all of its secrets!</>
                  }
                ]
              }
            ]
          }]
        },
        {
          text: <>Oh? You have? Was it Outer Wilds?<br />
            Because if it wasn't, you should probably not go any further in this branch.</>,
          next: [{
            text: <>Really? You're sure you've played it? Outer Wilds is best experienced fully blind.<br />
              If you haven't played it, please don't read this branch further.</>
          }]
        },
      ],
    }} />
  </Post>
}