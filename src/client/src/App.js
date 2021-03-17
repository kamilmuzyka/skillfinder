import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import ROUTES from './constants/routes';
import NavigationContextProvider from './contexts/NavigationContextProvider';
import Navigation from './components/Navigation/index';
import ProtectedRoute from './components/ProtectedRoute/index';
import Signup from './components/Signup/index';
import Login from './components/Login/index';
import SearchResults from './components/SearchResults/index';
import Profile from './components/Profile/index';
import Settings from './components/Settings/index';
import Chat from './components/Chat/index';
import Messages from './components/Messages/index';
import Home from './components/Home/index';
import Page404 from './components/Page404/index';
import GlobalStyle from './styles/globalStyle';

function App() {
    useAuth();

    return (
        <>
            <Router>
                <NavigationContextProvider>
                    <Navigation />
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
                    <ProtectedRoute path={ROUTES.chat} exact>
                        <Chat />
                    </ProtectedRoute>
                    <ProtectedRoute path={ROUTES.messages} exact>
                        <Messages />
                    </ProtectedRoute>
                    <Route path={ROUTES.home} exact>
                        <Home />
                    </Route>
                    <Route>
                        <Page404 />
                    </Route>
                </Switch>
            </Router>
            <GlobalStyle />
        </>
    );
}

export default App;
