import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFoundView from './App/Components/PageNotFoundView';
import DailyPuzzleCrashCourse2 from './App/General/CrashCourses/DailyPuzzle/DailyPuzzleCrashCourse2';
import VersusCrashCourse2 from './App/General/CrashCourses/Versus/VersusCrashCourse2';
import PrivacyPolicy from './App/General/PrivacyPolicy';
import TermsAndConditions from './App/General/TermsAndConditions';
import ContentView from './ContentView';
import CreateAccountRoute from './RouteControllers/Login/CreateAccountRoute';
import LoginRoute from './RouteControllers/Login/LoginRoute';
import FindPeopleRoute from './RouteControllers/More/FindPeopleRoute';
import MoreRoute from './RouteControllers/More/MoreRoute';
import PeopleRoute from './RouteControllers/More/PeopleRoute';
import SpecificGameRoute from './RouteControllers/OpenSpecific/SpecificGameRoute';
import SpecificPlayerRoute from './RouteControllers/OpenSpecific/SpecificPlayerRoute';
import SpecificWordRoute from './RouteControllers/OpenSpecific/SpecificWordRoute';
import HomeRoute from './RouteControllers/Root/HomeRoute';
import ProfileRoute from './RouteControllers/Root/ProfileRoute';
import ChangeUsernameRoute from './RouteControllers/Settings/ChangeUsernameRoute';
import DeleteAccountRoute from './RouteControllers/Settings/DeleteAccountRoute';
import SettingsRoute from './RouteControllers/Settings/SettingsRoute';
import DailyPuzzleRoute from './RouteControllers/Training/DailyPuzzleRoute';
import CasualGameRoute from './RouteControllers/Versus/CasualGameRoute';
import PrivateGameRoute from './RouteControllers/Versus/PrivateGameRoute';
import RatedGameRoute from './RouteControllers/Versus/RatedGameRoute';


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
        <Route path="howto/dailypuzzle" element={<DailyPuzzleCrashCourse2/>}/>
        <Route path="howto/versus" element={<VersusCrashCourse2/>}/>

        // more
        <Route path="/people" element={<PeopleRoute/>}/>
        <Route path="/findpeople" element={<FindPeopleRoute/>}/>
        <Route path="/more" element={<MoreRoute/>}/>

        // open specific
        <Route path="/people/:username" element={<SpecificPlayerRoute/>}/>
        <Route path="/games/:gameId" element={<SpecificGameRoute/>}/>
        <Route path="/dictionary/:word" element={<SpecificWordRoute/>}/>
        
        // Settings
        <Route path="/settings" element={<SettingsRoute />} />
        <Route path="/settings/deleteaccount" element={<DeleteAccountRoute />} />
        <Route path="/settings/changeusername" element={<ChangeUsernameRoute />} />

        // General
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />

        <Route path="*" element={<PageNotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;