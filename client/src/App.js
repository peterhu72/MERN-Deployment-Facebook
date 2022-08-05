import './App.css';
import SignIn from './components/SignIn';
import Menu from './components/Menu';
import Profile from './components/Profile';
import FriendProfile from './components/FriendProfile';
import NavBar from './components/NavBar';
import {
  BrowserRouter, 
  Route,
  Routes
} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <NavBar></NavBar>
        <Routes>
          <Route exact path="/" element={<SignIn></SignIn>}></Route> 
          
          <Route exact path="/menu" element={<Menu></Menu>}></Route>

          <Route exact path="/profile" element={<Profile></Profile>}></Route>

          <Route exact path ="/profile/:id" element={<FriendProfile></FriendProfile>}> </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
