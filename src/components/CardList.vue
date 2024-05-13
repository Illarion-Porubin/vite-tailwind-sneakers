<script setup>
import { inject } from 'vue';
import CardComp from './CardComp.vue'

defineProps({
  items: Array
})


// const emit = defineEmits(['addToFavorite']); /// можно прокинуть функцию и через пропсы, но есть соглашение, что функции прокидываются через эмиты, а флажки,чекиты, примитивы через пропсы.

// const onClickAdd = () => {
//   emit('addTofavorite');
// }

// :on-click-favorite="() => $emit('addToFavorite', item)" //в CardComp


const addToFavorite = inject('addToFavorite')/// при пропс дрилинги юзай inject (аналог контекста в react), здесь показана возможность как это сделать

</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardComp
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :price="item.price"
      :image-url="item.imageUrl"
      :title="item.title"
      :isAdded="true"
      :on-click-favorite="() => addToFavorite(item)"
      :isFavorite="item.isFavorite"
    />
  </div>
</template>
