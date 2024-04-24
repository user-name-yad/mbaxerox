import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import GeneralUser from './GeneralUser';
import Notfound from './Notfound';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='generaluser' element={<GeneralUser/>}/>
      <Route path='*' element={<Notfound/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
