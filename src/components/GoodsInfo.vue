<template>
  <div class="goods_view">
    <div class="image_list">
      <el-carousel height="350px">
        <el-carousel-item v-for="picture in picture_list" :key="picture">
          <img width="350px" height="350px" v-bind:src="picture" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-card class="goods_main_info">
      <div slot="header" class="clearfix">
        <span>{{goods_info.goodsTitle}}</span>
      </div>
      <div class="text item">
        原
        <label class="letter-space">空</label>价：
        <span class="goods-price">{{goods_info.goodsPrice}}</span>
      </div>
      <div class="text item">
        折扣价：
        <span style="font-size:16px;color:red">{{price}}</span>
      </div>
      <div class="text item">
        货
        <label class="letter-space">空</label>号：
        <span>{{goods_info.goodsNo}}</span>
      </div>
      <div class="text item">
        上
        <label class="letter-space">空</label>架：
        <span>{{goods_info.putawayTime}}</span>
      </div>
      <div class="text item">
        <div class="selector-item-name">
          颜
          <label class="letter-space">空</label>
          色：
        </div>
        <div class="selector-item-content">
          <span
            class="sku-selector color"
            :class="activeColorClass == index ? 'active':''"
            v-for="(color,index) in colors"
            v-on:click="handleColorClick(color.color_pid,index)"
            :key="color.color_pid"
          >
            <img
              v-bind:title="color.color_name"
              v-bind:src="color.img_url+'_40x40.jpg'"
              v-if="color.img_url"
            />
            <span v-else>{{color.color_name}}</span>
          </span>
        </div>
      </div>

      <div class="text item">
        <div class="selector-item-name">
          尺
          <label class="letter-space">空</label>
          寸：
        </div>
        <div class="selector-item-content">
          <span
            class="sku-selector size"
            :class="activeSizeClass == index ? 'active':''"
            v-for="(size,index) in sizes"
            v-on:click="handleSizeClick(size.size_pid,index)"
            :key="size.size_pid"
          >{{size.size_name}}</span>
        </div>
      </div>
      <div class="text item">
        <div class="selector-item-name">
          数
          <label class="letter-space">空</label>
          量：
        </div>
        <el-input-number
          size="small"
          v-model="buyer_num"
          @change="handleStoreChange"
          :min="0"
          :max="limit_buyer_count"
          label="购买数量"
        ></el-input-number>
        库存数： {{max_store_num}}
      </div>
      <Spike :startTime="seckillStartTime" :gid="goods_info.gid" :endTime="seckillEndTime" @buyer-event="buyerClick"></Spike>
      <!-- <el-button @click="buyerClick">快速抢购</el-button>
      <el-button type="danger">加入购物车</el-button>-->
    </el-card>
    <el-card class="goods_desc">
      <div slot="header" class="clearfix">
        <div class="detail_tilte">
          <span>宝贝详情</span>
        </div>
        <el-card>
          <div class="prop_info" v-for="prop in prop_list" :key="prop">{{prop}}</div>
        </el-card>
        <div v-html="goods_info.goodsDesc"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsInfo } from "@/services/getData.js";
