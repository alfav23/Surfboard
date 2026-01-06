import styles from "./Header.module.scss";

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.imageContainer}>
                <h1>SurfBoard</h1>
            </div>
        </div>
    )
}