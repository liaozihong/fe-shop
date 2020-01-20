<template>
  <div>
    <el-button @click="handleClick" :disabled="disabled">{{btnText}}</el-button>
    <span>{{tip}}</span>
  </div>
</template>
 
<script>
import moment from "moment";

import { getServerCurrentTime } from "@/services/getData.js";
export default {
  name: "Spike",
  props: {
    startTime: {
      required: true,
      validator: val => {
        return moment.isMoment(val);
      }
    },
    endTime: {
      required: true,
      validator: val => {
        return moment.isMoment(val);
      }
    },
    gid:{
      required: true,
    }
  },
  data() {
    return {
      start: false,
      end: false,
      done: false,
      tip: "",
      isParticipation: false,
      timeGap: 0,
      btnText: ""
    };
  },
  mounted() {
   
  },
  computed: {
    disabled() {
      //当三个异号的时候disable返回真，不可点击，
      // 初始化通过this.updateState确定disable的状态
      return !(this.start && !this.end && !this.done);
    }
  },
  async created() {
     let key=this.gid+"_isParticipation";
     if (localStorage.getItem(key)) {
      try {
        this.isParticipation = localStorage.getItem(key);
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
    if (this.isParticipation) {
      this.done = true;
      this.btnText = "已参加过活动";
    } else {
      let currentServerTime = await getServerCurrentTime().then(response => {
        return response.data;
      });
      const serverTime = await this.getServerTime(currentServerTime);
      this.timeGap = Date.now() - serverTime; //当前时间和服务器时间差
      // this.updateState();
      this.timeInterval = setInterval(() => {
        this.updateState();
      }, 1000);
    }
  },
  updated() {
    if (this.end || this.done) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    handleClick() {
      this.$emit("buyer-event", val => {
        this.isParticipation = val;
        //禁用掉按钮
        this.saveState();
      });
      if (this.isParticipation) {
        this.done = true;
        this.btnText = "已参加过活动";
      }
    },
    getServerTime(currentServerTime) {
      //模拟服务器时间
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          //当前时间慢10秒就是服务器时间
          resolve(new Date(currentServerTime).getTime()); //跟本地时间差
        }, 0);
      });
    },
    updateState() {
      const now = moment(new Date(Date.now() - this.timeGap)); //当前服务器时间
      const diffStart = this.startTime.diff(now); //开始时间和服务器时间之差
      const diffEnd = this.endTime.diff(now); //结束时间和服务器时间之差
      if (diffStart < 0) {
        this.start = true;
        this.tip = "秒杀已开始";
        this.btnText = "立即抢购";
      } else {
        this.tip = `距离秒杀开始还剩${Math.floor(
          diffStart / 1000 / 60 / 60
        )}小时${Math.floor((diffStart / 1000 / 60) % 60)}分${Math.floor(
          (diffStart / 1000) % 60
        )}秒`;
        this.btnText = "活动未开始";
      }
      if (diffEnd <= 0) {
        this.end = true;
        if (!this.btnText === "已参加过活动" || this.btnText === "立即抢购") {
          this.tip = "秒杀已结束";
          this.btnText = "活动已结束";
        }
      }
    },
    saveState() {
      localStorage.setItem(this.gid+"_isParticipation", this.isParticipation);
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  }
};
</script>
 
<style scoped>
button[disabled] {
  cursor: not-allowed;
}
</style>