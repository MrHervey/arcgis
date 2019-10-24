import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const state = new Vuex.Store({
  state: {
    count: 45
  },
  mutations:{
    inc: (state,n) => state.count += n,
    dec: state => state.count--,
  },
  getters:{
    count:function (state) {
       return state.count +100
    }
  },
  actions:{
    incPlus(context){
      context.commit('inc',1);
      setTimeout(()=>{
        context.commit('dec');
      },3000)
    },
    decPlus({commit}){
        commit('dec');
    }
  }
});

export default state
