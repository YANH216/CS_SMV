import { Route, Routes } from 'react-router-dom';
import Counter from './features/counter/Counter';
import Home from './features/home/Home';
import Chat from './features/chat/Chat';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element= { <Home/> } />
        <Route path='/chat' element= { <Chat/> }/>
      </Routes>
    </div>
  );
}

export default App;
