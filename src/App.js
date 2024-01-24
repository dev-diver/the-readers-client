import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Hambugerbutton } from "./icons/Hambergerbutton";
import Main from "./pages/Main";
import ProfilePage from './Profile';
import JoinPage from './pages/Join';
import HashtagPage from './HashtagPage';

const App = () => {
  <div>
    <div><Hambugerbutton /></div>
    <Routes>
      <Route path="/" element = {<div> <Main /> </div>}></Route>
      <Route path="/profile" element={<div><ProfilePage /></div>}></Route>
      <Route path="/join" element={<div><JoinPage /></div>}></Route>
      <Route path="/hashtag" element={<div><HashtagPage /></div>}></Route>
    </Routes>

  </div>
}

// import React from 'react';
// import { BrowserRouter as Router, Route, Switch, BrowserRouter } from 'react-router-dom';
// import HomePage from './HomePage';
// import ProfilePage from './Profile';
// import JoinPage from './pages/Join';
// import HashtagPage from './HashtagPage';

// const App = () => {
//   return (
//     <Router>
//       <BrowserRouter>
//         <Route path="/profile" component={ProfilePage} />
//         <Route path="/join" component={JoinPage} />
//         <Route path="/hashtag" component={HashtagPage} />
//         <Route path="/" component={HomePage} />
//       </S>
//     </Router>
//   );
// };

// export default App;
