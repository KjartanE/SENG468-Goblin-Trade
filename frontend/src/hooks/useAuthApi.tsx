import { IUser } from '@/types/auth'
import { AxiosInstance } from 'axios'

const useAuthApi = (axios: AxiosInstance) => {
  /**
   * Signs the user into the application by returning their user token
   */
  const login = async (username: string, password: string): Promise<string> => {
    const { data } = await axios.post('/auth/login', {
      user_name: username,
      password,
    })

    return data
  }

  /**
   * Fetches the currently authenticated user
   */
  const self = async (): Promise<IUser> => {
    const { data } = await axios.post('/auth/self')

    return data
  }

  /**
   * Registers a new user TODO: Needs to be implemented
   *
   * @param {string} username
   * @param {string} password
   * @return {*}  {Promise<string>}
   */
  const register = async (
    username: string,
    password: string
  ): Promise<string> => {
    const { data } = await axios.post('/auth/register', { username, password })

    return data
  }

  return {
    login,
    self,
    register,
  }
}

export default useAuthApi
