import fetch from '@/utils/fetch';
import qs from 'qs';

const b = '/baseMessage/lock';

/* ---------------------------------------------------
公共方法api */
/**
 * 获取列表，参数为分页信息
 * @param param
 * 分页信息
 * @param type
 * 接口类型，如为终端设备或社区等等
 */

export function getLockmanageInfo(param = {
    pageSize: 10, pageNum: 1, search: "" 
}) {
    const uri = "/select";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function serachLockmanageInfo(param) {
    const uri = "/select";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function deleteLockmanageInfo(param) {
    const uri = "/deLock";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function changeLockmanageInfo(param) {
    const uri = "/upLock";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}
export function addLock(param){
    const uri = "/addLock";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}

export function upLock(param){
    const uri = "/upLock";
    return fetch({
        url: b + uri,
        method: 'post',
        data: qs.stringify(param)
    });
}
