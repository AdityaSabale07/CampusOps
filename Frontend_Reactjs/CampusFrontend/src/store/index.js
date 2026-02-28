import { combineReducers, createStore } from 'redux'
import cartitemsreducer from './cartitemsreducer'
import reducer from './reducer'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


//const store=createStore(reducer)
//export default store;

const combreducer=combineReducers({loggedin:reducer,cart:cartitemsreducer});
const store=createStore(combreducer)
export default store;

