import * as types from '@/store/mutationTypes'

const state = {
  title: 'Astronomy Picture of the Day'
}

const mutations = {
  [types.SET_TOOLBAR_TITLE] (state, title) {
    state.title = title
  }
}

const actions = {
  setTitle ({ commit }, title) {
    if (title) {
      commit(types.SET_TOOLBAR_TITLE, title)
    }
  }
}

const getters = {
  getTitle: state => state.title
}

export default {
  state,
  getters,
  mutations,
  actions
}
