import { Route, Routes } from 'react-router-dom';
import Counter from './features/counter/Counter';
import Home from './features/home/Home';
import Chat from './features/chat/Chat';
import Three from './three';
import Gsap from './gsap';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element= { <Home/> } />
        <Route path='/chat' element= { <Chat/> }/>
        <Route path='/three' element= { <Three/> }/>
        <Route path='/gsap' element= { <Gsap/> }/>
      </Routes>
    </div>
  );
}

export default App;
