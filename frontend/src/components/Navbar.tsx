import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Navbar.module.css'

/** Top navigation bar. The account link destination toggles based on auth state. */
export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        NASA SONIFICATION
      </NavLink>
      <div className={styles.links}>
        <NavLink to="/listen" className={({ isActive }) => (isActive ? styles.active : '')}>
          Listen
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => (isActive ? styles.active : '')}>
          Create
        </NavLink>
        <NavLink
          to={user ? '/account' : '/signin'}
          className={({ isActive }) => (isActive ? styles.active : '')}
        >
          {user ? 'Account' : 'Sign In'}
        </NavLink>
      </div>
    </nav>
  )
}
