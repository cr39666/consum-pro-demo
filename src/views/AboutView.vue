<template>
  <div class="about">
    <div class="handleArea">
      <div>
        <button @click="pointSystem.producePoints" :style="{ color: pointSystem.data.isProduce ? 'green' : 'red' }">{{pointSystem.data.isProduce? '生产ing' : '停产ing'}}</button>
        <button @click="pointSystem.consumePoints">消耗</button>
      </div>
    </div>
    <div class="text">
      <div class="console">
        <h3>生产量：{{ pointSystem.data.points }} &nbsp;&nbsp;&nbsp;消耗量：{{ pointSystem.expend }} &nbsp;&nbsp;&nbsp; 库存：{{ pointSystem.data.stock }}</h3>
        <input type="text" placeholder="库存变动详情↓" />
      </div>
      <div id="log" class="log"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'


// // 商品对象
// class goods
// // 类型
// type
// // 库存
// stock
// max

// //生产对象
// class produce
// // 商品对象
// goodsType
// // 生产状态
// start
// // 生产速率
// produceRate
// dom

// // 生产
// prod(){
//   goods.stock + produceRate > goods.max ?
//   休息 :
//   定时
//     生产(dom)
//     prod()
// }
// // 切换生产状态
// switch()

// // 消费
// class consume
// // 消费商品
// goods
// // 消费速率
// consumeRate
// // 名称
// name
// // 消费
// cons();


// export
// 1.制造一个商品 
//   g =  new goods(type,0)
// 2.创建工厂对象
//   p = new produce(g,start,3)
// 3.消费商品
//   c = new consume(g,2,'顾客1')
//  p.prod()
//  c.cons()


//  import {g,p,c} from 'AAA/X' 2
//  const  data  = constructor() {
//  g,p,c
// }

// export X 1
// import x from 'AAA/X' 2



class PointSystem {
  constructor() {
    this.data = reactive({
      stock: 0,
      points: 0,
      expend: 0,
      isProduce: false,
      customerCount: 0,
      produceRate: 3,
      consumeRate: 2,
      isAutoScrolling: true,
    })
  }

  producePoints() {
    console.log('点击生产')
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
    // 存入日志
    this.log(str)
    let pointNode = document.getElementById('log')
    pointNode.appendChild(textNode);
    // 判断消息是否需要滚动
    if (this.data.isAutoScrolling) {
      pointNode.scrollTop = pointNode.scrollHeight;
    }
    // 如果消息超过了100条，则删除上边的消息
    if (pointNode.childElementCount > 100) {
      pointNode.removeChild(pointNode.firstElementChild);
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
  let pointNode = document.getElementById('log')
  pointNode.addEventListener('scroll', function () {
      // 判断用户是否向上滚动
      if (pointNode.scrollTop < pointNode.scrollHeight - pointNode.clientHeight) {
          pointSystem.isAutoScrolling = false;
      } else {
          pointSystem.isAutoScrolling = true;
      }
  });
})

// // 库存量,生产量，消耗量
// let stock = ref(0)
// let points = ref(0)
// let expend = ref(0)
// // 生产状态
// let isProduce = ref(false)
// // 顾客数量
// let customerCount = ref(0)
// // 每次生产的个数，每次消费的个数
// let produceRate = ref(3)
// let consumeRate = ref(2)

// // 生产函数  
// function producePoints() {
//   isProduce.value = !isProduce.value;
//   let produceTimeout;
//   updatePoints(4,isProduce.value? '开始生产' : '停止生产');
//   // 通过判断生产状态，来决定生产或停产
//   isProduce.value ? produce() : clearTimeout(produceTimeout);
//   function produce() {
//     // 如果当前是停止生产状态，则直接返回
//     if (!isProduce.value) {
//       return;
//     }
//     points.value += produceRate.value;
//     stock.value += produceRate.value;
//     updatePoints(1);
//     produceTimeout = setTimeout(produce, 1000);
//   }
// }

// // 消费函数  
// function consumePoints() {
//   customerCount.value++; // 顾客位数+1
//   const localCustomerCount = customerCount.value;
//   function consume() {
//     // 判断库存是否足够
//     if (stock.value - consumeRate.value >= 0) {
//       stock.value -= consumeRate.value;
//       expend.value += consumeRate.value;
//       updatePoints(2, localCustomerCount);
//       setTimeout(consume, 1000);
//     } else {
//       updatePoints(3, localCustomerCount);
//       setTimeout(consume, 1000);
//     }
//   }
//   consume();
// }

// //  消息盒子自动滚动监听处理
// let pointNode = null
// let this.data.isAutoScrolling = true
// onMounted(() => {
//   localStorage.clear();
//   pointNode = document.getElementById('log')
//   pointNode.addEventListener('scroll', function () {
//       // 判断用户是否向上滚动
//       if (pointNode.scrollTop < pointNode.scrollHeight - pointNode.clientHeight) {
//           this.data.isAutoScrolling = false;
//       } else {
//           this.data.isAutoScrolling = true;
//       }
//   });
// })

// /**
//  * 更新库存，并输出消息
//  * @param {number} type 1表示生产，2表示消费, 3表示库存不足,4表示生产停产状态
//  * @param {number} localCustomerCount 顾客位数
//  */
// function updatePoints(type, localCustomerCount) {
//   let text = ''
//   switch (type) {
//     case 1:
//       text = `生产了${produceRate.value}个`;
//       break;
//     case 2:
//       text = `顾客${localCustomerCount}消费了${consumeRate.value}个`;
//       break;
//     case 3:
//       text = `顾客${localCustomerCount}欲消费${consumeRate.value}个,但库存不足，未消费`;
//       break;
//     case 4:
//       text = localCustomerCount;  //此处的参数localCustomerCount为生产停产状态
//       break;
//     default:
//       text = '?';
//   }
//   let textNode = document.createElement('div')
//   let str = `${text}，库存剩余${stock.value}个`
//   textNode.innerText = str
//   // 存入日志
//   log(str)
//   pointNode.appendChild(textNode);
//   // 判断消息是否需要滚动
//   if (this.data.isAutoScrolling) {
//     pointNode.scrollTop = pointNode.scrollHeight;
//   }
//   // 如果消息超过了100条，则删除上边的消息
//   if (pointNode.childElementCount > 100) {
//     pointNode.removeChild(pointNode.firstElementChild);
//   }
// }

// // 日志函数
// function log(text) {
//   // 将日志添加到浏览器缓存中的log数组中
//   let log = JSON.parse(localStorage.getItem('log')) || []
//   log.push(text)
//   localStorage.setItem('log', JSON.stringify(log))
// }

</script>


<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    border: 1px solid #ccc;
  }

  .handleArea {
    width: 100%;
    height: 50vh;
    /* border: 1px solid red; */
    padding-top: 20vh;
  }
  .handleArea>div:nth-of-type(1){
    display: flex;
    justify-content: space-around;
  }

  .text {
    height: 50vh;
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
    height: calc(50vh - 60px);
    /* border: 1px solid #ccc; */
    overflow-y: scroll;
  }

  .console>input {
    border: 0px;
  }

}</style>
