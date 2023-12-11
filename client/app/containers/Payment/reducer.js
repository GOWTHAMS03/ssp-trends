import { NEW_PAYMENT} from './constants';


const initialState = {
    payment:[],
    isLoading: false,
}

const paymentReducer = (state=initialState,action) =>{

    switch(action.type){
        case NEW_PAYMENT:
            return{
                ...state,
                payment:action.payment,
            }
default:
    return state;
}
}

export default paymentReducer;