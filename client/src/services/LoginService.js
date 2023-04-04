import { registerApiClient } from "src/common/axios"

export default {
  register(username, password) {
    return registerApiClient.post('/register', {username, password})
  },

  login(username, password) {
    return registerApiClient.post('/login', {username, password})
  },
}
