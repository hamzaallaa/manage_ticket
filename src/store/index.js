import { createStore } from 'vuex'
import global from './modules/me'
import sideMenu from './modules/side-menu'

export default createStore({
  modules: {
    global,
    sideMenu
  }
})