import fetch from '@/utils/fetch';

const b = 'baseMessage';

// 获取终端设备api
/**
 * 获取终端设备列表，参数为分页信息
 * @param param
 */
export function getTerminallist(param = {
  'pageNum': 1,
  'pageSize': 10
}) {
  return fetch({
    url: b + '/terminal/terminalList',
    method: 'get',
    params: param
  });
}

/**
 * 新增终端设备，参数很多
 * @param param
 */
export function addTerminalInfo(param) {
  return fetch({
    url: b + '/terminal/addTerminal',
    method: 'post',
    params: param
  });
}

/**
 * 更新终端设备，参数很多
 * @param param
 */
export function updateTerminalInfo(param) {
  return fetch({
    url: b + '/terminal/updateTerminal',
    method: 'post',
    params: param
  });
}

/**
 * 删除终端设备，参数为id
 * @param param
 */
export function deleteTerminalInfo(param) {
  return fetch({
    url: b + '/terminal/deleteTerminal',
    method: 'get',
    params: param
  });
}

/**
 * 查询终端设备，参数为tnum设备号和分页
 * @param param
 */
export function selectTerminalInfo(param) {
  return fetch({
    url: b + '/terminal/selectTerminalTnum',
    method: 'get',
    params: param
  });
}
/* ---------------------------------------------------------------------------
 获取社区信息api */
/**
 * 获取社区列表，参数为分页信息
 * @param param
 */
export function getCommunitylist(param = {
  'pageNum': 1,
  'pageSize': 10
}) {
  return fetch({
    url: b + '/communities/communitiesList',
    method: 'get',
    params: param
  });
}
/**
 * 新增社区，参数很多
 * @param param
 */
export function addCommunityInfo(param) {
  return fetch({
    url: b + '/communities/addCommunities',
    method: 'post',
    params: param
  });
}

/**
 * 更新社区信息，参数很多
 * @param param
 */
export function updateCommunityInfo(param) {
  return fetch({
    url: b + '/terminal/updateCommunities',
    method: 'post',
    params: param
  });
}

/**
 * 删除社区，参数为id
 * @param param
 */
export function deleteCommunityInfo(param) {
  return fetch({
    url: b + '/terminal/deleteCommById',
    method: 'get',
    params: param
  });
}

/**
 * 查询社区，参数为社区名和分页
 * @param param
 */
export function selectCommunitylInfo(param) {
  return fetch({
    url: b + '/terminal/selectCommByName',
    method: 'get',
    params: param
  });
}

