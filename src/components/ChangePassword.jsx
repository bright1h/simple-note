import React, { Component } from 'react';
import { auth } from '../firebase';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Divider } from 'material-ui';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {

        margin: theme.spacing.unit ,
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
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

});

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            new_pwd : "",
            new_cpwd : "",
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    updatePassword(e){
        e.preventDefault();
        const {new_pwd,new_cpwd} = this.state;

        if(new_pwd!=="" &&new_pwd === new_cpwd){
            auth.currentUser.updatePassword(new_pwd)
            .then(function(msg) {
                // Update successful.
                console.log(msg)
              }).catch(function(error) {
                // An error happened.
                console.log(error);
              });
        }
        else{
            alert("confirmed password is not match");
        }
    
    }
    render() {
        const classes = this.props.classes;
        const { new_pwd, new_cpwd} = this.state;
        return (
            
            <Grid container className={classes.container}>
                
                <Grid item xs></Grid>
                <Grid item  xs={12} sm={3}>
                    <Paper className={classes.paper}>
                    
                        <h1>Change Password</h1>
                        <Divider/>
                        <form onSubmit={this.updatePassword} autoComplete="off">
                        
                            <TextField
                              id="new_pwd"
                              label="New Password"
                              className={classes.textField}
                              value={new_pwd}
                              onChange={this.handleChange('new_pwd')}
                              margin="normal"
                              type="password"
                            />
                            <br />
                            <TextField
                              id="new_cpwd"
                              label="Confirmed Password"
                              className={classes.textField}
                              value={new_cpwd}
                              onChange={this.handleChange('new_cpwd')}
                              margin="normal"
                              type="password"
                            />
                            <br />
                           
                            <Button variant="raised" color="primary" type="submit">Update</Button>
                        </form>


                    </Paper>

                </Grid>

                <Grid item xs></Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ChangePassword);
