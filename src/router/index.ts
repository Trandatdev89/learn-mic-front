import { createRouter, createWebHistory } from 'vue-router'
import RecordAudio from '@/views/RecordAudio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'record',
      component: RecordAudio,
    }

  ],
})

export default router
