<script setup>
import CardComp from './CardComp.vue';
</script>

<template>
    <div class="p-10">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

        <div class="grid grid-cols-4 gap-5">
            <CardComp :price="5000" image-url="/sneakers/sneakers-1.jpg"
                title="Мужские Кроссовки Nike Blazer Mid Suede" />
            <CardComp />
            <CardComp />
            <CardComp />
            <CardComp />
        </div>
    </div>
</template>