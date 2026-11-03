const demoAppointments = [
  { id: 'a1', time: '09:30', student: '林小满', age: 6, course: '少儿美术启蒙', teacher: '王老师', statusText: '待确认', statusClass: 'orange' },
  { id: 'a2', time: '14:00', student: '陈一诺', age: 8, course: '硬笔书法体验', teacher: '李老师', statusText: '已确认', statusClass: 'blue' },
  { id: 'a3', time: '16:30', student: '周子谦', age: 7, course: '少儿编程入门', teacher: '赵老师', statusText: '已到店', statusClass: 'green' }
]

const roleProfiles = {
  管理员: { staffName: '小雨', avatarText: '小' },
  前台: { staffName: '李晓', avatarText: '李' },
  老师: { staffName: '王老师', avatarText: '王' },
  家长: { staffName: '体验用户', avatarText: '家' }
}

const parentAppointments = [
  { id: 'p1', time: '09:30', student: '我的孩子', age: 6, course: '少儿美术启蒙', teacher: '王老师', statusText: '待确认', statusClass: 'orange' }
]
const frontAppointments = demoAppointments
const teacherAppointments = [
  { id: 't1', time: '09:30', student: '林小满', age: 6, course: '少儿美术启蒙', teacher: '我', statusText: '已确认', statusClass: 'blue' }
]

Page({
  data: {
    today: '2026年11月02日',
    currentRole: '管理员',
    roleIndex: 0,
    roleOptions: ['管理员', '前台', '老师', '家长'],
    staffName: '小雨',
    avatarText: '小',
    stats: { today: 8, waiting: 2, checked: 3, rate: 36 },
    parentStats: { total: 1, waiting: 1, finished: 0 },
    appointments: demoAppointments
  },
  onLoad() {
    this.applyDemoRole()
    this.loadDashboard()
  },
  onShow() {
    this.applyDemoRole()
    this.syncTabBar(0)
  },
  syncTabBar(selected) {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) {
      tabBar.refreshRole()
      tabBar.setSelected(selected)
    }
  },
  applyDemoRole() {
    const currentRole = wx.getStorageSync('demoRole') || '管理员'
    const profile = roleProfiles[currentRole] || roleProfiles.管理员
    const roleIndex = this.data.roleOptions.indexOf(currentRole)
    if (currentRole === '家长') {
      this.setData({ currentRole, roleIndex, ...profile, appointments: parentAppointments, parentStats: { total: 1, waiting: 1, finished: 0 } })
      return
    }
    const appointments = currentRole === '老师' ? teacherAppointments : currentRole === '前台' ? frontAppointments : demoAppointments
    this.setData({ currentRole, roleIndex, ...profile, appointments })
  },
  changeRole(e) {
    const roleIndex = Number(e.detail.value)
    const currentRole = this.data.roleOptions[roleIndex]
    wx.setStorageSync('demoRole', currentRole)
    this.applyDemoRole()
    this.syncTabBar(0)
    wx.showToast({ title: '已切换为' + currentRole, icon: 'none' })
  },
  loadDashboard() {
    if (!wx.cloud || (wx.getStorageSync('demoRole') || '管理员') === '家长') return
    wx.cloud.callFunction({ name: 'quickstartFunctions', data: { type: 'getDashboard' } })
      .then(res => {
        if (res.result && res.result.success && res.result.data.appointments.length) {
          this.setData(res.result.data)
        }
      })
      .catch(() => {})
  },
  openBooking(e) {
    const filter = e.currentTarget.dataset.filter || 'all'
    wx.setStorageSync('bookingFilter', filter)
    wx.removeStorageSync('bookingMode')
    wx.switchTab({ url: '/pages/booking/index' })
  },
  openAppointment(e) {
    const appointment = this.data.appointments.find(item => item.id === e.currentTarget.dataset.id)
    if (!appointment) return
    wx.setStorageSync('selectedAppointment', appointment)
    wx.navigateTo({ url: '/pages/appointment-detail/index' })
  },
  goBooking() {
    wx.setStorageSync('bookingFilter', 'all')
    wx.removeStorageSync('bookingMode')
    wx.switchTab({ url: '/pages/booking/index' })
  },
  goAdmin(e) {
    const tab = e && e.currentTarget.dataset.adminTab || 'course'
    wx.setStorageSync('adminTab', tab)
    wx.switchTab({ url: '/pages/admin/index' })
  },
  goCheckin() {
    wx.setStorageSync('bookingFilter', 'all')
    wx.setStorageSync('bookingMode', 'checkin')
    wx.switchTab({ url: '/pages/booking/index' })
  }
})
