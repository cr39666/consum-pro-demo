<template>
    <div class="about" :style="customStyle">
        <div class="handleArea">
            <button @click="pointSystem.producePoints"
                :style="{ color: pointSystem.data.isProduce ? 'green' : 'red' }">{{ pointSystem.data.isProduce ? '生产ing'
                    : '停产ing' }}</button>
            <button @click="pointSystem.consumePoints">消耗</button>
        </div>
        <div class="text">
            <div class="console">
                <h3>生产量：{{ pointSystem.data.points }} &nbsp;&nbsp;&nbsp;消耗量：{{ pointSystem.data.expend }} &nbsp;&nbsp;&nbsp;
                    库存：{{ pointSystem.data.stock }}</h3>
                <input type="text" placeholder="库存变动详情↓" />
            </div>
            <div id="log" ref="pointNode" class="log"></div>
            <!-- <div v-for="(item,index) in log.data.log" :key="index">{{ item }}</div> -->
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'

const props = defineProps({
    produceRate: {
        type: Number,
        default: 3
    },
    consumeRate: {
        type: Number,
        default: 2
    },
    customStyle: {
        type: Object,
        default: () => ({})
    }
})

const pointNode = ref(null)


class Goods {
    constructor(name){
        this.data=reactive({
            name:name,
            stock:0,
        })

    }
    addStock(addRate){
        this.data.stock += addRate
    }
    reduceStock(reduceRate){
        if(this.data.stock < reduceRate){
            return console.log(this.data.name+'库存不足')
        }
        this.data.stock -= reduceRate
    }
    get stock(){
        return this.data.stock
    }
}

class Product {
    constructor(goods) {
        this.goods = goods
        this.data = reactive({
            produceRate: props.produceRate,
            isProduce: false,
            dom: null
        })
    }
    produce() {
        this.goods.addStock(this.goods.produceRate)
        this.data.isProduce = true
        log.addLog('生产了' + this.goods.produceRate + '个，库存剩余' + this.goods.stock + '个')
        this.produceTimeout = setTimeout(() => {
            this.produce()
        }, 1000)
    }

    switch() {
        this.data.isProduce = !this.data.isProduce
        isProduce ? this.produce() : clearTimeout(this.produceTimeout)
    }
}

class Consume {
    constructor(goods,consumer){
        this.data = reactive({
            goods: goods,
            consumeRate: props.consumeRate,
            name: consumer
        })
    }
    consume(){
        if(this.goods.data.stock - this.data.consumeRate < 0){
            console.log(this.data.goods + '库存不足')
        }else{
            this.goods.reduceStock(this.data.consumeRate)
            log.addLog('消费了'+this.data.consumeRate+'个，库存剩余'+this.goods.stock+'个')
        }

    }
}

class Log{
    constructor(){
        this.data = reactive({
            log: []
        })
    }
    addLog(text){
        if(this.data.log.length > 100){
            this.data.log.shift()
        }
        this.data.log.push(text)
    }
    toLocalStorage(){
        localStorage.setItem('log',JSON.stringify(this.data.log))
    }


}

const log = new Log()
const goods1 = new Goods("商品1")
const prod = new Product(goods1)
// 点击按钮时触发：
// prod.produce()

// 点击按钮时新建一个顾客，并触发：cons.consume()
let customerCount = 0
customerCount ++ 
const cons = new Consume(goods1,'顾客'+customerCount)
// cons.consume()


/**
 * 以上为oop写法
 */ 

class PointSystem {
    constructor() {
        this.data = reactive({
        stock: 0,
        points: 0,
        expend: 0,
        isProduce: false,
        customerCount: 0,
        produceRate: props.produceRate,
        consumeRate: props.consumeRate,
        isAutoScrolling: true,
        })
    }

    producePoints() {
        this.data.isProduce = !this.data.isProduce;
        this.updatePoints(4, this.data.isProduce ? '开始生产' : '停止生产');
        this.data.isProduce ? this.produce() : clearTimeout(this.produceTimeout);
    }

    produce() {
        if (!this.data.isProduce) {
        return;
        }
        this.data.points += this.data.produceRate;
        this.data.stock += this.data.produceRate;
        this.updatePoints(1);
        this.produceTimeout = setTimeout(() => this.produce(), 1000);
    }

    consumePoints() {
        this.data.customerCount++;
        const localCustomerCount = this.data.customerCount;
        this.consume(localCustomerCount);
    }

    consume(localCustomerCount) {
        if (this.data.stock - this.data.consumeRate >= 0) {
        this.data.stock -= this.data.consumeRate;
        this.data.expend += this.data.consumeRate;
        this.updatePoints(2, localCustomerCount);
        setTimeout(() => this.consume(localCustomerCount), 1000);
        } else {
        this.updatePoints(3, localCustomerCount);
        setTimeout(() => this.consume(localCustomerCount), 1000);
        }
    }

    updatePoints(type, localCustomerCount) {
        let text = ''
        switch (type) {
        case 1:
            text = `生产了${this.data.produceRate}个`;
            break;
        case 2:
            text = `顾客${localCustomerCount}消费了${this.data.consumeRate}个`;
            break;
        case 3:
            text = `顾客${localCustomerCount}欲消费${this.data.consumeRate}个,但库存不足，未消费`;
            break;
        case 4:
            text = localCustomerCount;  //此处的参数localCustomerCount为生产停产状态
            break;
        default:
            text = '?';
        }
        let textNode = document.createElement('div')
        let str = `${text}，库存剩余${this.data.stock}个`
        textNode.innerText = str
        // 存入日志并将消息添加到页面
        this.log(str)
        pointNode.value.appendChild(textNode);
        // 判断消息是否需要滚动
        if (this.data.isAutoScrolling) {
        pointNode.value.scrollTop = pointNode.value.scrollHeight;
        }
        // 如果消息超过了100条，则删除上边的消息
        if (pointNode.value.childElementCount > 100) {
        pointNode.value.removeChild(pointNode.value.firstElementChild);
        }
    }

    log(text) {
        // 将日志添加到浏览器缓存中的log数组中
        let log = JSON.parse(localStorage.getItem('log')) || []
        log.push(text)
        localStorage.setItem('log', JSON.stringify(log))
    }
}

const pointSystem = new PointSystem(); 

onMounted(() => {
    localStorage.clear();
    //   let pointNode = document.getElementById('log')
    pointNode.value.addEventListener('scroll', function () {
        // 判断用户是否向上滚动
        if (pointNode.value.scrollTop < pointNode.value.scrollHeight - pointNode.value.clientHeight) {
            pointSystem.isAutoScrolling = false;
        } else {
            pointSystem.isAutoScrolling = true;
        }
    });
})

</script>
<style scoped>
  .about {
    height: 100%;
    min-height: 140px;
    width: 100%;
    border: 1px solid #ccc;
  }

  .handleArea {
    width: 100%;
    height: 26px;
    padding: 2px;
    /* border: 1px solid red; */
    display: flex;
    justify-content: space-around;
  }


  .text {
    height: calc(100% - 26px);
    position: relative;
  }

  .console {
    position: sticky;
    top: 0;
    background-color: white;
    border-top: 1px solid #ccc;
    height: 60px;
  }

  .log {
    height: calc(100% - 60px);
    /* border: 1px solid #ccc; */
    overflow-y: scroll;
  }

  .console>input {
    border: 0px;
  }

</style>