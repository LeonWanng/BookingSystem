Page({
  data: {
    activeTab: 'course',
    currentRole: '管理员',
    tabs: [{ key: 'course', name: '课程时间' }, { key: 'review', name: '客户评价' }, { key: 'staff', name: '人员权限' }],
    courses: [
      { name: '少儿美术启蒙', icon: '✦', duration: '60分钟', teacher: '王老师', slots: 4 },
      { name: '硬笔书法体验', icon: '笔', duration: '45分钟', teacher: '李老师', slots: 3 },
      { name: '少儿编程入门', icon: '⌘', duration: '60分钟', teacher: '赵老师', slots: 2 }
    ],
    schedules: [
      { id: 1, week: '周一', date: '02', time: '09:30 - 10:30', course: '少儿美术启蒙', teacher: '王老师', remaining: 3 },
      { id: 2, week: '周一', date: '02', time: '14:00 - 14:45', course: '硬笔书法体验', teacher: '李老师', remaining: 2 },
      { id: 3, week: '周二', date: '03', time: '16:30 - 17:30', course: '少儿编程入门', teacher: '赵老师', remaining: 4 }
    ],
    reviews: [
      { name: '林小满妈妈', avatar: '林', course: '少儿美术启蒙', content: '老师特别有耐心，孩子回家后一直在说下次还要来画画。', date: '今天 10:48', status: '已公开' },
      { name: '陈一诺爸爸', avatar: '陈', course: '硬笔书法体验', content: '课堂节奏很好，环境整洁，已经约了正式课。', date: '昨天 18:20', status: '已公开' }
    ],
    staffs: [
      { name: '张小雨', avatar: '张', role: '管理员', phone: '138****0101', skills: '机构负责人', enabled: true },
      { name: '王老师', avatar: '王', role: '老师', phone: '138****2223', skills: '美术启蒙', enabled: true },
      { name: '李晓', avatar: '李', role: '前台', phone: '139****8432', skills: '接待与回访', enabled: true }
    ]
  },
  switchTab(e) { this.setData({ activeTab: e.currentTarget.dataset.key }) },
  toggleStaff(e) {
    const staffs = this.data.staffs;
    staffs[e.currentTarget.dataset.index].enabled = e.detail.value;
    this.setData({ staffs });
    wx.showToast({ title: e.detail.value ? '已启用' : '已停用', icon: 'none' });
  },
  addCourse() { wx.showToast({ title: '课程编辑入口', icon: 'none' }) },
  addStaff() { wx.showToast({ title: '员工添加入口', icon: 'none' }) },
  goHome() { wx.navigateBack({ delta: 1 }) },
  goBooking() { wx.navigateTo({ url: '/pages/booking/index' }) }
})
