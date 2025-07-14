import { createRouter, createWebHistory } from 'vue-router'
import RecordAudio from '@/views/RecordAudio.vue'
import ConverstationChat from '@/views/ConverstationChat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'chat',
      component: ConverstationChat,
    },

    {
      path: '/record',
      name: 'record',
      component: RecordAudio,
    }

  ],
})

export default router
