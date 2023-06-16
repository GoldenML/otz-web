import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: defineAsyncComponent(() => import('../views/login.vue')),
        meta: {
            title: '登录页'
        }
    },
    {
        name: 'console',
        path: '/console',
        component: defineAsyncComponent(() => import('../views/console/index.vue')),
        meta: {
            title: '首页'
        },
        redirect: '/console/chats',
        children: [
            {
                name: 'chats',
                path: '/console/chats',
                component: defineAsyncComponent(() => import('../views/console/chats/index.vue')),
                meta: {
                    title: '聊天'
                },
                children: [
                    {
                        path: '/console/chats/:id',
                        component: defineAsyncComponent(() => import('../views/console/chats/chat-modal/index.vue')),
                    }
                ]
            },
            {
                name: 'contacts',
                path: '/console/contacts',
                component: defineAsyncComponent(() => import('../views/console/contacts/index.vue')),
                meta: {
                    title: '通讯录'
                },
            },
            {
                name: 'settings',
                path: '/console/settings',
                component: defineAsyncComponent(() => import('../views/console/settings/index.vue')),
                meta: {
                    title: '设置'
                },
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, from, next)=>{
    console.log(to, from, next)
    if (to.meta.title) {
        document.title = `${to.meta.title}`;
    }
    next()
})
export default router
