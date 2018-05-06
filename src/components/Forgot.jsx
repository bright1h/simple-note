import React, { Component } from 'react';
import { auth } from '../firebase';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    margin : theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
},
});

class Forgot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forgot_password_email : "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendReset = this.sendReset.bind(this);
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
            console.log(msg);
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          });
          
    }

    render() {
        const { forgot_password_email } = this.state;
        const classes = this.props.classes;
        return (
            <Grid container>

                <Grid item xs></Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <h1>Forgot Password</h1>
                        
                        <form onSubmit={this.sendReset} autoComplete="off">
                            <TextField
                              id="forgot_password_email"
                              label="Email"
                              className={classes.textField}
                              value={forgot_password_email}
                              onChange={this.handleChange('forgot_password_email')}
                              margin="normal"
                              type="email"
                            />
                            <br />
                            <Button variant="raised" color="primary" type="submit">Reset</Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Forgot);
