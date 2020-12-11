/* eslint-disable no-shadow */

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_COLOR: (state, { resourceId, color }) => {
    state[resourceId] = Object.assign({}, { color })
  }
}

const actions = {
  setColor({ commit }, { resourceId, color }) {
    commit('SET_COLOR', { resourceId, color })
  },
  resetState({ commit }) {
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
