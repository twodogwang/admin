import {
  GetOriginalDataInfo,
  DeleteOriginalData,
  UpdateOriginalData,
  searchOriginalData,
  addYezhu
} from '@/api/originaldata';

const GetOriginalData = {
  state: {
    OriginalData: {
      pageInfo: null,
      content: null
    }
  },
  getters: {
    OriginalDataInfo: state => state.OriginalData.content,
    OriginalDataPage: state => state.OriginalData.pageInfo
  },
  mutations: {
    GETORIGINALDATAINFO: (state, result) => {
      state.OriginalData.pageInfo = result.pageInfo;
      state.OriginalData.content = result.data;
    }
  },
  actions: {
    // 查
    GetOriginalDataInfo({
      commit,
      state
    }, params = {}) {
      console.log('dispatch了getrepairInfo');
      GetOriginalDataInfo(params.pageInfo).then(result => {
        commit("GETORIGINALDATAINFO", {
          data: result.data.list,
          pageInfo: {
            pageSize: result.data.pageSize,
            pageNum: result.data.pageNum,
            totalItems: result.data.total
          }
        });
      });
    },
    DeleteOriginalData({
      commit,
      state
    }, params = {}) {
      console.log('dispatch了deleteRepairInfo');
      DeleteOriginalData(params.id).then(result => {
        GetOriginalDataInfo(state.OriginalData.pageInfo).then(result => {
          commit("GETORIGINALDATAINFO", {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
        })
      });
    },
    UpdateOriginalData({
      commit,
      state
    }, params = {}) {
      console.log('dispatch了UpdateRepairInfo');
      UpdateOriginalData(params.id).then(result => {
        state.OriginalData.content[params.myindex].ownerName = params.id.ownerName;
        state.OriginalData.content[params.myindex].ownerPhone = params.id.ownerPhone;
        // GetOriginalDataInfo(state.OriginalData.pageInfo).then(result => {
        //     commit("GETORIGINALDATAINFO", {
        //         data: result.data.list,
        //         pageInfo: {
        //             pageSize: result.data.pageSize,
        //             pageNum: result.data.pageNum,
        //             totalItems: result.data.total
        //         }
        //     });
        // })
      });
    },
    searchOriginalData({
      commit,
      state
    }, params = {}){
      console.log("commit了searchOriginalData")
      GetOriginalDataInfo(params.content).then(result => {
        commit("GETORIGINALDATAINFO", {
          data: result.data.list,
          pageInfo: {
            pageSize: result.data.pageSize,
            pageNum: result.data.pageNum,
            totalItems: result.data.total
          }
        });
      });
    },
    addYezhu({
      commit,
      state
    }, params = {}){
      console.log("commit了addYezhu")
      addYezhu(params.newYezhu).then(result => {
        GetOriginalDataInfo(state.OriginalData.pageInfo).then(result => {
          commit("GETORIGINALDATAINFO", {
            data: result.data.list,
            pageInfo: {
              pageSize: result.data.pageSize,
              pageNum: result.data.pageNum,
              totalItems: result.data.total
            }
          });
        });
      })
    }
  }
}

export default GetOriginalData;
