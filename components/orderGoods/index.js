var app = getApp();
Component({
  properties: {
    evaluate: {
      type: Number,
      value:0,
    },
    cartInfo:{
      type:Object,
      value:[],
    },
    orderId:{
      type:String,
      value:'',
    },
  },
  data: {
    ids:[]
  },
  methods: {
  /**
   * 使用施工费
  */
 ChangeConstruction(e){
   var that=this;
   var index=e.currentTarget.dataset.index
   var cartInfo=that.data.cartInfo
   cartInfo[index]['productInfo']['useConstruction']=-1*cartInfo[index]['productInfo']['useConstruction']+1
   this.setData({
    cartInfo:cartInfo
  });
  var ids=[];//置空
  that.data.ids=[]
  that.data.cartInfo.forEach((cur,index,array)=>{
    if(cur['productInfo']['useConstruction']==1){
      ids.push(cur['id'])
      that.setData({
        ids:ids
      })
    }
  })
  console.log(this.data.ids)
  //子组件事件向父组件传递
  this.triggerEvent('myevent',{params:that.data.ids.join()})
},
}
})