import Spike from "./child/Spike";
import moment from "moment";
export default {
  name: "GoodsInfo",
  components: {
    Spike
  },
  data() {
    return {
      buyer_num: 0, //购买数
      limit_buyer_count: 0,
      max_store_num: 0, //最大库存数
      price: 0, //折扣价
      activeColorClass: -1, // 0为默认选择第一个，-1为不选择
      activeSizeClass: -1,
      seckillEndTime: moment(new Date()),
      seckillStartTime: moment(new Date()),
      activeColorPid: "",
      activeSizePid: "",
      activeSkuId: 0,
      goods_info: {},
      picture_list: [],
      prop_list: [],
      sizes: [],
      colors: [],
      sku_list: []
    };
  },
  created() {
  },
  mounted() {
    this.params = {
      gid: this.$route.query.gid
    };
    getGoodsInfo(this.params)
      .then(response => {
        var data = response.data;
        this.goods_info = data;
        this.limit_buyer_count = data.limitBuyerCount;
        this.price = this.goods_info.goodsDiscountPrice;
        this.picture_list = data.goodsPicUrlList.split(",");
        //判断是否需要设置秒杀
        if (
          data.isEnableSeckill === 1 &&
          data.seckillStartTime &&
          data.seckillEndTime
        ) {
          this.seckillStartTime = moment(new Date(data.seckillStartTime));
          this.seckillEndTime = moment(new Date(data.seckillEndTime));
        }
        var propsArr = data.propsNames.split(";");
        var props = new Map();
        propsArr.forEach(prop => {
          var prop_kv = prop.split(":");
          if (props.has(prop_kv[2])) {
            var found = props.get(prop_kv[2]);
            found = found + " " + prop_kv[3];
            props.set(prop_kv[2], found);
          } else {
            props.set(prop_kv[2], prop_kv[3]);
          }
        });
        for (var [key, value] of props) {
          this.prop_list.push(key + ":" + value);
        }
        var sku_array = JSON.parse(data.skuJson);
        for (var sku of sku_array.sku) {
          var sku_prop = sku.properties_name.split(";");
          this.sku_list.push({
            num: sku.num,
            sku_id: sku.sku_id,
            price: sku.price2,
            img_url: sku.img_url,
            color_pid: sku_prop[0].split(":")[1],
            color_name: sku_prop[0].split(":")[2],
            size_pid: sku_prop[1].split(":")[1],
            size_name: sku_prop[1].split(":")[2]
          });
        }
        var hash = {};
        this.colors = this.sku_list.reduce(function(arr, current) {
          hash[current.color_pid]
            ? ""
            : (hash[current.color_pid] = true && arr.push(current));
          return arr;
        }, []);
        this.sizes = this.sku_list.reduce(function(arr, current) {
          hash[current.size_pid]
            ? ""
            : (hash[current.size_pid] = true && arr.push(current));
          return arr;
        }, []);
      })
      .catch(err => {
        this.$message("获取商品信息失败!" + err);
      }).finally(() => this.loading = false);
  },
  methods: {
    buyerClick(callback) {
      if (
        this.buyer_num != 0 &&
        this.activeColorPid != "" &&
        this.activeSizePid != "" &&
        this.activeSkuId != 0
      ) {
        var skuInfo = this.sku_list.find(
          element => element.sku_id === this.activeSkuId
        );
        callback(true);
        this.preOrder(this.goods_info,skuInfo, this.buyer_num);
      } else {
        this.$message("请检查颜色、尺寸、数量信息是否填写");
        callback(false);
      }
    },
    handleStoreChange(value) {
      this.buyer_num = value;
    },
    handleColorClick(value, index) {
      this.activeColorClass = index;
      this.activeColorPid = value;
      if (this.activeSizeClass != 0) {
        for (var sku of this.sku_list) {
          if (
            sku.size_pid === this.activeSizePid &&
            sku.color_pid === this.activeColorPid
          ) {
            this.max_store_num = sku.num;
            this.price = sku.price;
            this.activeSkuId = sku.sku_id;
          }
        }
      }
    },
    handleSizeClick(value, index) {
      this.activeSizeClass = index;
      this.activeSizePid = value;
      if (this.ctiveColorClass != 0) {
        for (var sku of this.sku_list) {
          if (
            sku.size_pid === this.activeSizePid &&
            sku.color_pid === this.activeColorPid
          ) {
            this.max_store_num = sku.num;
            this.price = sku.price;
            this.activeSkuId = sku.sku_id;
          }
        }
      }
    },
    preOrder(goodsInfo,skuInfo, buyerCount) {
      // resolve
      let routeUrl = this.$router.push({
        name: "BuyerConfirm",
        query: {
          gid: goodsInfo.gid,
        },
        params: {
          goods_title: goodsInfo.goodsTitle,
          goods_image:goodsInfo.goodsPicUrl,
          skuInfo: skuInfo,
          buyerCount: buyerCount
        }
      });
      // window.open(routeUrl.href, "_blank");
    },
  }
};
</script>

<style>
.goods-price {
  font-size: 16px;
  color: red;
  text-decoration: line-through;
}
.selector-item-content {
  margin-left: 60px;
  padding: 13px 0 0;
}
.selector-item-name {
  color: #999;
  float: left;
  padding: 13px 0 12px;
}

.sku-selector {
  display: inline-block;
  padding:0 5px 0 5px;
  min-width: 40px;
  height: 40px;
  border: 1px solid #eee;
  line-height: 40px;
  color: #999;
  margin: -5px 5px 10px 0px;
  position: relative;
  cursor: pointer;
  text-align: center;
}
.active {
  border: 2px solid red;
}
.el-card {
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1) !important;
}
.el-carousel__indicators {
  display: none;
}
.goods_view {
  width: 900px;
  margin: 10% 0 0 20%;
}
.image_list {
  width: 350px;
  height: 350px;
  float: left;
  margin: 0 0 0 50px;
}
.goods_title {
  width: 300px;
  float: left;
  margin: 0 0 30px 30px;
}
.goods_main_info {
  border: 0px solid #ebeef5;
  padding-left: 30px;
}
.text {
  font: 13px/1 MicrosoftYaHei, "å¾®è½¯é›…é»‘", Tahoma, Helvetica, Arial,
    "å®‹ä½“", sans-serif;
  text-align: left;
  color: #999;
}

.item {
  margin: 18px 0 18px 0;
}
.goods_desc {
  margin: 50px 0 0 50px;
  border: 0px solid #ebeef5;
}
.detail_tilte {
  height: 40px;
  line-height: 40px;
  color: #333;
  font-size: 16px;
  font-family: "Microsoft YaHei";
  position: relative;
  font-weight: 400;
  vertical-align: middle;
  text-align: left;
}
.prop_info {
  float: left;
  width: 225px;
  padding-right: 30px;
  height: 20px;
  line-height: 20px;
  padding-bottom: 20px;
  font-weight: 400;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #999;
}
.letter-space {
  visibility: hidden;
}
</style>
