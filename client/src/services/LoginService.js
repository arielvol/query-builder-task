import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', // TODO: for local testing mode
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  register(username, password) {
    return apiClient.post('/register', {username, password})
  },

  login(username, password) {
    return apiClient.post('/login', {username, password})
  },
}
