import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Room from './pages/Room';
import CursorCanvas from './pages/CursorCanvas';
import { Hambugerbutton } from "./icons/Hambergerbutton";
import Main from "./pages/Main";
import ProfilePage from './Profile';
import JoinPage from './pages/Join';
import HashtagPage from './HashtagPage';

function App() {
  return (
    <div>
      <div><Hambugerbutton /></div>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/room">Room</Link>
              </li>
              <li>
                <Link to="/">Draw(Home)</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/room" element={<Room />} />
            <Route path="/" element={<CursorCanvas />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

