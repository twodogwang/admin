import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import admin from './modules/admin';
import baseInfo from './modules/baseInfo';
import wuye from './modules/wuye';
import repair from './modules/repair';
import complain from './modules/complain';
import originaldata from './modules/originaldata';
import expense from './modules/expense';
import getwuyeinfo from './modules/getwuyeinfo';
import lockmanage from './modules/lockmanage';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        user,
        permission,
        admin,
        baseInfo,
        wuye,
        repair,
        complain,
        originaldata,
        expense,
        getwuyeinfo,
        lockmanage
    },
    getters
});

export default store;