const phonelist = {
  state: {
    content: null,
    pageInfo: null
  },
  getters: {
    phonelistPage: state => state.pageInfo,
    phonelistInfo: state => state.content
  },
  mutations: {
    GETPHONELISTINFO: (state, result) => {
      state.content = result.data;
      state.pageInfo = result.pageInfo;
    }
  },
  actions: {
    getphonelist({
      commit,
      state
    }, params = {}) {
        console.log('dispatch了'+arguments.callee)
        return new Promise((resolve,reject)=>{
            
        })
    }
  }
}
