'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)       // Thông tin đội chơi
  const [loading, setLoading] = useState(true) // Đang kiểm tra trạng thái đăng nhập
  const [isLogin, setIsLogin] = useState(false)

  // ✅ Kiểm tra đăng nhập khi load trang
  useEffect(() => {
    let isMounted = true

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Cookie-based auth
        })

        const data = await res.json()

        if (!isMounted) return

        if (res.ok && data?.teamId) {
          setUser(data)
          setIsLogin(true)
        } else {
          setUser(null)
          setIsLogin(false)
        }
      } catch (error) {
        console.error('Lỗi khi xác thực:', error)
        setUser(null)
        setIsLogin(false)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()
    return () => {
      isMounted = false
    }
  }, [])

  // ✅ Đăng nhập
  const login = async (teamName, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Đăng nhập thất bại')

      setUser(data)
      setIsLogin(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ✅ Đăng ký đội chơi
  const register = async ({ teamName, teamCode, password }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, teamCode, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Đăng ký thất bại')

      setUser(data)
      setIsLogin(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ✅ Đăng xuất
  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)
    setIsLogin(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,       // dữ liệu đội chơi: teamId, name, v.v.
        login,
        logout,
        loading,
        isLogin,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ✅ Hook để dùng trong component
export const useAuth = () => useContext(AuthContext)
