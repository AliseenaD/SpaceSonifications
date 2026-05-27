import { useLanding } from '../hooks/useLanding'
import styles from './Landing.module.css'

/** Landing page — hero banner, featured clips preview, and create CTA. */
export default function Landing() {
  useLanding()

  return (
    <main className={styles.page}>
      <h1>Landing</h1>
    </main>
  )
}
