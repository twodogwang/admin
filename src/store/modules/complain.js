import {
    getComplainInfo,
    DeleteComplain
} from '@/api/complain';

const Complain = {
    state: {
        complain: {
            pageInfo: null,
            content: null
        }
    },
    getters:{
        complainInfo: state => state.complain.content,
        complainPage: state => state.complain.pageInfo
    },
    mutations: {
        GETCOMPLAININFO: (state, result) => {
            state.complain.pageInfo = result.pageInfo;
            state.complain.content = result.data;
        }
    },
    actions: {
        // 查
        getComplainInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了getComplainInfo');
            getComplainInfo(params.pageInfo).then(result => {
                commit("GETCOMPLAININFO", {
                    data: result.data.list,
                    pageInfo: {
                        pageSize: result.data.pageSize,
                        pageNum: result.data.pageNum,
                        totalItems: result.data.total
                    }
                });
            });
        },
        deleteComplainInfo({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了deleteComplainInfo');
            DeleteComplain(params.id).then(result => {
                getComplainInfo(state.complain.pageInfo).then(result => {
                    commit("GETCOMPLAININFO", {
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
    }
}

export default Complain;