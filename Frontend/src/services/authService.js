import api from './api'

export const authService = {
  async adminLogin(email, password) {
    const response = await api.post(
      '/auth/admin/login',
      { email, password },
      { skipAuthRedirect: true }
    )
    return response.data
  },

  async adminRegister(email, password, fullName) {
    const response = await api.post('/auth/admin/register', { email, password, fullName })
    return response.data
  },

  async employeeLogin(documento, password) {
    const response = await api.post(
      '/auth/employee-login',
      { documento, password },
      { skipAuthRedirect: true }
    )
    return response.data
  },

  saveAuth(authResponse) {
    localStorage.setItem('token', authResponse.token)
    localStorage.setItem('user', JSON.stringify({
      userType: authResponse.userType,
      fullName: authResponse.fullName,
      documento: authResponse.documento || null,
      expiresAt: authResponse.expiresAt
    }))
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (!token || !user) return false

    try {
      const userData = JSON.parse(user)
      if (new Date(userData.expiresAt) < new Date()) {
        this.logout()
        return false
      }
      return true
    } catch {
      return false
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAdmin() {
    const user = this.getCurrentUser()
    return user?.userType === 'Admin'
  }
}

