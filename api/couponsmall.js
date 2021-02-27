import request from "./../utils/request.js";
/**
 * 
 * 产品相关接口
 * 
*/
/**
 * 订单确认获取订单详细信息
 * @param string cartId
*/
export function couponsConfirm(cartId) {
  return request.post('couponsmall/confirm', { cartId: cartId });
}