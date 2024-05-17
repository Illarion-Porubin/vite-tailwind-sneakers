<script setup>
import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import InfoBlock from './InfoBlock.vue'
import { computed, inject, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const { cart, closeDrawer } = inject('cart')

const isCreating = ref(false)
const orderId = ref(null)

const createOrder = async () => {
  try {
    isCreating.value = true
    const { data } = await axios.post(`https://c17d199de379e6bf.mokky.dev/orders`, {
      items: cart.value,
      tootalPrice: props.totalPrice
    })
    cart.value = []
    orderId.value = data.id
  } catch (error) {
    console.log(error)
  } finally {
    isCreating.value = false
  }
}

const cartIsEmpty = computed(() => cart.value.length === 0)
const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value)
</script>
<template>
  <div @click="closeDrawer" class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div class="flex h-full items-center" v-if="!totalPrice || orderId">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина"
        description="Добавьте хотя бы пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />

      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке.`"
        image-url="/order-success-icon.png"
      />    
    </div>

    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} руб</b>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }} руб</b>
        </div>

        <button
          :disabled="buttonDisabled"
          @click="createOrder"
          class="mt-4 transition cursor-pointer disabled:bg-slate-400 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-700"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
