import {
    getrepairInfo,
    DeleteRepair,
    updateRepair
} from '@/api/repair';

const Repair = {
    state: {
        repair: {
            pageInfo: null,
            content: null
        }
    },
    getters: {
        repairInfo: state => state.repair.content,
        repairPage: state => state.repair.pageInfo
    },
    mutations: {
        GETREPAIRINFO: (state, result) => {
            state.repair.pageInfo = result.pageInfo;
            state.repair.content = result.data;
        }
    },
    actions: {
        // 查
        getrepairInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了getrepairInfo');
            getrepairInfo(params.pageInfo).then(result => {
                commit("GETREPAIRINFO", {
                    data: result.data.list,
                    pageInfo: {
                        pageSize: result.data.pageSize,
                        pageNum: result.data.pageNum,
                        totalItems: result.data.total
                    }
                });
            });
        },
        deleteRepairInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了deleteRepairInfo');
            DeleteRepair(params.id).then(result => {
                getrepairInfo(state.repair.pageInfo).then(result => {
                    commit("GETREPAIRINFO", {
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
        UpdateRepairInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了UpdateRepairInfo');
            updateRepair(params.id).then(result => {
                getrepairInfo(params.pageInfo).then(result => {
                    commit("GETREPAIRINFO", {
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
        serchRepair({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了serchRepair');
            getrepairInfo(params.content).then(result => {
                commit("GETREPAIRINFO", {
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
}

export default Repair;