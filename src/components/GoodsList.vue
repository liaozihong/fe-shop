<template>
<el-container>
    <el-header><h3>商品列表</h3></el-header>
  <el-main>

<el-row :gutter="10">
  <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-bind:key="goods.gid" v-for="goods in goods_list" >
  <router-link tag="a" :to="{path: '/goods.htm', query:{gid: goods.gid}}" target="_blank">
    <!-- <a @click="clickByGoodsInfo(goods.gid)"> -->
      <img width="300px" height="300px" v-bind:src="goods.goodsPicUrl">
      <div class="goods-title"><span>{{goods.goodsTitle}}</span></div>
     <div class="goods-info"><span class="goods-discount-price">￥{{goods.goodsDiscountPrice}}</span>
     <span class="goods-no"> {{goods.goodsNo}}</span>
     </div>
   </router-link>
  </el-col>
</el-row>

</el-main>

  <el-footer>备案信息等等</el-footer>
</el-container>
</template>

<script>
import { getGoodsList } from '@/services/getData.js';

export default {
  name: 'GoodsList',
  data() {
    return {
      goods_list: [],
      total:0,
      pageNo:0,
      pageSize:0,
    }
  },
  created() {
    this.loadGoodsList();
  },
  methods: {
    clickByGoodsInfo(gid){
        this.$router.push({ path: '/goods.htm', query:{gid: gid}})
    },
    loadGoodsList(){
      this.params={
        pageNo:1,
        pageSize:10,
      }
      getGoodsList(this.params).then(response=>{
        this.goods_list = response.data.records
        this.total=response.data.total
        this.pageNo=response.data.pages
        this.pageSize=response.data.size
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a { 
  text-decoration: none;
  color:#666;
}
.el-row {
    width: 80%;
    margin-left:15% !important;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.el-col {
  width:300px;
  height:400px;
  margin: 20px;
  padding: 0 !important;
}
.goods-title{
  margin:5px 5px;
  text-align:left;
}
.goods-no{
  margin:5px 5px;
    float: right;
}
.goods-discount-price{
  margin:5px 5px;
  float:  left;
  color:red;
}
</style>
