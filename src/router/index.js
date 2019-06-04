import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Apod from '@/components/Apod'
import Asteroid from '@/components/Asteroid'
import Fireballs from '@/components/Fireballs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/apod',
      name: 'Apod',
      component: Apod
    },
    {
      path: '/asteroid',
      name: 'Asteroid',
      component: Asteroid
    },
    {
      path: '/fireballs',
      name: 'Fireballs',
      component: Fireballs
    }
  ]
})
