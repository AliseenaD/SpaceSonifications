import { useSignIn } from '../hooks/useSignIn'
import styles from './SignIn.module.css'

/** Sign In page — email/password and magic link authentication via Supabase Auth. */
export default function SignIn() {
  useSignIn()

  return (
    <main className={styles.page}>
      <h1>Sign In</h1>
    </main>
  )
}