/* ---------------------------------------------------
公共方法api */
/**
 * 获取列表，参数为分页信息
 * @param param
 * 分页信息
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function getInfo(param = {
  pageNum: 1,
  pageSize: 10
}, type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/selectAll';
  } else if (type === 'community') {
    uri = '/communities/communitiesList';
  } else if (type === 'building') {
    uri = '/floor/selectAll';
  } else if (type === 'room') {
    uri = '/door/selectAll';
  } else if (type === 'user') {
    uri = '/customer/customer/selectAll';
  } else if (type === 'group') {
    uri = '/group/groupList';
  } else if (type === 'account') {
    uri = '/talkback/selectList';
  } else if (type === 'sleep') {
    uri = '/dormancy/selectAll';
  } else if (type === 'firmware') {
    uri = '/firmware/selectAll';
  } else if (type === 'advertise') {
    uri = '/adver/advertising/selectAll';
  } else if (type === 'adverplace') {
    uri = '/adver/address/selectAll';
  } else if (type === 'property') {
    uri = '/property/selectAll';
  } else if (type === 'nper') {
    uri = '/nper/selectAll';
  } else if (type === 'unit') {
    uri = '/unit/selectAll';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}
/**
 * 新增，参数很多
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function addInfo(param, type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/addTerminal';
  } else if (type === 'community') {
    uri = '/communities/addCommunities';
  } else if (type === 'building') {
    uri = '/floor/addFloor';
  } else if (type === 'room') {
    uri = '/room/addRoom';
  } else if (type === 'user') {
    uri = '/customer/addCustomer';
  } else if (type === 'group') {
    uri = '/group/addGroup';
  } else if (type === 'sleep') {
    uri = '/dormancy/save';
  } else if (type === 'firmware') {
    uri = '/firmware/save';
  } else if (type === 'advertise') {
    uri = '/adver/advertising/addAdverNoFile';
  } else if (type === 'nper') {
    uri = '/nper/addNper';
  } else if (type === 'unit') {
    uri = '/unit/addUnit';
  }
  return fetch({
    url: b + uri,
    method: 'post',
    params: param
  });
}

/**
 * 更新，参数很多
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function updateInfo(param, type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/updateTerminal';
  } else if (type === 'community') {
    uri = '/communities/updateCommunities';
  } else if (type === 'building') {
    uri = '/floor/updateFloor';
  } else if (type === 'room') {
    uri = '/room/updateRoom';
  } else if (type === 'user') {
    uri = '/customer/updateCustomer';
  } else if (type === 'group') {
    uri = '/group/updateGroup';
  } else if (type === 'sleep') {
    uri = '/dormancy/update';
  } else if (type === 'firmware') {
    uri = '/firmware/update';
  } else if (type === 'adverplace') {
    uri = '/adver/address/updateAdveraddress';
  } else if (type === 'nper') {
    uri = '/nper/updateNper';
  } else if (type === 'unit') {
    uri = '/unit/updateUnit';
  }
  return fetch({
    url: b + uri,
    method: 'post',
    params: param
  });
}

/**
 * 删除设备
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function deleteInfo(param, type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/deleteById';
  } else if (type === 'community') {
    uri = '/communities/deleteCommById';
  } else if (type === 'building') {
    uri = '/floor/deleteById';
  } else if (type === 'room') {
    uri = '/room/deleteRoom';
  } else if (type === 'user') {
    uri = '/customer/deleteById';
  } else if (type === 'group') {
    uri = '/group/deleteById';
  } else if (type === 'account') {
    uri = '/talkback/deleteById';
  } else if (type === 'sleep') {
    uri = '/dormancy/deleteById';
  } else if (type === 'firmware') {
    uri = '/firmware/deleteById';
  } else if (type === 'advertise') {
    uri = '/adver/advertising/deleteAdverById';
  } else if (type === 'nper') {
    uri = '/nper/deleteById';
  } else if (type === 'unit') {
    uri = '/unit/deleteById';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}

/**
 * 查询设备
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function selectInfo(param, type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/selectByTnumCommunityName';
  } else if (type === 'community') {
    uri = '/communities/selectByName';
  } else if (type === 'property') {
    uri = '/property/selectByName';
  } else if (type === 'building') {
    uri = '/floor/selectByName';
  } else if (type === 'nper') {
    uri = '/nper/selectByName';
  } else if (type === 'unit') {
    uri = '/unit/selectByName';
  } else if (type === 'room') {
    uri = '/door/selectByName';
  } else if (type === 'user') {
    uri = '/customer/customer/selectByMobilePhoneOrName';
  } else if (type === 'account') {
    uri = '/talkback/selectByRoomCode';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}

/**
 * 查询
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function selectInfoById(param, page,type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/selectTerminalTnum';
  } else if (type === 'community') {
    uri = '/communities/selectCommByAreaCode';
  } else if (type === 'property') {
    uri = '/property/selectByName';
  } else if (type === 'building') {
    uri = '/floor/selectByNperId';
  } else if (type === 'nper') {
    uri = '/nper/selectByCommunityId"';
  } else if (type === 'unit') {
    uri = '/unit/selectByFloorId';
  } else if (type === 'room') {
    uri = '/door/selectByUnitId';
  } else if (type === 'user') {
    uri = '/customer/customer/selectByMobile';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: { ...param, pageSize: page.pageSize, pageNum: page.pageNum }
  });
}

/**
 * 批量删除
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function deleteInfoes(param,  type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/deleteTerminals';
  } else if (type === 'community') {
    uri = '/communities/deleteComms';
  } else if (type === 'building') {
    uri = '/building/deleteBuildings';
  } else if (type === 'room') {
    uri = '/room/deleteRooms';
  } else if (type === 'user') {
    uri = '/customer/deleteByList';
  } else if (type === 'group') {
    uri = '/group/deleteByLits';
  } else if (type === 'advertise') {
    uri = '/adver/advertising/deleteAdverByIds';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}

/**
 * 关联
 * @param param
 *
 * @param type
 * 接口类型，如为终端设备或社区等等
 */
export function correlation(param, type) {
  let uri = '';
  if (type === 'terminal') {
    uri = '/terminal/deleteTerminals';
  } else if (type === 'community') {
    uri = '/communities/deleteComms';
  } else if (type === 'building') {
    uri = '/building/deleteBuildings';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}
