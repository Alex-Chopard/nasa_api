import Vue from 'vue'
import Vuex from 'vuex'

import toolbar from '@/store/modules/toolbar'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    toolbar
  }
})
