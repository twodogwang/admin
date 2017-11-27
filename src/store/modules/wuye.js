import {
    getwuyeInfo,
    DeleteNotice,
    addNotice,
    serchNotice
} from '@/api/wuye';

const wuye = {
    state: {
        notice: {
            pageInfo: null,
            content: null
        }
    },
    getters: {
        noticeInfo: state => state.notice.content,
        noticePage: state => state.notice.pageInfo
    },
    mutations: {
        GETNOTICEINFO: (state, result) => {
            state.notice.pageInfo = result.pageInfo;
            state.notice.content = result.data;
        }
    },
    actions: {
        // 查
        getwuyeInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了getInfo,参数type为' + params.type);
            getwuyeInfo(params.pageInfo).then(result => {
                commit("GETNOTICEINFO", {
                    data: result.data.list,
                    pageInfo: {
                        pageSize: result.data.pageSize,
                        pageNum: result.data.pageNum,
                        totalItems: result.data.total
                    }
                });
            });
        },
        deleteNoticeInfo({
            commit,
            state
        }, params = {}) {
            DeleteNotice(params.id).then(result => {
                getwuyeInfo(params.pageInfo).then(result => {
                    commit("GETNOTICEINFO", {
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
        addNotice({
            commit,
            state
        }, params = {}) {
            addNotice(params.content).then(result => {
                getwuyeInfo(params.pageInfo).then(result => {
                    commit("GETNOTICEINFO", {
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
        serchNotice({
            commit,
            state
        }, params = {}) {
            serchNotice(params.content).then(result => {
                console.log("search", result)
                commit("GETNOTICEINFO", {
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

export default wuye;