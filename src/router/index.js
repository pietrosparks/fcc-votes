import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Polls from '@/components/Polls'
import Poll from '@/components/Poll'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/login',
      name: 'HelloWorld',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/polls',
      name: 'Polls',
      component: Polls
    },
    {
      path:'/polls/:id',
      name:'Poll',
      component:Poll
    }
  ]
})