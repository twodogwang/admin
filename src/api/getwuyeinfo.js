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

export function getCommunities(param = {}) {
    let uri = "/communities/findCommunityByProperId";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function getNper(param = {}) {
    let uri = "/nper/selectByCommunityId";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function getUnit(param = {}) {
    let uri = "/unit/selectByFloorId";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function getFloor(param = {}) {
    let uri = "/floor/selectByNperId";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}

export function getRoom(param = {}) {
    let uri = "/door/selectByUnitId";
    return fetch({
        url: b + uri,
        method: 'get',
        params: param
    });
}