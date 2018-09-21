import Api from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: wx.getStorageSync("storeId"),
    data: [
      { name: "男装", selected: false, color: "#fff", colorTrue: "#CDE6DC"},
      { name: "皮草/皮衣", selected: false, color: "#fff", colorTrue: "#D4E6CD"}, 
      { name: "女装", selected: false, color: "#fff", colorTrue: "#D1DEE5"},
      { name: "运动休闲", selected: false, color: "#fff", colorTrue: "#AAFAE3"},
      { name: "床品", selected: false, color: "#fff", colorTrue: "#D6C1AA"},
      { name: "鞋", selected: false, color: "#fff", colorTrue: "#D1DEE5"},
      { name: "办公用品", selected: false, color: "#fff", colorTrue: "#F57158"},
      { name: "商务男装", selected: false, color: "#fff", colorTrue: "#D1DEE5"},
      { name: "休闲装", selected: false, color: "#fff", colorTrue: "#AA8EAD"}],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name =options.name,
        arr=[],
        data=this.data.data
    arr=name.split(",")
    for(var i=0;i<data.length;i++){
      if(arr.indexOf(data[i].name)!=-1){
        data[i].selected=true
      }
    }
    this.setData({
      data: data
    })
  },
  selectedFun:function(e){
    var data=this.data.data,
        index = e.target.dataset.index
    data[index].selected = !data[index].selected
    this.setData({
      data: data
    })
  },
  goback:function(){
    var name=this.data.name,
        data = this.data.data,
        id=this.data.id,
        businessScope=''
    for (var i = 0; i < data.length;i++){
      if(data[i].selected){
        businessScope += data[i].name+","
      }
    }
    businessScope = businessScope.slice(0, -1)
    Api.updateMes({ businessScope: businessScope,id:id})
      .then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            wx.navigateTo({
              url: '../mesEdit/mesEdit',
            })
          }
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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