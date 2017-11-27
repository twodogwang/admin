import {
    getCommunities,
    getNper,
    getUnit,
    getFloor,
    getRoom
} from '@/api/getwuyeinfo';

const wuyeinfo = {
    state: {
        LXLcommunities: {
            pageInfo: null,
            content: null
        },
        LXLnper: {
            pageInfo: null,
            content: null
        },
        LXLfloor: {
            pageInfo: null,
            content: null
        },
        LXLunit: {
            pageInfo: null,
            content: null
        },
        LXLroom: {
            pageInfo: null,
            content: null
        }
    },
    getters: {
        LXLcommunitiesInfo: state => state.LXLcommunities.content,
        LXLnperInfo: state => state.LXLnper.content,
        LXLfloorInfo: state => state.LXLfloor.content,
        LXLunitInfo: state => state.LXLunit.content,
        LXLroomInfo: state => state.LXLroom.content
    },
    mutations: {
        GETNPERINFO: (state, result) => {
            state.LXLnper.content = result.data;
        },
        GETCOMMUNITIESINFO: (state, result) => {
            state.LXLcommunities.content = result.data;
        },
        GETFLOORINFO: (state, result) => {
            state.LXLfloor.content = result.data;
        },
        GETUNITINFO: (state, result) => {
            state.LXLunit.content = result.data;
        },
        GETROOMINFO: (state, result) => {
            state.LXLroom.content = result.data;
        }
    },
    actions: {
        // 小区
        getCommunities({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了getCommunities');
            getCommunities(params.pageInfo).then(result => {
                commit("GETCOMMUNITIESINFO", {
                    data: result.data,
                });
            });
        },
        //期数
        getNper({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了GETNPERINFO');
            getNper(params.pageInfo).then(result => {
                commit("GETNPERINFO", {
                    data: result.data
                });
            });
        },
        //单元
        getUnit({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了GETUNITINFO');
            getUnit(params.pageInfo).then(result => {
                commit("GETUNITINFO", {
                    data: result.data
                });
            });
        },
        //楼栋
        getFloor({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了GETFLOORINFO');
            getFloor(params.pageInfo).then(result => {
                commit("GETFLOORINFO", {
                    data: result.data
                });
            });
        },
        //房间
        getRoom({
            commit,
            state
        }, params = {}) {
            console.log('dispatch了GETROOMINFO');
            getRoom(params.pageInfo).then(result => {
                commit("GETROOMINFO", {
                    data: result.data
                });
            });
        },
        
    }
}

export default wuyeinfo;