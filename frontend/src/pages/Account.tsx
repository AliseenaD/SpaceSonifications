import { useAccount } from '../hooks/useAccount'
import styles from './Account.module.css'

/** Account page — profile, My Sounds / Favorited tabs, and sign-out. Requires authentication. */
export default function Account() {
  useAccount()

  return (
    <main className={styles.page}>
      <h1>Account</h1>
    </main>
  )
}
