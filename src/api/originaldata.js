import fetch from '@/utils/fetch';
import qs from 'qs';

const b = 'baseMessage';

/* ---------------------------------------------------
公共方法api */
/**
 * 获取列表，参数为分页信息
 * @param param
 * 分页信息
 * @param type
 * 接口类型，如为终端设备或社区等等
 */

export function GetOriginalDataInfo(param = {
    pageNum: 1,
    pageSize: 10
}) { 
    let uri = "/owner/select";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function DeleteOriginalData(param) {
    let uri = "/owner/deOwner";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function UpdateOriginalData(param) {
    let uri = "/owner/upOwner";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function addYezhu(param){
    let uri = "/owner/addOwner";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}
