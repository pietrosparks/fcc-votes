// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Buefy from 'buefy';
import 'buefy/lib/buefy.css';
import Auth from '@/mixin/auth'
import Swal from 'sweetalert2'



Vue.use(Buefy);
Vue.mixin(Auth);
Vue.config.productionTip = false

Vue.prototype.$axios = axios;
Vue.prototype.$responseModal = Swal;

console.log(process.env,"envi")
if(process.env.NODE_ENV=="development"){
  axios.defaults.baseURL = process.env.BASEURL_DEV
}
else axios.defaults.baseURL = process.env.BASEURL_PROD;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
