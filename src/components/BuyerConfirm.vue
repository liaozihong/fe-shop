<template>
  <div>
    <BuyerInfoList :gid="gid" :requestBody="requestBody"></BuyerInfoList>
    <div class="order_btn" @click="createOrder()">确认订单</div>
  </div>
</template>

<script>
import { createSeckillOrder } from "@/services/getData.js";
import BuyerInfoList from "./child/BuyerInfoList";
export default {
  name: "BuyerConfirm",
  components: {
    BuyerInfoList
  },
  data() {
    return {
      requestBody: [],
      gid: 0,
    };
  },
  created() {
    let gid = this.$route.query.gid;
    this.gid = gid;
    let data_key = gid + "_requestBody";
    if (Object.keys(this.$route.params).length !== 0) {
      this.requestBody.push(this.$route.params);
      localStorage.setItem(data_key, JSON.stringify(this.requestBody));
    }
    if (
      Object.keys(this.$route.params).length === 0 &&
      localStorage.getItem(data_key)
    ) {
      this.requestBody = [].concat(JSON.parse(localStorage.getItem(data_key)));
    }
  },
  methods: {
    createOrder() {
      let data = this.requestBody[0];
      this.body = {
        gid: this.$route.query.gid,
        skuId: data.skuInfo.sku_id,
        buyerCount: data.buyerCount
      };
      createSeckillOrder(this.body)
        .then(response => {
          var data = response.data;
          if (response.code == 0) {
            this.$message("订单创建成功!");
          } else {
            this.$message(response.msg | "订单创建失败!");
          }
        })
        .catch(err => {
          this.$message("订单创建失败!" + err);
        });
    }
  }
};
</script>
<style scoped>
.order_btn {
  display: inline-block;
  width: 182px;
  height: 39px;
  position: relative;
  vertical-align: middle;
  line-height: 39px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  background: #dd2727;
  color: #fff;
  margin: 20px 0 0 0;
}
</style>