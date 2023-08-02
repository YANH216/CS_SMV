import { Route, Routes, Navigate } from 'react-router-dom';
import Counter from './features/counter/Counter';
import Home from './features/home/Home';
import Three from './pages/three';
import Gsap from './pages/gsap';
import MeshStandardMaterial from './pages/meshStandardMaterial';
import LightAndShadow from './pages/lightAndShadow/LightShadow';
import HDR from './pages/hdr/HDR';
import Room from './pages/room/Room';
import SkyWater from './pages/skyAndWater/SkyWater';
import MeshPhongMaterial from './pages/meshPhongMaterial';
import Car from './pages/car';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element= { <Navigate to='/home'/> } />
        <Route path='/home/*' element= { <Home/> } />
        <Route path='/three' element= { <Three/> }/>
        <Route path='/gsap' element= { <Gsap/> }/>
        <Route path='/meshStandardMaterial' element= { <MeshStandardMaterial/> }/>
        <Route path='/lightAndShadow' element= { <LightAndShadow/> }/>
        <Route path='/hdr' element= { <HDR/> }/>
        <Route path='/room' element= { <Room/> }/>
        <Route path='/skyAndWater' element= { <SkyWater/> }/>
        <Route path='/meshPhongMaterial' element= { <MeshPhongMaterial/> }/>
        <Route path='/car' element= { <Car/> }/>
      </Routes>
    </div>
  );
}

export default App;
