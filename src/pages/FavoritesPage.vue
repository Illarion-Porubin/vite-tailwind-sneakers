<script setup>
import {ref, onMounted } from 'vue'
import axios from 'axios'

const favorites = ref([]);

onMounted(async () => {
    try {
        const { data } = await axios.get('https://c17d199de379e6bf.mokky.dev/favorites')
        console.log(data);
    } catch (error) {
        console.log(error)
    }
});

</script>


<template>
  <h1>favorite</h1>
</template>
