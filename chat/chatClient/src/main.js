import { createApp } from 'vue'
import moment from 'moment'
// const cors = require('cors');

import App from './App.vue'


// let whitelist = []
const app = createApp(App)
// app.use(cors())
app.use(moment)
// app.use(cors({origin: 'http://localhost:3000',
// optionsSuccessStatus: 200 }));
// app.use(cors( ))
app.mount('#app')
