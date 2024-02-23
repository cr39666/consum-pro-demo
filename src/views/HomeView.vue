<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import ProdCons from '../components/ProdCons.vue'

</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <!-- 传递生产和消耗速率，并可以自定义设置样式 -->
    <ProdCons :produceRate="4" :consumeRate="2" :customStyle="{ height:'50vh' }" />
    <ProdCons :produceRate="4" :consumeRate="2" :customStyle="{ height:'50vh' }" />
    
  </main>
</template>

<style scoped>
main {
  height: 100vh;
}
</style>