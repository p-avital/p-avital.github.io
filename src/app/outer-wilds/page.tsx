'use client'
import { header } from './header'
import { Post } from "@/components/Post";
import Link from 'next/link';
import { ReactElement, useState } from "react";
import { text } from 'stream/consumers';

interface Nomai {
  text: ReactElement
  next?: Nomai[]
}

function ButtonTree({ nomai, position = [], setPosition, currentPosition, disable = false }: { nomai: Nomai, currentPosition: number[] | undefined, position?: number[], setPosition: (position: number[]) => any, disable?: boolean }) {
  return <div style={{ display: "grid", }}>
    <button onClick={() => setPosition(position)} style={{ color: currentPosition ? "white" : "black", margin: "0.3ex", textAlign: "center", minHeight: "2em" }} disabled={disable}>::)</button>
    {nomai.next ? <div style={{ display: "grid", gridAutoFlow: "column" }}>{
      nomai.next.map((monai, i) => <ButtonTree
        key={i}
        setPosition={setPosition}
        nomai={monai}
        position={[...position, i]}
        currentPosition={currentPosition?.[0] == i ? currentPosition?.slice(1) : undefined}
        disable={disable || !currentPosition}
      />)
    }</div> : <></>}
  </div>
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
  return <div>
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
    }} /></Post>
}