import React from 'react';
import { BrowserRouter, Switch, NavLink } from 'react-router-dom';
import './css/style.css';
import Login from './pages/Login';
import Disk from './pages/Disk';
import PrivateRoute from './components/DiskRoute';
import PublicRoute from './components/LoginRoute';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <PublicRoute path={["/", "/login"]} component={Login} exact />
                <PrivateRoute path={["/disk", "/user", "/admin"]} component={Disk} />
            </Switch>
        </BrowserRouter>
    );
};

export default App;
