import fetch from '@/utils/fetch';
import qs from 'qs';

const b = 'propertyFunctions/order';

/* ---------------------------------------------------
公共方法api */
/**
 * 获取列表，参数为分页信息
 * @param param
 * 分页信息
 * @param type
 * 接口类型，如为终端设备或社区等等
 */

export function getExpenseInfo(param) {
    const uri = "/newselect";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function serachExpenseInfo(param) {
    const uri = "/select";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function deleteExpenseInfo(param, type) {
	const uri = "/deOrder";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function changeExpenseInfo(param, type) {
    const uri = "/upState";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function getAlreadypayExpenseInfo(param){
    const uri = "/oldselect";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

