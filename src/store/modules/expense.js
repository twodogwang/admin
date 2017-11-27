import {
    getExpenseInfo,
    serachExpenseInfo,
    deleteExpenseInfo,
    changeExpenseInfo,
    getAlreadypayExpenseInfo
} from '@/api/expense';

const expense = {
    state: {
        expense: {
            pageInfo: null,
            content: null
        }
    },
    getters: {
        expenseInfo: state => state.expense.content,
        expensePage: state => state.expense.pageInfo
    },
    mutations: {
        GETEXPENSEINFO: (state, result) => {
            state.expense.pageInfo = result.pageInfo;
            state.expense.content = result.data;
        }
    },
    actions: {
        // 查
        getExpenseInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了GETEXPENSEINFO');
            getExpenseInfo(params.pageInfo).then(result => {
                commit("GETEXPENSEINFO", {
                    data: result.data.list,
                    pageInfo: {
                        pageSize: result.data.pageSize,
                        pageNum: result.data.pageNum,
                        totalItems: result.data.total
                    }
                });
            });
        },
        getAlreadypayExpenseInfo({
            commit,
            state
        }, params = {}){
            console.log('dispatch了getAlreadypayExpenseInfo');
            getAlreadypayExpenseInfo(params.pageInfo).then(result => {
                commit("GETEXPENSEINFO", {
                    data: result.data.list,
                    pageInfo: {
                        pageSize: result.data.pageSize,
                        pageNum: result.data.pageNum,
                        totalItems: result.data.total
                    }
                });
            })
        },
        searchExpenseInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了searchExpenseInfo');
            getExpenseInfo(params.content).then(result => {
                if (result.data.list.length === 0) {
                    alert("搜索数据为空")
                } else {
                    commit("GETEXPENSEINFO", {
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
        deleteExpenseInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了deleteExpenseInfo');
            deleteExpenseInfo(params.orderId).then(result => {
                if (result.code === 0) {
                    if (params.type==1){
                        getExpenseInfo(params.content).then(result => {
                            if (result.data.list.length === 0) {
                                alert("搜索数据为空")
                            } else {
                                commit("GETEXPENSEINFO", {
                                    data: result.data.list,
                                    pageInfo: {
                                        pageSize: result.data.pageSize,
                                        pageNum: result.data.pageNum,
                                        totalItems: result.data.total
                                    }
                                });
                            }
                        });
                    }else{
                        getExpenseInfo(state.expense.pageInfo).then(result => {
                            commit("GETEXPENSEINFO", {
                                data: result.data.list,
                                pageInfo: {
                                    pageSize: result.data.pageSize,
                                    pageNum: result.data.pageNum,
                                    totalItems: result.data.total
                                }
                            });
                        })
                    }
                }
            })
        },
        changeExpenseInfo({
            commit,
            state
        }, params = {}){
            console.log('dispatch了changeExpenseInfo');
            changeExpenseInfo(params.orderId).then(result => {
                getExpenseInfo(state.expense.pageInfo).then(result => {
                    commit("GETEXPENSEINFO", {
                        data: result.data.list,
                        pageInfo: {
                            pageSize: result.data.pageSize,
                            pageNum: result.data.pageNum,
                            totalItems: result.data.total
                        }
                    });
                })
            })
        }
    }
}

export default expense;