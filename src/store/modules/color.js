/* eslint-disable no-shadow */

const getDefaultState = () => {
  return {
    APP: { color: 'rgba(155, 120, 0, 1)' }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_COLOR: (state, { resourceId, color }) => {
    state[resourceId] = Object.assign({}, { color })
    console.log('------------------------------------------------------')
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
