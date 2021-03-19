import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuthCheck from './hooks/useAuthCheck';
import useChatsSync from './hooks/useChatsSync';
import ROUTES from './constants/routes';
import NavigationContextProvider from './contexts/NavigationContextProvider';
import LogoutModalContextProvider from './contexts/LogoutModalContextProvider';
import Navigation from './components/Navigation/index';
import LogoutModal from './components/LogoutModal/index';
import ProtectedRoute from './components/ProtectedRoute/index';
import Signup from './components/Signup/index';
import Login from './components/Login/index';
import SearchResults from './components/SearchResults/index';
import Profile from './components/Profile/index';
import Settings from './components/Settings/index';
import Messages from './components/Messages/index';
import Home from './components/Home/index';
import NotFound from './components/NotFound/index';
import GlobalStyle from './styles/globalStyle';

function App() {
    useAuthCheck();
    useChatsSync();

    return (
        <>
            <Router>
                <NavigationContextProvider>
                    <LogoutModalContextProvider>
                        <Navigation />
                        <LogoutModal />
                    </LogoutModalContextProvider>
                </NavigationContextProvider>
                <Switch>
                    <Route path={ROUTES.signup} exact>
                        <Signup />
                    </Route>
                    <Route path={ROUTES.login} exact>
                        <Login />
                    </Route>
                    <Route path={ROUTES.search} exact>
                        <SearchResults />
                    </Route>
                    <Route path={ROUTES.profile} exact>
                        <Profile />
                    </Route>
                    <ProtectedRoute path={ROUTES.settings} exact>
                        <Settings />
                    </ProtectedRoute>
                    <ProtectedRoute path={ROUTES.messages}>
                        <Messages />
                    </ProtectedRoute>
                    <Route path={ROUTES.home} exact>
                        <Home />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
            <GlobalStyle />
        </>
    );
}

export default App;
