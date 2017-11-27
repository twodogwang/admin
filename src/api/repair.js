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

export function getrepairInfo(param = {
    pageNum: 1,
    pageSize: 10,
    string:""
}) {
    let uri = "/repair/repairlist";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function DeleteRepair(param) {
    let uri = "/repair/delete";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}   

export function updateRepair(param) {
    let uri = "/repair/repairupdate";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function serchRepair(param) {
    let uri = "/repair/repairlist";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}
