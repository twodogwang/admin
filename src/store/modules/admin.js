import {
  getadminlist, // 获取列表
  addadmin, // 添加鹳狸猿
  updateadmin, // 编辑鹳狸猿
  deleteadmin // 删除管理，单选
} from '@/api/admin';

const admin = {
  state: {
    admin: {
      pageInfo: null,
      content: null
    },
    role: {
      pageInfo: null,
      content: null
    },
    permission: {
      pageInfo: null,
      content: null
    }
  },
  mutations: {
    GETADMINLIST: (state, result) => {
      state.admin.pageInfo = result.pageInfo;
      state.admin.content = result.data;
    },
    GETROLELIST: (state, result) => {
      state.role.pageInfo = result.pageInfo;
      state.role.content = result.data;
    },
    GETPERMISSIONLIST: (state, result) => {
      state.permission.pageInfo = result.pageInfo;
      state.permission.content = result.data;
    }
  },
  actions: {
    getList({
      commit,
      state
    }, params = {}) {
      return new Promise((resolve, reject) => {
        console.log('dispatch了getList,参数type为' + params.type);
        getadminlist(params.pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}LIST`, {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
          resolve(result);
        });
      });
    },
    addList({
      commit,
      state
    }, params) {
      addadmin(params.form, params.type).then(result => {
        getadminlist(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}LIST`, {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
        });
      });
    },
    updateList({
      commit,
      state
    }, params) {
      updateadmin(params.form, params.type).then(result => {
        getadminlist(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}LIST`, {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
        });
      });
    },
    deleteList({
      commit,
      state
    }, params) {
      deleteadmin(params.id, params.type).then(result => {
        getadminlist(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}LIST`, {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
        });
      });
    }
  }
};

export default admin;
