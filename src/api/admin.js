import fetch from '@/utils/fetch';

const b = 'baseAdmin';

/**
 * 获取鹳狸猿列表，参数为分页信息
 * @param param
 */
export function getadminlist(param = {
  pageNum: 1,
  pageSize: 10
}, type) {
  let uri = '';
  if (type == 'admin') {
    uri = '/admin/selectAll';
  } else if (type == 'role') {
    uri = '/role/selectAll';
  } else if (type == 'permission') {
    uri = '/aPermission/selectAll';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}
/**
 * 添加鹳狸猿，参数为name password groupId telnum annotation
 * @param param
 */
export function addadmin(param, type) {
  let uri = '';
  if (type == 'admin') {
    uri = '/admin/addAdmin';
  } else if (type == 'role') {
    uri = '/role/addRole';
  } else if (type == 'permission') {
    uri = '/aPermission/addApermission';
  }
  return fetch({
    url: b + uri,
    method: 'post',
    params: param
  });
}
/**
 * 编辑鹳狸猿，参数为name password groupId telnum annotation
 * @param param
 */
export function updateadmin(param, type) {
  let uri = '';
  if (type == 'admin') {
    uri = '/admin/updateAdmin';
  } else if (type == 'role') {
    uri = '/role/updateRole';
  } else if (type == 'permission') {
    uri = '/aPermission/updateById';
  }
  return fetch({
    url: b + uri,
    method: 'post',
    params: param
  });
}
/**
 * dialog弹出时群组下拉选项
 */
export function getgrouplist() {
  return fetch({
    url: b + uri,
    method: 'get'
  });
}
/**
 * 删除鹳狸猿，参数为id
 * @param param
 */
export function deleteadmin(param, type) {
  let uri = '';
  if (type == 'admin') {
    uri = '/admin/deleteById';
  } else if (type == 'admindrole') {
    uri = '/admin/deleteAdminRole';
  } else if (type == 'role') {
    uri = '/role/deleteById';
  } else if (type == 'roledpermission') {
    uri = '/role/deleteByRapId';
  } else if (type == 'permission') {
    uri = '/aPermission/deleteById';
  }
  return fetch({
    url: b + uri,
    method: 'get',
    params: param
  });
}
