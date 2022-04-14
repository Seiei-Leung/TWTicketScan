//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    btnTxt: "扫描工号",
    userInfo: {},
    empbarcode: "",
    mchbarcode: "",
    prdbarcode: "",
    tckbarcode: ""
  },
  onLoad: function (e) {
    console.log(app.globalData)
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  goScan: function() {
    var that = this;
    wx.scanCode({
      scanType: ['barCode'],
      success: function(res) {
        that.setData({
          btnTxt: "扫描机台",
          empbarcode: res.result
        });
        wx.showModal({
          title: '扫描工号成功',
          content: '扫描工号：' + res.result,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      },
      fail: function () {
        that.setData({
          btnTxt: "扫描工号"
        });
      }
    })
  },
  scanRobotNo: function () {
    var that = this;
    wx.scanCode({
      scanType: ['barCode'],
      success: function (res) {
        that.setData({
          btnTxt: "扫描工序",
          mchbarcode: res.result
        });
        wx.showModal({
          title: '扫描机台成功',
          content: '扫描机台：' + res.result,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
      },
      fail: function () {
        that.setData({
          btnTxt: "扫描工号"
        });
      }
    });
  },
  scanProcess: function () {
    var that = this;
    wx.scanCode({
      scanType: ['barCode'],
      success: function (res) {
        that.setData({
          btnTxt: "扫描工菲",
          prdbarcode: res.result
        });
        wx.showModal({
          title: '扫描工序成功',
          content: '扫描工序：' + res.result,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
      },
      fail: function () {
        that.setData({
          btnTxt: "扫描工号"
        });
      }
    });
  },
  scanWorkTicket: function () {
    if (this.data.empbarcode == '' || this.data.mchbarcode == '' || this.data.prdbarcode == '') {
      wx.showModal({
        title: '扫描工菲失败',
        content: "工号、机号、工序都不能为空",
        showCancel: false,
        success: function (res2) {
        }
      })
    } else {
    var that = this;
    wx.scanCode({
      scanType: ['barCode'],
      success: function (res) {
        that.setData({
          btnTxt: "扫描工号",
          tckbarcode: res.result
        });
        wx.request({
          url: app.globalData.twUrl + "/estapi/api/TW2Ticket/InsertData",
          data: {
            empbarcode: that.data.empbarcode,
            mchbarcode: that.data.mchbarcode,
            prdbarcode: that.data.prdbarcode,
            tckbarcode: that.data.tckbarcode
          },
          method: "GET",
          success: function (res1) {
            console.log(res1);
            console.log(app.globalData.twUrl + "/estapi/api/TW2Ticket/InsertData");
            console.log(that.data.empbarcode);
            console.log(that.data.mchbarcode);
            console.log(that.data.prdbarcode);
            console.log(that.data.tckbarcode);
            if (res1.data.result.indexOf('SUCCESS') != -1) {
              var orderno = res1.data.result.split(";")[1];
              var bindindex = res1.data.result.split(";")[2];
              var quantity = res1.data.result.split(";")[3];
              wx.showModal({
                title: '扫描工菲成功',
                content: '扫描工菲：' + res.result + '成功,制单号：' + orderno + ",扎号：" + bindindex + ",件数：" + quantity,
                showCancel: false,
                success: function (res2) {
                  that.scanWorkTicket();
                }
              })
            } else {
              wx.showModal({
                title: '扫描工菲失败',
                content: res1.data.result,
                showCancel: false,
                success: function (res2) {
                  that.setData({
                    tckbarcode: res1.data.result
                  });
                  that.scanWorkTicket();
                }
              })
            }
          }
        })
      },
      fail: function () {
        that.setData({
          btnTxt: "扫描工号"
        });
      }
    });
    }
  }
})
