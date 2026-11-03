Component({
  data: {
    selected: 0,
    isAdmin: false,
    list: []
  },
  lifetimes: {
    attached() {
      this.refreshRole()
    }
  },
  methods: {
    refreshRole() {
      const role = wx.getStorageSync('demoRole') || '管理员'
      const bookingText = role === '家长' ? '我的预约' : role === '老师' ? '我的试听' : '预约'
      this.setData({
        isAdmin: role === '管理员',
        list: [
          { pagePath: '/pages/index/index', text: '工作台', icon: '⌂' },
          { pagePath: '/pages/booking/index', text: bookingText, icon: '▣' },
          { pagePath: '/pages/admin/index', text: '管理', icon: '☷' }
        ]
      })
    },
    setSelected(index) {
      this.setData({ selected: index })
    },
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index)
      const item = this.data.list[index]
      if (!item || (index === 2 && !this.data.isAdmin)) return
      this.setData({ selected: index })
      wx.switchTab({ url: item.pagePath })
    }
  }
})
