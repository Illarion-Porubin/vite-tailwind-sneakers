<script setup>
import { computed, onMounted, provide, reactive, ref, watch } from 'vue'
import CardList from './components/CardList.vue'
import HeaderComp from './components/HeaderComp.vue'
import axios from 'axios'
import DriwerComp from './components/DrawerComp.vue'

const items = ref([])
const cart = ref([])
const isCreatingOrder = ref(false)

const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const cartIsEmpty = computed(() => cart.value.length === 0)

const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value);

// если используешь ref то обращася к value (sortBy.value)
// ref под капотом применяет реактивность и обычно используется для работы с массивами
// reactive используют с оычными объектами

const filters = reactive({
  sortBy: 'title',
  searchQuert: ''
})

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const createOrder = async () => {
  try {
    isCreatingOrder.value = true
    const { data } = await axios.post(`https://c17d199de379e6bf.mokky.dev/orders`, {
      items: cart.value,
      tootalPrice: totalPrice.value
    })
    cart.value = []

    return data
  } catch (error) {
    console.log(error);
  } finally {
    isCreatingOrder.value = false
  }
}

const onChangeSelect = (event) => {
  // будет следить за select
  filters.sortBy = event.target.value // по select обращаемся к event.target.value и передаем его в watch
}

const onChangeSearchInput = (event) => {
  // будет следить за input
  filters.searchQuert = event.target.value
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://c17d199de379e6bf.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

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

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id
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
onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
})


// onMounted(fetchItems)
watch(filters, fetchItems) // отслежвай filters и вызови fetchItems при изменении

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

watch(cart, () => {
  items.value = items.value.map(() => ({
    ...items,
    isAdded: false
  }))
}) 

const openDrawer = () => {
  drawerOpen.value = true
}

const closeDrawer = () => {
  console.log('object');
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
</script>

<template>
  <DriwerComp
    v-if="drawerOpen"
    :total-price="totalPrice"
    :vatPrice="vatPrice"
    @close-drawer="closeDrawer"
    @create-order="createOrder"
    :button-disabled="cartButtonDisabled"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl mt-14">
    <HeaderComp :total-price="totalPrice" @open-drawer="openDrawer" />

    <div class="p-10">
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
    </div>
  </div>
</template>
