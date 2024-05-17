<script setup>
import axios from 'axios'
import { computed, provide, ref, watch } from 'vue'
import HeaderComp from './components/HeaderComp.vue'
import DriwerComp from './components/DrawerComp.vue'

/* Корзина */
const cart = ref([])


const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))



// если используешь ref то обращася к value (sortBy.value)
// ref под капотом применяет реактивность и обычно используется для работы с массивами
// reactive используют с оычными объектами

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}



watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        item_id: item.id
      }
      item.isFavorite = true
      const { data } = await axios.post(`https://c17d199de379e6bf.mokky.dev/favorites`, obj)
      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://c17d199de379e6bf.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }
  } catch (error) {
    console.log(error)
  }
}

/* Корзина(END) */

// watch(filters, async () => {
//   //watch будет следить за sortBy и в случае изменения будет передавать новое занчение в поиск
//   try {
//     const { data } = await axios.get(
//       'https://c17d199de379e6bf.mokky.dev/items?sortBy=' + filters.sortBy
//     )
//     items.value = data
//   } catch (e) {
//     console.log(e)
//   }
// })

/// v-if="drawerOpen" будет отображать компонент если true

const openDrawer = () => {
  drawerOpen.value = true
}

const closeDrawer = () => {
  drawerOpen.value = false
}

provide('addToFavorite', addToFavorite)
provide('addToCart', addToCart)
provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart
})

//можно передаввать в пропсы
// @close-drawer="closeDrawer"
</script>

<template>
  <DriwerComp
    v-if="drawerOpen"
    :total-price="totalPrice"
    :vatPrice="vatPrice"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl mt-14">
    <HeaderComp :total-price="totalPrice" @open-drawer="openDrawer" />

    <div class="p-10">
      <RouterView />
    </div>
  </div>
</template>
