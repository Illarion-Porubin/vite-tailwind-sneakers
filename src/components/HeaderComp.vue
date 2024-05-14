<script setup>
    const emit = defineEmits(['openDrawer']);

    defineProps({
        totalPrice: Number
    })

</script>

<template>
    <header class="flex justify-between border-b border-slate-200 px-10 py-8">
        <div class="flex items-center gap-4">
            <img class="w-10" src="/logo.png" alt="Logo">
            <div>
                <h2 class="text-xl font-bold uppercase">Vue sneakers</h2>
                <p class="text-slate-400">Магазин лучших кроссовок</p>
            </div>
        </div>

        <ul class="flex items-center gap-10">
            <li @click="() => emit('openDrawer')" class="flex items-center gap-3 text-slate-500 cursor-pointer hover:text-black">
                <img src="/cart.svg" alt="Cart">
                <span>{{ totalPrice }} руб</span>
            </li>

            <li class="flex items-center gap-3 text-slate-500 cursor-pointer hover:text-black">
                <img src="/heart.svg" alt="Cart">
                <span>Закладки</span>
            </li>

            <li class="flex items-center gap-3 text-slate-500 cursor-pointer hover:text-black">
                <img src="/heart.svg" alt="Cart">
                <span>Профиль</span>
            </li>
        </ul>
    </header>
</template>