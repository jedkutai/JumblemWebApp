import ContentView from './ContentView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeRoute from './RouteControllers/Root/HomeRoute';
import CasualGameRoute from './RouteControllers/Versus/CasualGameRoute';
import LoginRoute from './RouteControllers/Login/LoginRoute';
import CreateAccountRoute from './RouteControllers/Login/CreateAccountRoute';
import RatedGameRoute from './RouteControllers/Versus/RatedGameRoute';
import PrivateGameRoute from './RouteControllers/Versus/PrivateGameRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        // root
        <Route path="/" element={<ContentView/>} />
        <Route path="/home" element={<HomeRoute />} />

        // Login
        <Route path="/login" element={<LoginRoute/>}/>
        <Route path="/createaccount" element={<CreateAccountRoute/>}/>

        // versus
        <Route path="/casual" element={<CasualGameRoute/> }/>
        <Route path="/rated" element={<RatedGameRoute/> }/>
        <Route path="/private" element={<PrivateGameRoute/> }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;