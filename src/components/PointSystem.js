import { reactive } from 'vue';
import { props, pointNode } from './ProdCons.vue';

export class PointSystem {
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
});
}

producePoints() {
console.log('点击生产');
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
let text = '';
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
text = localCustomerCount; //此处的参数localCustomerCount为生产停产状态
break;
default:
text = '?';
}
let textNode = document.createElement('div');
let str = `${text}，库存剩余${this.data.stock}个`;
textNode.innerText = str;
// 存入日志并将消息添加到页面
this.log(str);
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
let log = JSON.parse(localStorage.getItem('log')) || [];
log.push(text);
localStorage.setItem('log', JSON.stringify(log));
}
}
