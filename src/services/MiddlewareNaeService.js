import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://us-central1-contactservicemfa.cloudfunctions.net',  
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
  // Creates and Send OTP - Funcion Productiva
  otp(user) {
    return apiClient.post('/otp',{
        "adminApplicationId": "0d8c2665-5feb-4f32-bc85-a0112f583f4c",
        "sharedSecret": "7bqn0l6J-g8pdcmVGqWnJBGNKQDHH-JfEEFfqfTE0SY",
        "userId": user,
        "applicationId": "95d39451-20e0-4819-931e-a0f3c7e30043"
    })
  },
  sendOtpViaPca(message,phoneNumber) {
    return apiClient.post('/sendSmsViaSmppAndPca',{
        "message": message,
        "phoneNumber": phoneNumber
    })
  },
  // Obtener la información de conexión con PCA
  getPcaInfo() {
    return apiClient.get('/dev/getpcainfo')
  },
  // Cambiar el apuntamiento hacia el datancenter de conexión con PCA
  switchDatacenter(datacenterId) {
    console.log("datacenterId (In MiddlewareNaeService): ", datacenterId);
    return apiClient.post('/dev/switchdatacenter',{
      "datacenterId": datacenterId
    })
  }
}
