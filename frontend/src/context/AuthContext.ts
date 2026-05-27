import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

/** Shape of the auth context available to all consumers. */
export interface AuthContextType {
  session: Session | null
  user: User | null
  /** True while the initial session check is in flight. */
  loading: boolean
}

/** React context carrying the current Supabase auth state. */
export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
})
