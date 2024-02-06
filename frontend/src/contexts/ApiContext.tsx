import axios from 'axios'
import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from 'react'
import useAuthApi from '../hooks/useAuthApi'

interface IApiContext {
  auth: ReturnType<typeof useAuthApi>
  userToken: string
  setUserToken: (token: string) => void
}

const ApiContext = createContext<IApiContext>({} as IApiContext)

export const useApi = () => {
  const apiContext = useContext(ApiContext)
  return apiContext
}

export const ApiContextProvider = (props: PropsWithChildren) => {
  const [userToken, setUserToken] = useState<string>('')

  /**
   * This useEffect is triggered anytime the app loads
   * Which means for any reload it will check the localStorage cache to check,
   * if a user is currently logged in
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('user')

    if (storedToken) {
      const loadedToken = JSON.parse(storedToken)

      if (loadedToken && loadedToken != undefined) {
        setUserToken(loadedToken)
      }
    }
  }, [])

  /**
   * For now, we'll use a hardcoded API host. But in the future, we will need to pull this in
   * from an environment variable of some kind.
   * TODO: Change this to use environment variables
   */
  const API_HOST = 'http://localhost:8080' //`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}`
  const baseURL = `${API_HOST}` // To be changed later if needed

  const axiosInstance = axios.create({
    headers: {
      Authorization: userToken || '',
    },
    baseURL,
  })

  const auth = useAuthApi(axiosInstance)

  const apiContext: IApiContext = {
    auth,
    userToken,
    setUserToken,
  }

  return (
    <ApiContext.Provider value={apiContext}>
      {props.children}
    </ApiContext.Provider>
  )
}
