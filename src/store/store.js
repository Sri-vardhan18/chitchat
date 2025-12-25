import {configureStore} from '@reduxjs/toolkit'; 
import socketReducer from './socketReducer';

const store= configureStore({
    reducer: {
        socket : socketReducer,
    },
}); 

export default store;