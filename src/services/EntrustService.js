import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://claro.us.trustedauth.com',  
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  authenticate() {
    return apiClient.post('/api/web/v1/adminapi/authenticate',
        {
            "applicationId": "0d8c2665-5feb-4f32-bc85-a0112f583f4c",
            "enableWebSession": true,
            "sharedSecret": "7bqn0l6J-g8pdcmVGqWnJBGNKQDHH-JfEEFfqfTE0SY"
        })
  }
}
