import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hambugerbutton from "icons/Hambergerbutton";
import Main from "pages/Main";
import CursorCanvas from "pages/CursorCanvas";
import Room from "pages/Room";
import ProfilePage from "pages/Profile";
import SignupPage from "./pages/Signup";
// import HashtagPage from './HashtagPage';

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
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/room/:id" element={<Room />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
