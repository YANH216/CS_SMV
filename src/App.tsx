import { Route, Routes } from 'react-router-dom';
import Counter from './features/counter/Counter';
import Home from './features/home/Home';
import Chat from './features/chat/Chat';
import Three from './pages/three';
import Gsap from './pages/gsap';
import MeshStandardMaterial from './pages/meshStandardMaterial';
import LightAndShadow from './pages/lightAndShadow/LightShadow';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element= { <Home/> } />
        <Route path='/chat' element= { <Chat/> }/>
        <Route path='/three' element= { <Three/> }/>
        <Route path='/gsap' element= { <Gsap/> }/>
        <Route path='/meshStandardMaterial' element= { <MeshStandardMaterial/> }/>
        <Route path='/lightAndShadow' element= { <LightAndShadow/> }/>
      </Routes>
    </div>
  );
}

export default App;
