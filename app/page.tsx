import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./page.module.css";

export default function Home({children}: any) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {children}
        <Dashboard></Dashboard>
      </main>
    </div>
  );
}
