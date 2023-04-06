import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
// import AddProductScreen from './Screens/AddProductScreen/AddProductScreen';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import SignInScreen from './Screens/SignInScreen/SignInScreen';
import SignUpScreen from './Screens/SignUpScreen/SignUpScreen';
import AddProductScreen from './Screens/AddProductScreen/AddProductScreen';
import SearchOrderScreen from './Screens/SearchOrderScreen/SearchOrderScreen';
import ProductsScreen from './Screens/ProductsScreen/ProductsScreen';
import EditScreen from './Screens/EditScreen/EditScreen';

function App() {
  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' exact element={<HomeScreen />}/>
      <Route path='/addproduct' element={<AddProductScreen />}/>
      <Route path='/searchorder' element={<SearchOrderScreen />}/>
      <Route path='/editproduct/:id' element={<EditScreen />}/>
      <Route path='/productstocks' element={<ProductsScreen />} />
      <Route path='/signin' element={<SignInScreen />} />
      <Route path='/signup' element={<SignUpScreen />}/>
    </Routes>


    </BrowserRouter>
  );
}

export default App;
