import { get,post } from "@/services/ajax.js"

export function getGoodsList(params){
    return get("/goods/getGoodsAll",params);
}

export function getGoodsInfo(params){
    return get("/goods/getGoodsInfo",params);
}


export function getServerCurrentTime(){
    return get("/getCurrentDate");
}

export function createSeckillOrder(body){
    return post("/order/seckillOrder",body)
}