import Dashboard from "@/components/Dashboard/Dashboard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Dashboard></Dashboard>
      </main>
    </div>
  );
}
