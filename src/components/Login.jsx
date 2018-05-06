import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth, fbProvider, ggProvider } from '../firebase';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Divider } from 'material-ui';

const styles = theme => ({
  
    button: {
        margin: theme.spacing.unit,
        textAlign : 'center',
        width : '255px',
      },

    paper: {
        margin : theme.spacing.unit,
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    margin : {
        margin : theme.spacing.unit,
    }
});

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            forgot_password_email : "",
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signInWithFB = this.signInWithFB.bind(this);
        this.signInWithGoogle =  this.signInWithGoogle.bind(this);
        this.sendReset = this.sendReset.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
        auth.signInWithEmailAndPassword(email, password)
        .then(authUser => {
        })
        .catch(authError => {
            alert(authError);
        })
        
    }

    signInWithFB(event){
        auth.signInWithPopup(fbProvider).then(function(result) {
            
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            alert(errorMessage);
          });
    }

    signInWithGoogle(event){
        auth.signInWithPopup(ggProvider).then(function(result) {

          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            alert(errorMessage);
          });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    sendReset(e){
        e.preventDefault();
        alert("hi");
        const { forgot_password_email} = this.state
        auth.sendPasswordResetEmail(forgot_password_email)
        .then(function(msg) {
            // Update successful.
            console.log(msg)
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          });
    }

    render() {
        const { email, password} = this.state;
        const classes = this.props.classes;
        return (
            <Grid container>
                <Grid item xs></Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <h1>Log in</h1>
                        <Divider/>
                        <form onSubmit={this.onSubmit} autoComplete="off">
                            <TextField
                              id="email"
                              label="Email"
                              className={classes.textField}
                              value={email}
                              onChange={this.handleChange('email')}
                              margin="normal"
                              type="email"
                            />
                            <br />
                            <TextField
                              id="password"
                              label="Password"
                              className={classes.textField}
                              value={password}
                              onChange={this.handleChange('password')}
                              margin="normal"
                              type="password"
                            />
                            <br />
                            <Button variant="raised" color="primary" type="submit">Log in</Button>                                
                            
                        </form>
                        <p className={classes.margin}>

                            <Link to="/forgot">Forgot Password?</Link>
                        </p>
                            
                        <p className={classes.margin}>
                            OR
                        </p>
                        <Divider/>
                        <Button 
                            variant="raised" 
                            color="primary" 
                            type="submit" 
                            onClick={this.signInWithFB}
                            className={classes.button}
                            >Log in with Facebook</Button>
                        <br/>
                        <Button 
                            variant="raised" 
                            color="secondary" 
                            type="submit" 
                            onClick={this.signInWithGoogle}
                            className={classes.button}
                            >Log in with Google</Button>
                        

                        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                        
                    </Paper>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Login);
