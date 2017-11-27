import {
  /* getTerminallist,
  addTerminalInfo,
  updateTerminalInfo,
  deleteTerminalInfo,
  selectTerminalInfo, */
  getInfo,
  addInfo,
  updateInfo,
  deleteInfo,
  selectInfo,
  deleteInfoes,
  selectInfoById
} from '@/api/baseInfo';

const baseInfo = {
  state: {
    terminal: {
      pageInfo: null,
      content: null
    },
    community: {
      pageInfo: null,
      content: null
    },
    building: {
      pageInfo: null,
      content: null
    },
    room: {
      pageInfo: null,
      content: null
    },
    user: {
      pageInfo: null,
      content: null
    },
    group: {
      pageInfo: null,
      content: null
    },
    account: {
      pageInfo: null,
      content: null
    },
    sleep: {
      pageInfo: null,
      content: null
    },
    firmware: {
      pageInfo: null,
      content: null
    },
    advertise: {
      pageInfo: null,
      content: null
    },
    adverplace: {
      pageInfo: null,
      content: null
    },
    property: {
      pageInfo: null,
      content: null
    },
    nper: {
      pageInfo: null,
      content: null
    },
    unit: {
      pageInfo: null,
      content: null
    }
  },
  mutations: {
    GETTERMINALINFO: (state, result) => {
      state.terminal.pageInfo = result.pageInfo;
      state.terminal.content = result.data;
    },
    GETCOMMUNITYINFO: (state, result) => {
      state.community.pageInfo = result.pageInfo;
      state.community.content = result.data;
    },
    GETBUILDINGINFO: (state, result) => {
      state.building.pageInfo = result.pageInfo;
      state.building.content = result.data;
    },
    GETROOMINFO: (state, result) => {
      state.room.pageInfo = result.pageInfo;
      state.room.content = result.data;
    },
    GETUSERINFO: (state, result) => {
      state.user.pageInfo = result.pageInfo;
      state.user.content = result.data;
    },
    GETGROUPINFO: (state, result) => {
      state.group.pageInfo = result.pageInfo;
      state.group.content = result.data;
    },
    GETACCOUNTINFO: (state, result) => {
      state.account.pageInfo = result.pageInfo;
      state.account.content = result.data;
    },
    GETSLEEPINFO: (state, result) => {
      state.sleep.pageInfo = result.pageInfo;
      state.sleep.content = result.data;
    },
    GETFIRMWAREINFO: (state, result) => {
      state.firmware.pageInfo = result.pageInfo;
      state.firmware.content = result.data;
    },
    GETADVERTISEINFO: (state, result) => {
      state.advertise.pageInfo = result.pageInfo;
      state.advertise.content = result.data;
    },
    GETADVERPLACEINFO: (state, result) => {
      state.adverplace.pageInfo = result.pageInfo;
      state.adverplace.content = result.data;
    },
    GETPROPERTYINFO: (state, result) => {
      state.property.pageInfo = result.pageInfo;
      state.property.content = result.data;
    },
    GETNPERINFO: (state, result) => {
      state.nper.pageInfo = result.pageInfo;
      state.nper.content = result.data;
    },
    GETUNITINFO: (state, result) => {
      state.unit.pageInfo = result.pageInfo;
      state.unit.content = result.data;
    }
  },
  actions: {
    // 查
    getInfo({
      commit,
      state
    }, params = {}) {
      console.log('dispatch了' + arguments + ',参数type为' + params.type);
      return new Promise((resolve, reject) => {
        getInfo(params.pageInfo, params.type).then(result => {
          if (result.type) {
            for (const i in result.data.list) {
              result.data.list[i].cqyxy = result.type;
            }
          }
          const type = params.type.toUpperCase();
          commit(`GET${type}INFO`, {
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
    // 增
    addInfo({
      commit,
      state
    }, params = {}) {
      // return new Promise((resolve, reject) => {
      addInfo(params.form, params.type).then(result => {
        // resolve();
        getInfo(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}INFO`, {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
        });
      });
      // });
    },
    // 改
    updateInfo({
      commit,
      state
    }, params = {}) {
      updateInfo(params.form, params.type).then(result => {
        getInfo(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}INFO`, {
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
    // 单个删除
    deleteInfo({
      commit,
      state
    }, params = {}) {
      deleteInfo(params.id, params.type).then(result => {
        getInfo(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}INFO`, {
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
    // 名称搜索
    selectInfo({
      commit,
      state
    }, params = {}) {
      selectInfo(params.data, params.type).then(result => {
        const type = params.type.toUpperCase();
        commit(`GET${type}INFO`, {
          data: result.data.list,
          pageInfo: {
            pageSize: result.data.pageSize,
            pageNum: result.data.pageNum,
            totalItems: result.data.total
          }
        });
      });
    },
    // 批量删除
    deleteInfoes({
      commit,
      state
    }, params = {}) {
      deleteInfoes(params.delete, params.type).then(result => {
        getInfo(state[params.type].pageInfo, params.type).then(result => {
          const type = params.type.toUpperCase();
          commit(`GET${type}INFO`, {
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
    // 代码查询
    selectInfoById({
      commit,
      state
    }, params = {}) {
      console.log(`dispatch了selectInfoById,参数为${params.type}`)
      selectInfoById(params.data, params.page, params.type).then(result => {
        const type = params.type.toUpperCase();
        commit(`GET${type}INFO`, {
          data: result.data.list,
          pageInfo: {
            pageSize: result.data.pageSize,
            pageNum: result.data.pageNum,
            totalItems: result.data.total
          }
        });
      });
    }
  }
};

export default baseInfo;
