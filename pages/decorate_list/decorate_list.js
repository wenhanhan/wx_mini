import { getDecProductslist, getProductHot,getGroomList,getZoneList } from '../../api/store.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:5,//装修清单 轮播图id
    multiArray: [['长安区','裕华区','桥西区'], ['万达小区', '锦城小区']],
    zone_list:[],
    zone:[
      {
        grade:'长安区',
        class:['万达小区','锦城小区']
      },
      {
        grade:'裕华区',
        class:['二十里铺']
      },
      {
        grade:'桥西区',
        class:['保利花园']
      }
    ],
    zone_name:'全部',
    multiIndex: [0, 0],
    imgUrls:[],
    productList:[],
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '装修清单',
      'color': true,
      'class': '0'
    },
    navH: "",
    is_switch:true,
    where: {
      sid: 0,
      keyword: '',
      priceOrder: '',
      salesOrder: '',
      zone_cate_id:'',//默认按全部筛选
      news: 0,
      page: 1,
      limit: 10,
      cid: 0,
    },
    price:0,
    stock:0,
    nows:false,
    loadend:false,
    loading:false,
    loadTitle:'加载更多',
    userInfo:{}
  },
  onLoadFun: function (e) {
    this.setData({
      userInfo: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      ['where.sid']: options.sid || 0, 
      title: options.title || '', 
      ['where.keyword']: options.searchValue || '', 
      navH: app.globalData.navHeight
    });
    this.get_product_list();
    this.get_host_product();
  },
   /**
   * 商品详情跳转
   */
  goDetail: function (e) {
    let item = e.currentTarget.dataset.items;
   if (item.activity && item.activity.type === "1") {
     wx.navigateTo({
      url: `/pages/activity/goods_seckill_details/index?id=${item.activity.id}&time=${item.activity.time}&status=1`
     });
   } else if (item.activity && item.activity.type === "2") {
     wx.navigateTo({ url:  `/pages/activity/goods_bargain_details/index?id=${item.activity.id}&bargain=${this.data.userInfo.uid}`});
   } else if (item.activity && item.activity.type === "3") {
     wx.navigateTo({
       url: `/pages/activity/goods_combination_details/index?id=${item.activity.id}`
     });
   } else {
     wx.navigateTo({ url: `/pages/dec_goods_details/index?id=${item.id}` });
   }
   },
  Changswitch:function(){
     var that = this;
     that.setData({
       is_switch: !this.data.is_switch
     })
  },
  searchSubmit: function (e) {
    var that = this;
    this.setData({ ['where.keyword']: e.detail.value, loadend: false, ['where.page']: 1 })
    this.get_product_list(true);
  },
  /**
  * 获取我的推荐
  */
  get_host_product: function () {
    var that = this;
    getProductHot().then(res=>{
      that.setData({ host_product: res.data });
    });
  },
  //点击事件处理
  set_where: function (e) {
    var dataset = e.target.dataset;
    switch (dataset.type) {
      case '1':
        return wx.navigateBack({
          delta: 1,
        })
        break;
      case '2':
        if (this.data.price == 0)
          this.data.price = 1;
        else if (this.data.price == 1)
          this.data.price = 2;
        else if (this.data.price == 2)
          this.data.price = 0;
        this.setData({ price: this.data.price, stock: 0 });
        break;
      case '3':
        if (this.data.stock == 0)
          this.data.stock = 1;
        else if (this.data.stock == 1)
          this.data.stock = 2;
        else if (this.data.stock == 2)
          this.data.stock = 0;
        this.setData({ stock: this.data.stock, price: 0 });
        break;
      case '4':
        this.setData({ nows: !this.data.nows });
        break;
    }
    this.setData({ loadend: false, ['where.page']: 1 });
    this.get_product_list(true);
  },
  //设置where条件
  setWhere: function () {
    if (this.data.price == 0)
      this.data.where.priceOrder = '';
    else if (this.data.price == 1)
      this.data.where.priceOrder = 'desc';
    else if (this.data.price == 2)
      this.data.where.priceOrder = 'asc';
    if (this.data.stock == 0)
      this.data.where.salesOrder = '';
    else if (this.data.stock == 1)
      this.data.where.salesOrder = 'desc';
    else if (this.data.stock == 2)
      this.data.where.salesOrder = 'asc';
    this.data.where.news = this.data.nows ? 1 : 0;
    this.setData({ where: this.data.where });
  },
  //查找产品
  get_product_list: function (isPage) {
    let that = this;
    this.setWhere();
    if (that.data.loadend) return;
    if (that.data.loading) return;
    if (isPage === true) that.setData({ productList: [] });
    that.setData({ loading: true, loadTitle: '' });
    getDecProductslist(that.data.where).then(res=>{
      let list = res.data;
      let productList = app.SplitArray(list, that.data.productList);
      let loadend = list.length < that.data.where.limit;
      that.setData({
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? '已全部加载' : '加载更多',
        productList: productList,
        ['where.page']: that.data.where.page + 1,
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: '加载更多' });
    });
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
    this.getIndexGroomList();
    this.getZoneList();
  },
  getIndexGroomList: function () {
    var that = this;
    getGroomList(that.data.type).then(res=>{
      that.setData({ imgUrls: res.data.banner})
    });
  },
  getZoneList:function(){
    var that=this;
    getZoneList().then(res=>{
      console.log(res)
      that.setData({
        zone_list:res.data,
        multiArray:[that.filter_arr(res.data,'cate_name'),that.filter_arr(res.data[0]['village'],'cate_name')]
      })
    })
  },
  //按字段过滤数组
  filter_arr(arr,name){
    var a=new Array();
    arr.forEach(item=>{
      a.push(item['cate_name'])
    })
    return a;
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that=this;
    this.setData({
        multiIndex: e.detail.value,
        zone_name:that.data.zone_list[e.detail.value[0]]['village'][e.detail.value[1]]['cate_name']
    })
    //重新搜索
    var zone_cate_id=that.data.zone_list[e.detail.value[0]]['village'][e.detail.value[1]]['id']
    console.log('所选id为',zone_cate_id)
    that.data.where.zone_cate_id=zone_cate_id
    this.setData({ where: this.data.where });
    this.setData({ loadend: false, ['where.page']: 1 });
    this.get_product_list(true);
},
bindMultiPickerColumnChange: function (e) {
  var that=this;
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  var multiArray = this.data.multiArray,
      multiIndex = this.data.multiIndex
  // console.log(e.detail)
  multiIndex[e.detail.column] = e.detail.value;
  switch (e.detail.column) {
      case 0:
          switch (multiIndex[0]) {
              case multiIndex[0]:
                  multiArray[1] = that.filter_arr(that.data.zone_list[multiIndex[0]]['village'],'cate_name');
                  break;
          }
  }
  console.log(multiIndex);
  this.setData({
      multiArray,
      multiIndex
  });
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
    this.setData({['where.page']:1,loadend:false,productList:[]});
    this.get_product_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_product_list();
  },
})