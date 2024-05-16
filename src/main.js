import './assets/main.css'
import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import FavoritesPage from './pages/FavoritesPage.vue'
import HomePage from './pages/HomePage.vue'

const app = createApp(App)
const routes = [
    { path: '/', component: HomePage },
    { path: '/favorites', component: FavoritesPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

app.use(autoAnimatePlugin)
app.use(router)

app.mount('#app')
