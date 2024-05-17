<script setup>

const props = defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function
})

const visibleFavorite = Boolean(props.onClickAdd)

</script>


<template>
  <div
    class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
  >
    <img
      v-if="onClickFavorite"
      :src="isFavorite ? `/like-1.svg` : `/like-2.svg`"
      alt="like-1"
      class="absolute top-8 left-8"
      @click="onClickFavorite"
    />

    <img :src="imageUrl" alt="Sneaker" />
    <p class="mt-2">{{ title }}</p>
    <div class="flex justify-between mt-5">
      <div class="flex flex-col">
        <span class="text-slade-400">Цена</span>
        <b>{{ price }} руб.</b>
      </div>
      <img v-if="onClickFavorite" @click="onClickAdd" :src="isAdded ? `/checked.svg` : `/plus.svg`" alt="Plus" />
    </div>
  </div>
</template>
