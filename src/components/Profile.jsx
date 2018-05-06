import React, { Component } from 'react';
import { auth } from '../firebase';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        margin : theme.spacing.unit,
        padding: theme.spacing.unit * 2,
        color: theme.palette.text.secondary,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    list: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        maxWidth: 360,
        maxHeight: 200,
        overflow: 'auto',
    },
    margin : {
        margin : theme.spacing.unit,
    }

});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            new_name : "",
            new_email : ""
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendVerify = this.sendVerify.bind(this);
        this.updateProfile = this.updateProfile.bind(this)
    }


    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    sendVerify(){
        auth.currentUser.sendEmailVerification();
        alert("The verification email is sent. Please check your email");
    }

    updateProfile(e){


        e.preventDefault();

        const {new_name, new_email} = this.state;
        if(new_name !== ""){
            auth.currentUser.updateProfile({
                displayName : new_name,
            })
            .then(function(msg) {
                // Update successful.
                alert('You change your display name to '+new_name +'. Please refresh the page to update the display. ');

              }).catch(function(error) {
                // An error happened.
                alert(error)
                console.log(error);
              });
        }
        if(new_email!== ""){
            auth.currentUser.updateEmail(new_email)
            .then(function(msg) {
                // Update successful.

                alert('You change your email to '+new_email+'. Please refresh the page to update the display. ');
            
              }).catch(function(error) {
                // An error happened.
                console.log(error);
                alert(error)
              });
        }
    }

    render() {
        const classes = this.props.classes;
        const {new_name, new_email} = this.state;
        return (
            <div>
            <Grid container className={classes.container}>
                <Grid item xs></Grid>
                 <Grid item xs={12} sm={4}>
                     <Paper className={classes.paper}>
                      
                         <h1>Your Profile</h1>
                         <Divider/>

                         <Avatar src={ auth.currentUser.photoURL} className={classes.margin}/>

                         <p>Name : {auth.currentUser.displayName}</p>
                        
                         <p>Email: { auth.currentUser.email}</p>
                         <p>Verified: {auth.currentUser.emailVerifiedd ? "true" :"false"}</p>
                         <Button 
                            variant="raised" 
                            color="secondary" 
                            type="submit"
                            onClick={()=>this.sendVerify()}
                        >
                            Resend verification
                        </Button>
                            
                    </Paper>
                </Grid>

                <Grid item xs></Grid>

            </Grid>
                <Grid container className={classes.container}>

                <Grid item xs></Grid>
                 <Grid item xs={12} sm={4}>
                     <Paper className={classes.paper}>
                      
                         <h1>Update Profile</h1>
                         <Divider/>
                            

                        <form onSubmit={this.updateProfile} autoComplete="off">
                        <TextField
                              id="new_name"
                              label="New Name"
                              className={classes.textField}
                              value={new_name}
                              onChange={this.handleChange('new_name')}
                              margin="normal"
                              type="text"
                            />
                            <br />
                            <TextField
                              id="new_email"
                              label="New Email"
                              className={classes.textField}
                              value={new_email}
                              onChange={this.handleChange('new_email')}
                              margin="normal"
                              type="email"
                            />
                            <br/>
                            <Button variant="raised" color="primary" type="submit">Update</Button>
                        </form>

                    </Paper>

                 </Grid>

                <Grid item xs></Grid>

            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Profile);
