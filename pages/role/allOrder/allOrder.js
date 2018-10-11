// pages/nopay/nopay.js
const util = require('../../../utils/util.js');
import API from "../../../utils/api.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reson: [{ title: "无法联系上买家", selected: true }, { title: "买家误拍或重拍", selected: false }, { title: "买家无诚意完成交易", selected: false }, { title: "缺货无法交易", selected: false }, { title: "其他", selected: false }],
    cancelIndex: 0
  },


  // 监听输入
  watchInput(e) {
    let type = e.currentTarget.dataset.type;
    let key = "";
    switch (type) {
      case "change": key = 'changeMoney'; break;
      case "goodCode": key = "getGoodCode"; break;
      case "exCom": key = "expressageCom"; break;
      case "exCode": key = "expressageCode"; break;
    }

    this.setData({
      [key]: e.detail.value
    })
  },
  showModal(e) {
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let obj = {};
    switch (type) {
      case "change":
        obj = {
          changeModal: true,
          changeMoney: ""
        }; break;
      case "goodCode":
        obj = {
          codeModal: true,
          getGoodCode: ""
        }; break;
      case "yundan":
        obj = {
          expressage: true,
          expressageCom: "",
          expressageCode: "",
          noBtn: true
        }; break;
      case "ex":
        obj = {
          expressage: true,
          expressageCom: "",
          expressageCode: "",
          noBtn: false
        }; break;
      case 'sureGet':
        obj = {
          sureModal: true,
        }; break;
      case 'del':
        obj = {
          delModal: true,
        }; break;
      case 'cancel':
        obj = {
          cancelModal: true,
        }; break;
    }
    this.setData(obj)
  },
  //查看凭证
  seeVoucher(e) {
    let num = this.data.num;
    API.seeVoucher({ orderNumber: num }).then((res) => {
      if (res.obj.payVoucher) {
        wx.previewImage({
          urls: [this.data.baseUrl + res.obj.payVoucher]
        })
      } else {
        wx.showToast({
          title: '未上传支付凭证',
          icon: 'none'
        })
      }
    })
  },

  // 验证取货码
  testCode() {
    let num = this.data.num;
    let money = this.data.getGoodCode;
    if (!money || money < 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    API.testGoodCode({
      orderNumber: num,
      claimGoodsNum: money
    }).then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },

  // 取消订单
  sureCancel() {
    let num = this.data.num,
      index = this.data.cancelIndex;
    API.closeOrder({
      reason: this.data.reson[index].title,
      orderNumber: num
    }).then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  //取消理由
  swichReason(e) {
    var current = e.currentTarget.dataset.current;
    var array = this.data.reson
    array.forEach((item, index, arr) => {
      if (current == index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      reson: array,
      cancelIndex: current
    })
  },
  

  // 我要发货
  // 待填表
  sendGoods(e) {
    let type = e.currentTarget.dataset.type,
      num = this.data.num,
      obj = {
        orderNumber: num
      };
    if (type == 'no') {
      //不填单发货
    } else {
      //填单发货
      obj.expressCompany = this.data.expressageCom;
      obj.expressNumber = this.data.expressageCode;
      if (!obj.expressNumber) {
        wx.showToast({
          title: "请填写运单号",
          icon: 'none'
        })
        return
      }
    }
    API.addExpress(obj).then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })

  },
  // 整体改价
  sureChange() {
    let num = this.data.num;
    let money = this.data.changeMoney;
    if (!money || money < 0) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return
    }
    app.http.requestAll("/admin/order/" + num + "/updatetotal", {
      orderNumber: num,
      orderAmount: money
    }, "PUT").then((res) => {
      this.afterOperation();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  },
  //确认收款
  receiveMoney(e) {
    let num = this.data.num;
    app.http.requestAll("/admin/order/orderpayment/" + num + "/confirm", {
      orderNumber: num
    }, "POST").then((res) => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      this.afterOperation();
    })
  },
  // 保存备注
  saveRemark(e) {
    let val = e.detail.value;
    API.addRemark({
      orderNumber: this.data.num,
      remark: val
    }).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      if (res.success) {

      }
    })
  },

  //刷新数据
  afterOperation() {
    this.closeModal();
    setTimeout(() => {
      this.getData(true);
    }, 800)
  },
  closeModal() {
    this.setData({
      changeModal: false,  //改价
      codeModal: false,  //取货码
      sureModal: false,  //收款
      delModal: false,  //删除
      cancelModal: false, //取消订单
      expressage: false, //发货
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'list') {
      wx.setNavigationBarTitle({
        title: "出货单详情"
      })
      this.setData({
        orderName: '出货单'
      })
    }
    this.setData({
      status: options.status,
      num: options.num,
      baseUrl: app.globalData.imageUrl,
      orderType: options.type, //order订单 list进货单
      self: options.self  //是否自提
    })

  },
  //打电话
  tel: function () {
    if (this.data.order.userInfo.mobile){
      wx.makePhoneCall({
        phoneNumber: this.data.order.userInfo.mobile,
      })
    }
  },
  // 保存备注
  saveRemark(e) {
    let val = e.detail.value;
    API.addRemark({
      orderNumber: this.data.num,
      remark: val
    }).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      if (res.success) {

      }
    })
  },

  getData() {
    app.http.getRequest("/api/order/byordernumber/" + this.data.num).then((res) => {
      this.setData({
        order: res.obj,
        status: res.obj.orderStatus  //状态
      })
      if(this.data.orderType=='order'){
        this.resetData([this.data.order]);
      }
      this.setData({
        'order.createDate': this.timeFormat(this.data.order.createDate),
        'order.payDate': this.timeFormat(this.data.order.payDate),
        'order.finishDate': this.timeFormat(this.data.order.finishDate),
        'order.deliverDate': this.timeFormat(this.data.order.deliverDate),
      })
      //倒计时
      util.count_down(this, res.obj.timeoutExpressSecond)
    })
  },
  //时间戳转化成时间格式
  timeFormat(timestamp) {
    if (!timestamp) { return "" }
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
    function add0(m) { return m < 10 ? '0' + m : m }

  },
  resetData(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) { // 循环订单
      let oldGoods = data[i].goodsInfos,  //商品数组
        newGoods = [];
      for (let j = 0; j < oldGoods.length; j++) { //货品循环

        let type = oldGoods[j].orderDetails;  //规格数组

        for (let k = 0; k < type.length; k++) {
          //当前货物,类型变为对象
          let nowGood = {};
          Object.assign(nowGood, oldGoods[j]);
          nowGood.orderDetails = type[k];
          newGoods.push(nowGood);
        }
      }
      //编辑新订单数组
      let newOrder = data[i];
      newOrder.goodsInfos = newGoods;
      arr.push(newOrder)
    }
    this.setData({
      order: arr[0]
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
    this.getData();
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