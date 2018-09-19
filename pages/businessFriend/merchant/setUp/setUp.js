const app = getApp();
import Api from '../../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1Change:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  getSet:function(){
    var _this = this
    Api.adminSetUser()
      .then(res => {
        var bfPermission = res.obj.bfPermission
        if (bfPermission == 1) {
          _this.setData({
            switch1Change: true
          })
        } else {
          _this.setData({
            switch1Change: false
          })
        }
      })
  },
  onShow: function () {
    this.getSet()
  },
  switch1Change:function(e){
    var index=e.target.dataset.index,
    _this=this
    Api.adminAddUser(index)
    .then(res=>{
      _this.getSet()
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})