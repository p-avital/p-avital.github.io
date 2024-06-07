'use client'
import { header } from './header'
import { Post } from "@/components/Post";
import Link from 'next/link';
import { CSSProperties, ReactElement, useEffect, useRef, useState } from "react";
import { alphabet, Vec2 } from '@/components/Nomai';


export default function Page() {
  return <Post header={header} comments={[
    // {
    // 	author: "YOUR NAME HERE",
    // 	date: new Date("1984/06/21"),
    // 	comment: <>YOUR COMMENT HERE</>
    // }
  ]}>
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
                    text: <>You'll explore a tiny stellar system in your rickety spaceship<br />
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
              If you haven't played it, please don't read this branch further.</>,
            next: [{
              text: <>Okay, I believe you. Time for  a gushing session then!</>
            }]
          }]
        },
      ],
    }} />
  </Post>
}

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
    angle *= this.angleScale
    if (angle < -2 * Math.PI) {
      angle += 2 * Math.PI
    } else if (angle > 0) {
      angle -= 2 * Math.PI
    }
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
  tToR(t: number): number { return 1 - (t * this.length) }
  render(t: number): Vec2 { return this.unrooted(this.tToR(t)).add(this.shift) }
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
    public width: number = 1) { }
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
      context.beginPath()
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
        if (hitbox.predicate(translated)) {
          return hitbox.callback(event)
        }
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
function arrayEq<T>(l: T[], r: T[]): boolean { return l.length == r.length && l.every((v, i) => v == r[i]) }
class Color {
  constructor(public r: number, public g: number, public b: number) { }
  static black(): Color { return new Color(0, 0, 0) }
  static white(): Color { return new Color(255, 255, 255) }
  static grey(): Color { return Color.black().blend(Color.white(), 0.55) }
  static cyan(): Color { return new Color(0, 128, 255) }
  blend(other: Color, ratio: number) { return new Color(this.r * (1 - ratio) + other.r * ratio, this.g * (1 - ratio) + other.g * ratio, this.b * (1 - ratio) + other.b * ratio,) }
  stringify(): string { return `rgb(${this.r},${this.g},${this.b})` }
}
function generateTree({ nomai, position = [], setPosition, previousPosition, transition, visited, currentPosition, spiralArgs = {}, disable = false }:
  { nomai: Nomai, currentPosition: number[] | undefined, position?: number[], setPosition: (position: number[]) => any, previousPosition: number[], transition: number, visited: number[][], disable?: boolean, spiralArgs?: Partial<SpiralArgs> }, strokes: Stroke[], hitboxes: Hitbox[]): [Stroke[], Hitbox[],] {
  const text = extractText(nomai.text);
  const args: SpiralArgs = {
    scale: 0.6, root: new Vec2(1, 0), rootAngle: 0, clockwise: false, textLength: text.length, ...spiralArgs
  }
  const spiral = new GoldenSpiral(args)
  let previousColor = Color.black()
  let newColor = Color.black()
  if (!disable) {
    newColor = Color.grey()
  }
  if (visited.some(p => arrayEq(p, position.slice(0, -1)))) {
    previousColor = Color.grey()
    newColor = Color.grey()
  }
  if (visited.some(p => arrayEq(p, position))) {
    previousColor = Color.cyan()
    newColor = Color.cyan()
  }
  if (arrayEq(previousPosition.slice(0, position.length), position)) {
    previousColor = Color.white()
  }
  if (arrayEq((currentPosition || []).slice(0, position.length), position)) {
    newColor = Color.white()
  }
  const color = previousColor.blend(newColor, transition);
  alphabet.translate(text, (t) => spiral.render(t), ([start, end]) => { strokes.push(new Stroke(start, end, color.stringify())); })
  hitboxes.push(new Hitbox((p) => spiral.contains(p), (e) => { if (!disable && e.buttons) { setPosition(position) } }))
  const next = nomai.next;
  next?.forEach((nomai, index) => {
    const anchor = spiral.render((index + 1) / (next.length + 1))
    generateTree({
      nomai,
      position: [...position, index],
      setPosition,
      currentPosition,
      previousPosition, transition, visited,
      disable: position.some((v, i) => currentPosition?.[i] != v) && !visited.some(v => arrayEq(position, v)),
      spiralArgs: {
        root: anchor,
        rootAngle: anchor.sub(spiral.shift).angle() - Math.PI / 2,
        scale: args.scale * 0.9,
        clockwise: !args.clockwise
      }
    }, strokes, hitboxes)
  })
  return [strokes, hitboxes]
}

function ButtonTree(args: { nomai: Nomai, currentPosition: number[] | undefined, position?: number[], setPosition: (position: number[]) => any, previousPosition: number[], transition: number, visited: number[][], disable?: boolean }) {
  const root = new Vec2(1, -0.001);
  const n = 0.05
  const l = root.add(new Vec2(n * Math.cos(2 * Math.PI / 3), - n * Math.sin(2 * Math.PI / 3)))
  const r = root.add(new Vec2(n * Math.cos(Math.PI / 3), - n * Math.sin(Math.PI / 3)))
  const [strokes, hitboxes] = generateTree(args, [new Stroke(root, l), new Stroke(root, r), new Stroke(l, r), new Stroke(root, l.add(r).mul(0.5)), new Stroke(root.add(l).mul(0.5), r), new Stroke(l, r.add(root).mul(0.5)),], [])
  const div = useRef(null)
  const [[w, h], setWH] = useState([800, 600])
  useEffect(() => {
    if (!div?.current) { return }
    setWH([(div.current as any).clientWidth, (div.current as any).clientHeight])
  }, [div])
  return <div style={{ width: "100%", height: "60vh" }} ref={div}>
    <Canvas strokes={strokes} hitboxes={hitboxes} width={w} height={h} />
  </div>
}

function Screen({ children }: { children: ReactElement }) {
  return <div style={{ fontFamily: "Consolas, monospace", width: "100%", marginTop: "10ex" }}>{children}</div>
}

let interval = null as any
function TranslatorTool({ nomai }: { nomai: Nomai }) {
  const [animation, setAnimation] = useState({
    position: [] as number[],
    previous: [] as number[],
    transition: 1,
    visited: [[]] as number[][]
  })
  const setPosition = (position: number[]) => {
    const newAnimation = { position, previous: animation.position, visited: animation.visited, transition: 0, }
    clearInterval(interval)
    interval = setInterval(() => {
      newAnimation.transition += 1 / 16
      setAnimation({ ...newAnimation })
      if (newAnimation.transition >= 1) {
        if (!newAnimation.visited.some(p => arrayEq(p, position))) {
          newAnimation.visited.push(position)
        }
        clearInterval(interval)
      }
    }, 20)
    setAnimation(animation)
  }
  let selected: Nomai | undefined = nomai
  for (const index of animation.position) {
    selected = selected?.next?.[index]
  }
  if (!selected) {
    return <>You reached an easter egg! <button onClick={() => setPosition([])}>Get back to safety</button></>
  }
  return <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
    <ButtonTree setPosition={setPosition} nomai={nomai} currentPosition={animation.position} previousPosition={animation.previous} transition={animation.transition} visited={animation.visited} />
    <Screen>{selected.text}</Screen>
  </div>
}
