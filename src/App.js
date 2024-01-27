import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Main from "./pages/Main";
import CursorCanvas from './pages/CursorCanvas';
import Room from './pages/Room';
import ProfilePage from './pages/Profile';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Hambugerbutton from './icons/Hambergerbutton';

function App() {
  return (
    <div>
      <Router>
      <div><Hambugerbutton /></div>
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
                <Link to="/profile">Profile Page</Link>
              </li>
              <li>
                <Link to="/signup">Sign up Page</Link>
              </li>
              <li>
                <Link to="/login">Login Page</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/canvas" element={<CursorCanvas />} />
            <Route path="/room" element={<Room />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

