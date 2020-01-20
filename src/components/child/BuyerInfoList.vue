<template>
  <el-table :data="requestBody" style="width: 60%;margin-left:20%">
    <el-table-column label="店铺宝贝" width="300">
      <template slot-scope="scope">
        <div class="info-detail">
        <div style="float:left">
          <a target="blank" v-bind:href="'http://localhost:3000/goods.htm?gid='+gid">
            <img width="50" height="50" v-bind:src="scope.row.goods_image" />
          </a>
        </div>
          <div class="info-detail order_goods_title" v-bind:title="scope.row.goods_title">
            <a target="blank" v-bind:href="'http://localhost:3000/goods.htm?gid='+gid">{{ scope.row.goods_title }}</a>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="商品属性" width="180">
      <template slot-scope="scope">
        <span
          style="margin-left: 10px"
        >{{ scope.row.skuInfo.color_name }} : {{scope.row.skuInfo.size_name}}</span>
      </template>
    </el-table-column>
    <el-table-column label="单价">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.skuInfo.price }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="buyerCount" label="数量"></el-table-column>
    <el-table-column label="小计">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.skuInfo.price * scope.row.buyerCount}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "BuyerInfoList",
  props: {
    requestBody: {
      required: true
    },
    gid:{
      required:true
    }
  }
};
</script>

<style >
@import "../../scss/index.scss";
</style>