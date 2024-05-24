import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome to my blog!</h1>
      This site is still very much under construction work, but expect articles to come up soon(TM)!
    </main>
  );
}
