import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Renders children when authenticated; redirects to /signin otherwise. Renders nothing while auth is loading.
 * @param children - Content to render when the user is authenticated
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return null
  if (!session) return <Navigate to="/signin" replace />
  return <>{children}</>
}
