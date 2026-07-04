import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 min for AI responses
})

// Interceptor for errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const uploadCode = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const uploadPasted = (sessionId, pastedCode, pastedFilename) =>
  api.post('/upload', { sessionId, pastedCode, pastedFilename })

export const analyzeCode = (sessionId, question, actionType = 'chat', targetLanguage) =>
  api.post('/analyze', { sessionId, question, actionType, targetLanguage })

export const getSessions = () => api.get('/sessions')

export const getSession = (id) => api.get(`/sessions/${id}`)

export const createSession = (sessionId) =>
  api.post('/sessions', { sessionId })

export const deleteSession = (id) => api.delete(`/sessions/${id}`)

export const clearMessages = (id) => api.delete(`/sessions/${id}/messages`)

export const removeFile = (sessionId, filename) =>
  api.delete('/upload/file', { data: { sessionId, filename } })

export default api
