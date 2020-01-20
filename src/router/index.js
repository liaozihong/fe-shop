import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/components/GoodsList'
import GoodsInfo from '@/components/GoodsInfo'
import BuyerConfirm from '@/components/BuyerConfirm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/goods.htm',
      name: 'GoodsInfo',
      component: GoodsInfo
    },
    {
      path: '/buyer_confirm.htm',
      name: 'BuyerConfirm',
      component: BuyerConfirm
    }
  ]
})
