<script setup>
defineProps({
    imageUrl: String,
    title: String,
    price: Number,
})
</script>

<template>
    <div
        class="border bg-white border-slate-100 rounded-3xl p-8 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition">
        <img class="absolute top-8 left-8" src="/like-1.svg" alt="like-1" />
        <img :src="imageUrl" alt="Sneaker">
        <p class="mt-2">{{ title }}</p>
        <div class="flex justify-between mt-5">
            <div class="flex flex-col">
                <span class="text-slade-400">Цена</span>
                <b>{{ price }} руб.</b>
            </div>
            <img src="/plus.svg" alt="Plus" />
        </div>
    </div>
</template>