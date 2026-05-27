import { useCreate } from '../hooks/useCreate'
import styles from './Create.module.css'

/** Create page — image upload, sound controls, canvas preview, and save to Supabase. */
export default function Create() {
  useCreate()

  return (
    <main className={styles.page}>
      <h1>Create</h1>
    </main>
  )
}
