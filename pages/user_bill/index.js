// pages/bill-details/index.js
import { getCommissionInfo } from '../../api/user.js';
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '账单明细',
      'color':true,
      'class':'0'
    },
    loadTitle:'加载更多',
    loading:false,
    loadend:false,
    page:1,
    limit:10,
    type:0,
    userBillList:[],
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserBillList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ type: options.type || 0});
  },

  /**
   * 获取账户明细
  */
  getUserBillList:function(){
    var that=this;
    if (that.data.loadend) return;
    if (that.data.loading) return;
    that.setData({ loading: true, loadTitle: "" });
    var data = {
      page: that.data.page,
      limit: that.data.limit
      }
    getCommissionInfo(data, that.data.type).then(function(res){
      var list=res.data,loadend=list.length < that.data.limit;
      that.data.userBillList = app.SplitArray(list,that.data.userBillList);
      that.setData({
        userBillList:that.data.userBillList,
        loadend:loadend,
        loading:false,
        loadTitle:loadend ? "到底啦~": "加载更多",
        page:that.data.page+1,
      });
    },function(res){
      that.setData({loading:false,loadTitle:'加载更多'});
    });
  },
  /**
   * 切换导航
  */
  changeType:function(e){
    this.setData({ type: e.currentTarget.dataset.type,loadend:false,page:1,userBillList:[]});
    this.getUserBillList();
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
    this.getUserBillList();
  },

})