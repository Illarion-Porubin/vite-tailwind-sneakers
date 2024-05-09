<script setup>
import CardComp from './CardComp.vue'

defineProps({
  items: Array
})

const onClickAdd = () => {
  alert('Добавить')
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardComp
      v-for="item in items"
      :key="item.id"
      :price="item.price"
      :image-url="item.imageUrl"
      :title="item.title"
      :isAdded="true"
      :is-favorite="true"
      :onClickAdd="onClickAdd"
    />
  </div>
</template>
