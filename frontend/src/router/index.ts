import { createRouter, createWebHistory } from 'vue-router'
import LayoutContainer from '../views/layouts/LayoutContainer.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LayoutContainer,
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/pages/Home.vue')
            }
        ]
    },
    {
        path: '/badge',
        name: 'badge',
        component: LayoutContainer,
        children: [
            {
                path: 'static',
                name: 'static',
                component: () => import('@/views/pages/badge/Static.vue')
            },
            {
                path: 'github',
                name: 'github',
                component: () => import('@/views/pages/badge/Github.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router