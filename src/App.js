import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hambugerbutton from "icons/Hambergerbutton";
import Main from "pages/Main";
import Room from "pages/Room";
import ProfilePage from './pages/Profile';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Highlights from "./pages/Highlights";

function App() {
  return (
    <div>
      <Router>
        <div>
          <Hambugerbutton />
        </div>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Main</Link>
              </li>
              <li>
                <Link to="/room">Room</Link>
              </li>
              <li>
                <Link to="/highlights">Highlights</Link>
              </li>
              <li>
                <Link to="/login">Login Page</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/room/:id" element={<Room />} />
            <Route path="/highlights" element={<Highlights />} />
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
