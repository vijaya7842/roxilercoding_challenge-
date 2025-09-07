import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import {BrowserRouter as Router , Route, Routes} from 'react-router-dom'
import Signup from './pages/Signup';
import Storeowner_landing from './pages/Storeowner_landing';
import Normaluser_landing from './pages/Normaluser_landing';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/storeowner_landing' element={<Storeowner_landing/>}/>
        <Route path='/normaluser_landing' element={<Normaluser_landing/>}/>
      </Routes>
    </Router> 
    
    </>
  );
}

export default App;
