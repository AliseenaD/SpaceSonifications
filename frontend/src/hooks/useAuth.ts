import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/** Returns the current auth session, user, and loading state. */
export const useAuth = () => useContext(AuthContext)
