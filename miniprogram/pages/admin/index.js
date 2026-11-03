Page({
  data: {
    activeTab: 'course',
    showCourseForm: false,
    showStaffForm: false,
    staffRoles: ['管理员', '老师', '前台'],
    staffRoleIndex: 1,
    courseForm: { name: '', duration: '', teacher: '', slots: '' },
    staffForm: { name: '', role: '老师', phone: '', skills: '' },
    currentRole: '管理员',
    roleIndex: 0,
    roleOptions: ['管理员', '前台', '老师', '家长'],
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
    ],
    frontAppointments: [
      { id: 'f1', time: '09:30', student: '林小满', course: '少儿美术启蒙', teacher: '王老师', statusText: '待确认', statusClass: 'orange' },
      { id: 'f2', time: '14:00', student: '陈一诺', course: '硬笔书法体验', teacher: '李老师', statusText: '已确认', statusClass: 'blue' },
      { id: 'f3', time: '16:30', student: '周子谦', course: '少儿编程入门', teacher: '赵老师', statusText: '已到店', statusClass: 'green' }
    ],
    mySchedules: [
      { id: 't1', week: '周一', date: '02', time: '09:30 - 10:30', course: '少儿美术启蒙', statusText: '已确认' },
      { id: 't2', week: '周二', date: '03', time: '14:00 - 14:45', course: '少儿美术启蒙', statusText: '待确认' }
    ],
    teacherTrials: [
      { id: 'tr1', student: '林小满', course: '少儿美术启蒙', time: '今天 09:30' }
    ]
  },
  onLoad(options) {
    const savedRole = wx.getStorageSync('demoRole') || '管理员';
    const roleIndex = this.data.roleOptions.indexOf(savedRole);
    const storedTab = wx.getStorageSync('adminTab');
    const requestedTab = options && ['course', 'review', 'staff'].indexOf(options.tab) >= 0 ? options.tab : ['course', 'review', 'staff'].indexOf(storedTab) >= 0 ? storedTab : 'course';
    const courses = wx.getStorageSync('adminCourses') || this.data.courses;
    const staffs = wx.getStorageSync('adminStaffs') || this.data.staffs;
    this.setData({ currentRole: savedRole, roleIndex: roleIndex < 0 ? 0 : roleIndex, activeTab: requestedTab, courses, staffs });
    wx.removeStorageSync('adminTab');
  },
  onShow() {
    const storedTab = wx.getStorageSync('adminTab');
    if (['course', 'review', 'staff'].indexOf(storedTab) >= 0) {
      this.setData({ activeTab: storedTab });
      wx.removeStorageSync('adminTab');
    }
    const role = wx.getStorageSync('demoRole') || '管理员';
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) {
      tabBar.refreshRole();
      tabBar.setSelected(role === '管理员' ? 2 : 0);
    }
  },
  switchTab(e) { this.setData({ activeTab: e.currentTarget.dataset.key }) },
  changeRole(e) {
    const roleIndex = Number(e.detail.value);
    const currentRole = this.data.roleOptions[roleIndex];
    wx.setStorageSync('demoRole', currentRole);
    this.setData({ currentRole, roleIndex, activeTab: 'course' });
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) {
      tabBar.refreshRole();
      tabBar.setSelected(currentRole === '管理员' ? 2 : 0);
    }
    wx.showToast({ title: '已切换为' + currentRole, icon: 'none' });
  },
  toggleStaff(e) {
    const staffs = this.data.staffs;
    staffs[e.currentTarget.dataset.index].enabled = e.detail.value;
    this.setData({ staffs });
    wx.setStorageSync('adminStaffs', staffs);
    wx.showToast({ title: e.detail.value ? '已启用' : '已停用', icon: 'none' });
  },
  toggleCourseForm() { this.setData({ showCourseForm: !this.data.showCourseForm, showStaffForm: false }); },
  toggleStaffForm() { this.setData({ showStaffForm: !this.data.showStaffForm, showCourseForm: false }); },
  courseInput(e) { this.setData({ ['courseForm.' + e.currentTarget.dataset.field]: e.detail.value }); },
  staffInput(e) { this.setData({ ['staffForm.' + e.currentTarget.dataset.field]: e.detail.value }); },
  staffRoleChange(e) {
    const staffRoleIndex = Number(e.detail.value);
    this.setData({ staffRoleIndex, 'staffForm.role': this.data.staffRoles[staffRoleIndex] });
  },
  submitCourse() {
    const form = this.data.courseForm;
    const duration = Number(form.duration);
    const slots = Number(form.slots);
    if (!form.name.trim() || !duration || !form.teacher.trim() || !slots) {
      wx.showToast({ title: '请补充完整课程信息', icon: 'none' });
      return;
    }
    const course = { name: form.name.trim(), icon: '✦', duration: duration + '分钟', teacher: form.teacher.trim(), slots };
    const courses = [...this.data.courses, course];
    this.setData({ courses, showCourseForm: false, courseForm: { name: '', duration: '', teacher: '', slots: '' } });
    wx.setStorageSync('adminCourses', courses);
    wx.showToast({ title: '课程已添加' });
  },
  submitStaff() {
    const form = this.data.staffForm;
    if (!form.name.trim() || !form.phone.trim() || !form.skills.trim()) {
      wx.showToast({ title: '请补充完整员工信息', icon: 'none' });
      return;
    }
    const staff = { name: form.name.trim(), avatar: form.name.trim().slice(0, 1), role: form.role, phone: form.phone.trim(), skills: form.skills.trim(), enabled: true };
    const staffs = [...this.data.staffs, staff];
    this.setData({ staffs, showStaffForm: false, staffRoleIndex: 1, staffForm: { name: '', role: '老师', phone: '', skills: '' } });
    wx.setStorageSync('adminStaffs', staffs);
    wx.showToast({ title: '员工已添加' });
  },
  writeTrial() {
    wx.showModal({ title: '试听记录', editable: true, placeholderText: '填写学员表现与建议', success: res => { if (res.confirm) wx.showToast({ title: '记录已保存' }) } });
  },
  goHome() { wx.switchTab({ url: '/pages/index/index' }) },
  goBooking() { wx.switchTab({ url: '/pages/booking/index' }) }
})
