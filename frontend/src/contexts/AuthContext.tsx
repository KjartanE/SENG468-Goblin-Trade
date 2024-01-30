import { useNavigate } from 'react-router-dom'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useApi } from './ApiContext'
import { IUser } from '@/types/auth'

export type authContextType = {
  user: IUser | null
  login: (username: string, password: string) => any
  logout: () => void
  register: (signupDetails: userRegister) => any
}

export interface userRegister {
  username: string
  email: string
  password1: string
  password2: string
}

const authContextDefaultValues: authContextType = {
  user: null,
  login: () => null,
  logout: () => undefined,
  register: () => null,
}

const AuthContext = createContext<authContextType>(authContextDefaultValues)

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * AuthProvider is the Auth Context across the application that can be accessed
 * from any level of the app.
 *
 * @export
 * @param {Props} { children }
 * @return {*}
 */
export function AuthContextProvider({ children }: { children: ReactNode }) {
  // This set state holds the reference of the current logged in user
  const [user, setUser] = useState<authContextType['user']>(null)
  const router = useNavigate()
  const api = useApi()

  /**
   * This useEffect is triggered anytime the app loads
   * Which means for any reload it will check the localStorage cache to check,
   * if a user is currently logged in
   */
  useEffect(() => {
    const fetchUser = async () => {
      const storageUser = localStorage.getItem('user')

      if (storageUser) {
        const loadedUser = JSON.parse(storageUser)

        if (loadedUser && loadedUser != undefined) {
          api.setUserToken(loadedUser.token)
          setUser(loadedUser)
        }
      }
    }
    fetchUser()
  }, [])

  /**
   * This useEffect is triggered anytime that the user state is changed
   * Which means if a user logs in then it will be cached into the webpage
   */
  useEffect(() => {
    if (user !== authContextDefaultValues.user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])

  /**
   * Login function for the UserContext
   *
   * @param {string} username
   * @param {string} password
   * @return {*}
   */
  const login = async (username: string, password: string) => {
    const loggedUser = await api.auth.login(username, password)

    if (loggedUser) {
      api.setUserToken(loggedUser.token)
      setUser(loggedUser)
    }

    return loggedUser
  }

  /**
   * Logout function for the user Context
   */
  const logout = () => {
    setUser(null)
    api.setUserToken('')
    localStorage.setItem('user', JSON.stringify(null))
    router('/')
  }

  /**
   * Register function
   *
   * @param {userRegister} signupDetails
   * @return {*}
   */
  const register = async (signupDetails: userRegister) => {
    const response = await api.auth.register(
      signupDetails.username,
      signupDetails.password1
    )

    if (response) {
      router('/user/login')

      return true
    }

    return false
  }

  const value = {
    user,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
