import axios from 'axios'
import { useSelector } from 'react-redux'
import { getAuthState } from '@/store/authSlice'

const useAxiosWithDemoUserIdAuth = () => {
  const { userId } = useSelector(getAuthState)
  // get from the state?
  return axios.create({
    headers: {
      Authorization: `DemoUserId ${userId}`,
    },
  })
}

export default useAxiosWithDemoUserIdAuth
