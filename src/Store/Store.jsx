import {configureStore} from '@reduxjs/toolkit'
import cartslice from '../features/CartSlice'
const store=configureStore({
    reducer:{
        cart:cartslice.reducer
    }
})
export default store;