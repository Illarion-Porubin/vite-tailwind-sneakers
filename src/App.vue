<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import CardList from './components/CardList.vue'
import HeaderComp from './components/HeaderComp.vue'
import axios from 'axios'
// import DriwerComp from './components/DrawerComp.vue'

const items = ref([])

// если используешь ref то обращася к value (sortBy.value)
// ref под капотом применяет реактивность и обычно используется для работы с массивами
// reactive используют с оычными объектами

const filters = reactive({
  sortBy: 'title',
  searchQuert: ''
})

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

    items.value = items.value.map(item => {
      const favorite = favorites.find(favorite => favorite.id === item.id);

      if(!favorite){
        return item
      }

      return {
        ...item,
        isFavorite: true,
        
      }

    });
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
      isAdded: false
    }))
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => {
   await fetchItems();
   await fetchFavorites();
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
</script>

<template>
  <!-- <DriwerComp /> -->
  <div class="bg-white w-4/5 m-auto rounded-xl mt-14">
    <HeaderComp />

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
        <CardList :items="items" />
      </div>
    </div>
  </div>
</template>
