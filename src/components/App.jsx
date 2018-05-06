import React, { Component } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { auth } from '../firebase';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';

import { withStyles } from 'material-ui/styles';

import PrivateRoute from './PrivateRoute';
import Main from './Main';
import Login from './Login';
import Signup from './Signup';
import Forgot from './Forgot'

import Profile from './Profile';
import ChangePassword from './ChangePassword';

const theme = createMuiTheme();

const styles = theme => ({
    
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
});

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            authenticated: false,
            currentUser: null,
            anchorEl :null };
        }

    componentWillMount() { 
        auth.onAuthStateChanged(user => {
        if (user) {
            console.log(user);
            auth.currentUser.reload();
            this.setState({
                authenticated: true,
                currentUser: user,
                loading: false },
                () => { this.props.history.push('/') }
            );
            
        } else {
            this.setState({
                authenticated: false,
                currentUser: null,
                loading: false
            });
        }
        });
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render () {
        const { authenticated, loading, anchorEl } = this.state;
        const classes = this.props.classes;
        const open = Boolean(anchorEl);

        const content = loading ? (
            <div align="center">
                <CircularProgress size={80} thickness={5} />
            </div>
        ) : (
            <div>
                <PrivateRoute
                    exact
                    path="/"
                    component={Main}
                    authenticated={authenticated}
                    />
                
                <PrivateRoute
                    exact
                    path="/profile"
                    component={Profile}
                    authenticated={authenticated}
                    />
                
                <PrivateRoute
                    exact
                    path="/changePwd"
                    component={ChangePassword}
                    authenticated={authenticated}
                    />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/forgot" component={Forgot} />

            
                
            </div>
        );
        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography 
                                variant="title" 
                                color="inherit" 
                                className={classes.flex}>
                            Simple Note
                            </Typography>
                            {authenticated && (
                            <div>
                                Hi, {auth.currentUser.email}
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                                >

                                <MenuItem 
                                    onClick={this.handleClose}
                                    component={Link} to="/"
                                >Notes</MenuItem>
                                <MenuItem 
                                    onClick={this.handleClose}
                                    component={Link} to="/profile"
                                >Profile</MenuItem>
                                <MenuItem 
                                    onClick={this.handleClose}
                                    component={Link} to="/changePwd"    
                                >Change Password</MenuItem>
                                
                                <MenuItem onClick={()=>auth.signOut()}>Logout</MenuItem>
                                </Menu>
                            </div>
                            )}
                        </Toolbar>
                    </AppBar>
                    { content }
                </div>
            </MuiThemeProvider>
         );
    }
}

export default withRouter(withStyles(styles)(App))