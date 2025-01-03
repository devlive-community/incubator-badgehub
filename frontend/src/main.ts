import { createApp } from 'vue'
// @ts-ignore
import ViewShadcnUI from 'view-shadcn-ui'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ViewShadcnUI)
app.use(router)
app.mount('#app')