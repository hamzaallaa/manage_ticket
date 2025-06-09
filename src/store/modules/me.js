// initial state
const state = () => ({
    me: {}
  })
  
  // getters
  const getters = {
    me: (state, getters, rootState) => {
      return state.me;
    },
  }
  
  // actions
  const actions = {
    updateMe ({ state, commit }, me) {
      commit('pushMeToObject', me)
    }
  }
  
  // mutations
  const mutations = {
    pushMeToObject (state, me) {
      state.me = me
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  } 