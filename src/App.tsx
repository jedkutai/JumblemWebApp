import ContentView from './ContentView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeRoute from './RouteControllers/Root/HomeRoute';
import CasualGameRoute from './RouteControllers/Versus/CasualGameRoute';
import LoginRoute from './RouteControllers/Login/LoginRoute';
import CreateAccountRoute from './RouteControllers/Login/CreateAccountRoute';
import RatedGameRoute from './RouteControllers/Versus/RatedGameRoute';
import PrivateGameRoute from './RouteControllers/Versus/PrivateGameRoute';
import DailyPuzzleRoute from './RouteControllers/Training/DailyPuzzleRoute';
import HowToDailyPuzzleRoute from './RouteControllers/HowTo/HowToDailyPuzzleRoute';
import HowToVersusRoute from './RouteControllers/HowTo/HowToVersusRoute';
import ProfileRoute from './RouteControllers/Root/ProfileRoute';
import PeopleRoute from './RouteControllers/More/PeopleRoute';
import FindPeopleRoute from './RouteControllers/More/FindPeopleRoute';
import SpecificPlayerRoute from './RouteControllers/OpenSpecific/SpecificPlayerRoute';
import SpecificGameRoute from './RouteControllers/OpenSpecific/SpecificGameRoute';
import SpecificWordRoute from './RouteControllers/OpenSpecific/SpecificWordRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Root
        <Route path="/" element={<ContentView/>} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        

        // Login
        <Route path="/login" element={<LoginRoute/>}/>
        <Route path="/createaccount" element={<CreateAccountRoute/>}/>

        // Versus
        <Route path="/casual" element={<CasualGameRoute/> }/>
        <Route path="/rated" element={<RatedGameRoute/> }/>
        <Route path="/private" element={<PrivateGameRoute/> }/>

        // Training
        <Route path="/dailypuzzle" element={<DailyPuzzleRoute/>}/>

        // How to
        <Route path="/howto/dailypuzzle" element={<HowToDailyPuzzleRoute/>}/>
        <Route path="/howto/versus" element={<HowToVersusRoute/>}/>

        // more
        <Route path="/people" element={<PeopleRoute/>}/>
        <Route path="/findpeople" element={<FindPeopleRoute/>}/>

        // open specific
        <Route path="/people/:username" element={<SpecificPlayerRoute/>}/>
        <Route path="/games/:gameId" element={<SpecificGameRoute/>}/>
        <Route path="/dictionary/:word" element={<SpecificWordRoute/>}/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;