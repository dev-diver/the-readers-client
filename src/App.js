import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Room from './pages/Room';
import CursorCanvas from './pages/CursorCanvas';
import Highlights from './pages/Highlights';

function App() {
  return (
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
            <li>
              <Link to="/highlights">Highlights</Link>
            </li>
          </ul>
        </nav>

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/room" element={<Room />} />
          <Route path="/" element={<CursorCanvas />} />
          <Route path="/highlights" element={<Highlights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
