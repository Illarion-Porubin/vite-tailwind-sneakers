<script setup>
import CardList from '../components/CardList.vue'
import { inject, reactive, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce';

const {cart, addToCart, removeFromCart} = inject('cart');

const items = ref([])

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const filters = reactive({
  sortBy: 'title',
  searchQuert: ''
})

const onChangeSelect = (event) => {
  // будет следить за select
  filters.sortBy = event.target.value // по select обращаемся к event.target.value и передаем его в watch
}

const onChangeSearchInput = debounce((event) => {
  // будет следить за input
  filters.searchQuert = event.target.value
}, 400)

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://c17d199de379e6bf.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
      // searchQuert: filters.searchQuert
    }

    if (filters.searchQuert) {
      params.title = `*${filters.searchQuert}*`
    }

    const { data } = await axios.get(`https://c17d199de379e6bf.mokky.dev/items`, {
      params
    })
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }))
  } catch (e) {
    console.log(e)
  }
}
// onMounted(fetchItems)
onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})


watch(filters, fetchItems) // отслежвай filters и вызови fetchItems при изменении



watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})



</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевле)</option>
        <option value="-price">По цене (дороже)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" alt="search" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="">
    <CardList :items="items" @add-to-cart="onClickAddPlus" />
  </div>
</template>
