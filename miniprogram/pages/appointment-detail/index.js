Page({ data:{appointment:null}, onLoad(){this.setData({appointment:wx.getStorageSync('selectedAppointment')||null})}, goBooking(){wx.navigateBack({delta:1})} })
