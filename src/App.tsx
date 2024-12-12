import ContentView from './ContentView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeRoute from './RouteControllers/Root/HomeRoute';
import CasualGameRoute from './RouteControllers/Versus/CasualGameRoute';
import LoginRoute from './RouteControllers/Login/LoginRoute';
import CreateAccountRoute from './RouteControllers/Login/CreateAccountRoute';
import RatedGameRoute from './RouteControllers/Versus/RatedGameRoute';
import PrivateGameRoute from './RouteControllers/Versus/PrivateGameRoute';
import DailyPuzzleRoute from './RouteControllers/Training/DailyPuzzleRoute';
import WordTrainerRoute from './RouteControllers/Training/WordTrainerRoute';
import HowToDailyPuzzleRoute from './RouteControllers/HowTo/HowToDailyPuzzleRoute';
import HowToVersusRoute from './RouteControllers/HowTo/HowToVersusRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Root
        <Route path="/" element={<ContentView/>} />
        <Route path="/home" element={<HomeRoute />} />

        // Login
        <Route path="/login" element={<LoginRoute/>}/>
        <Route path="/createaccount" element={<CreateAccountRoute/>}/>

        // Versus
        <Route path="/casual" element={<CasualGameRoute/> }/>
        <Route path="/rated" element={<RatedGameRoute/> }/>
        <Route path="/private" element={<PrivateGameRoute/> }/>

        // Training
        <Route path="/dailypuzzle" element={<DailyPuzzleRoute/>}/>
        <Route path="/wordtrainer" element={<WordTrainerRoute/>}/>

        // How to
        <Route path="/howto/dailypuzzle" element={<HowToDailyPuzzleRoute/>}/>
        <Route path="/howto/versus" element={<HowToVersusRoute/>}/>

        // user (profile and following page)

      </Routes>
    </BrowserRouter>
  );
}

export default App;