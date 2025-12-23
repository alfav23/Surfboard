import styles from "./page.module.css";

export default function Home({children}: any) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
