import fetch from '@/utils/fetch';
import qs from 'qs';

const b = 'propertyFunctions';

/* ---------------------------------------------------
公共方法api */
/**
 * 获取列表，参数为分页信息
 * @param param
 * 分页信息
 * @param type
 * 接口类型，如为终端设备或社区等等
 */

export function getwuyeInfo(param = {
  pageNum: 1,
  pageSize: 10,
  search: ""
}, type) {
  const uri = "/notice/select";
  return fetch({
    url: b + uri,
    method: 'post',
    data: qs.stringify(param)
  });
}

export function DeleteNotice(data) {
  const uri = "/notice/deNotice";
  return fetch({
    url: b + uri,
    method: 'post',
    data: qs.stringify(data)
  });
}

export function addNotice(data) {
  const uri = "/notice/addNotice";
  return fetch({
    url: b + uri,
    method: 'post',
    data: qs.stringify(data)
  });
}

export function serchNotice(data) {
  const uri = "/notice/select";
  return fetch({
    url: b + uri,
    method: 'post',
    data: qs.stringify(data)
  });
}
