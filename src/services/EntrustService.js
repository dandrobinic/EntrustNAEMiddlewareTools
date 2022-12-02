import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://claro.us.trustedauth.com',  
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Calculate the time elapsed since the api call until getting a response
apiClient.interceptors.request.use(
  config => {
    const newConfig = { ...config }
    newConfig.metadata = { startTime: new Date() }
    return newConfig
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => {
    const newRes = { ...response }
    newRes.config.metadata.endTime = new Date()
    newRes.duration =
      newRes.config.metadata.endTime - newRes.config.metadata.startTime
    return newRes
  },
  error => {
    const newError = { ...error }
    newError.config.metadata.endTime = new Date()
    newError.duration =
      newError.config.metadata.endTime - newError.config.metadata.startTime
    return Promise.reject(newError)
  }
)

export default {
  authenticate() {
    return apiClient.post('/api/web/v1/adminapi/authenticate',
    {
        "applicationId": "0d8c2665-5feb-4f32-bc85-a0112f583f4c",
        "enableWebSession": false,
        "sharedSecret": "7bqn0l6J-g8pdcmVGqWnJBGNKQDHH-JfEEFfqfTE0SY"
    })
  },
  createAndSendOtp(token,user,deliveryType) {
    return apiClient.post('/api/web/v1/otps',
      {
        "applicationId": "8fce9f63-7138-401b-b655-e4673197f09f",
        "returnOTP": true,
        "deliverOTP": true,
        "otpDeliveryType": deliveryType,
        "userId": user
      },
      {
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
  }
}
