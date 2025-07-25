// router.ts
import { createRouter,createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue'
import Preview from '@/components/Preview.vue';
import Manual from './components/Manual.vue';
 
const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/Preview', name: 'preview', component: Preview },
    { path: '/Manual', name: 'manual', component: Manual },
]
 
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // HTML5 History モード
    routes,
})
 
export default router;