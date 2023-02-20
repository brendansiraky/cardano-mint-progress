import styles from './Progress.module.scss'

export const Progress = ({ progress, max }) => {
    const width = (progress / max) * 100

    return (
        <div className={styles.wrapper}>
            <div className={styles.progress} style={{ width: `${width}%` }} />
        </div>
    )
}