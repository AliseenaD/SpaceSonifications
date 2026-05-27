import { useListen } from '../hooks/useListen'
import styles from './Listen.module.css'

/** Listen page — searchable, filterable grid of all public sonification clips. */
export default function Listen() {
  useListen()

  return (
    <main className={styles.page}>
      <h1>Listen</h1>
    </main>
  )
}
