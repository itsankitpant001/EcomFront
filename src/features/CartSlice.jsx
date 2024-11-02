import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
    cart:[],
    loading:false,
    error:''
}
export const fetchCartData=createAsyncThunk("cart/fetchCartData", async (userId)=>{
  return await  axios.get(`https://ecomback-1dms.onrender.com/getcartdata/${userId}`).then((success)=>{
        return success.data.cart
    })
})

const cartslice=createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{
        
        addToCart:(state,action)=>{
            const cartItem=action.payload
            console.log(cartItem)
           
        const item=state.cart.find(e=>e._id==cartItem._id) 
        if(item){
            console.log(state.cart)
        }
        else{
            state.cart.push(cartItem)
        }
        },
        clearCart:(state,action)=>{
            state.cart=[]
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCartData.pending,(state,action)=>{
            state.loading=true
        }),
        builder.addCase(fetchCartData.fulfilled,(state,action)=>{
            state.cart=action.payload
        }),
        builder.addCase(fetchCartData.rejected,(state,action)=>{
            state.error=action.payload
        })
        
    }
})
export default cartslice