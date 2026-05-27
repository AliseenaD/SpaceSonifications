import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Listen from './pages/Listen'
import Create from './pages/Create'
import Account from './pages/Account'
import SignIn from './pages/SignIn'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/listen" element={<Listen />} />
        <Route path="/create" element={<Create />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  )
}
