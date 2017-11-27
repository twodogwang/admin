import {
    getLockmanageInfo,
    deleteLockmanageInfo,
    changeLockmanageInfo,
    addLock,
    upLock
} from '@/api/lockmanage';

const lockmanage = {
    state: {
        lockmanage: {
            pageInfo: null,
            content: null
        }
    },
    getters: {
        lockmanageInfo: state => state.lockmanage.content,
        lockmanagePage: state => state.lockmanage.pageInfo
    },
    mutations: {
        GETLOCKMANAGEINFO: (state, result) => {
            state.lockmanage.pageInfo = result.pageInfo;
            state.lockmanage.content = result.data;
        }
    },
    actions: {
        // 查
        getLockmanageInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了GETLOCKMANAGEINFO');
            getLockmanageInfo(params.pageInfo).then(result => {
                commit("GETLOCKMANAGEINFO", {
                    data: result.data.list,
                    pageInfo: {
                        pageSize: result.data.pageSize,
                        pageNum: result.data.pageNum,
                        totalItems: result.data.total
                    }
                });
            });
        },
        searchLockmanageInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了searchLockmanageInfo');
            getLockmanageInfo(params.content).then(result => {
                if (result.data.list.length === 0) {
                    alert("搜索数据为空")
                } else {
                    commit("GETLOCKMANAGEINFO", {
                        data: result.data.list,
                        pageInfo: {
                            pageSize: result.data.pageSize,
                            pageNum: result.data.pageNum,
                            totalItems: result.data.total
                        }
                    });
                }
            });
        },
        deleteLockmanageInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了deleteLockmanageInfo');
            deleteLockmanageInfo(params.lockId).then(result => {
                console.log("code",result.code,typeof result.code)
                if (result.code === 0) {
                    getLockmanageInfo({
                        pageSize: state.lockmanage.pageInfo.pageSize,
                        pageNum: state.lockmanage.pageInfo.pageNum,
                        search:""
                    }).then(result => {
                        commit("GETLOCKMANAGEINFO", {
                            data: result.data.list,
                            pageInfo: {
                                pageSize: result.data.pageSize,
                                pageNum: result.data.pageNum,
                                totalItems: result.data.total
                            }
                        });
                    })

                }
            })
        },
        changeLockmanageInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了changeLockmanageInfo');
            changeLockmanageInfo(params.orderId).then(result => {
                getLockmanageInfo(state.Lockmanage.pageInfo).then(result => {
                    commit("GETLOCKMANAGEINFO", {
                        data: result.data.list,
                        pageInfo: {
                            pageSize: result.data.pageSize,
                            pageNum: result.data.pageNum,
                            totalItems: result.data.total
                        }
                    });
                })
            })
        },
        addLock({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了addLock');
            addLock(params.lock).then(result => {
                getLockmanageInfo({
                    pageSize: 10,
                    pageNum:1,
                    search:""
                }).then(result => {
                    if(result.code == 0){
                        alert("添加成功")
                    }
                    commit("GETLOCKMANAGEINFO", {
                        data: result.data.list,
                        pageInfo: {
                            pageSize: result.data.pageSize,
                            pageNum: result.data.pageNum,
                            totalItems: result.data.total
                        }
                    });
                });
            })
        },
        upLock({
            commit,
            state
        }, params = {}){
            console.log('dispatch了upLock');
            upLock(params.lock).then(result => {
                getLockmanageInfo({
                    pageSize:state.lockmanage.pageInfo.pageSize,
                    pageNum:state.lockmanage.pageInfo.pageNum,
                    search:""
                }).then(result => {
                    commit("GETLOCKMANAGEINFO", {
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

export default lockmanage;