import React, { Component } from 'react';
import { auth, db } from '../firebase';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import List, {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from 'material-ui/List';
import { Divider} from 'material-ui';

import {DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


// a little function to help us with reordering the result
const reorder =  (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
  
  const grid = 1;
  
  const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid ,
    margin: `0 0 ${grid}px 0`,
    
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',
    
    // styles we need to apply on draggables
    ...draggableStyle
  });
  
  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    
    padding: grid,
    
  });


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
    },
    list: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        maxWidth: 368,
    },

});

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes : [],
            current : "",
            new_notes :[]
            
        };
        this.addNote = this.addNote.bind(this);
        this.removeNote = this.removeNote.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        
    }

    componentWillMount() {
        const uid = auth.currentUser.uid;
        let notesRef = db.ref('notes/' + uid).limitToLast(100);
        notesRef.on('child_added', snapshot => {
            let note = { text: snapshot.val(), id: snapshot.key };
            this.setState({ notes: [note].concat(this.state.notes),
                            });
        })

        notesRef.on('child_removed', snapshot => {
            let update = this.state.notes.filter(note => note.id !==snapshot.key);
            this.setState({ notes : update});
        })
    }

    componentWillUnmount(){
        this.setState({
            notes : [],
        })
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    addNote(e) {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        db.ref('notes/' + uid).push(this.state.current);
        this.setState({ current : "" });
    }

    removeNote(note) {
        const uid = auth.currentUser.uid;
        db.ref('notes/' + uid).child(note.id).remove();
    }

    onDragEnd (result) {
        if(!result.destination) {
             return; 
        }
        
        const items = reorder(
            this.state.notes, 
            result.source.index, 
            result.destination.index
        );

        const uid = auth.currentUser.uid;
        var key;
        var text;
        const length =  items.length
        var i;
        for (i=0;i<length;i++){
            key= items[i].id;
            db.ref('notes/'+uid).child(key).remove();
        }
        for (i=length-1;i>=0;i--){
            text=items[i].text;
            db.ref('notes/'+uid).push(text);
        }
      }

    

    render() {
        const classes = this.props.classes;
        return (
            
            <Grid container className={classes.container}>
                <Grid item xs></Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <h1>Your Notes</h1>
                        <Divider/>
                        <List className={classes.list}>
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div 
                                    ref={provided.innerRef} 
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                    >
                                    {this.state.notes.map((item, index) => (
                                        <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                        >
                                        {(provided, snapshot) => (
                                            <div>
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                style={getItemStyle(
                                                provided.draggableProps.style,
                                                snapshot.isDragging
                                                )}
                                            >
                                            <ListItem key={item.id}>
                                                <ListItemText primary={(index+1) + '. ' + item.text}
                                                />
                                                
                                                <ListItemSecondaryAction>
                                                <IconButton aria-label="Delete" onClick={()=>this.removeNote(item)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem> 
                                            </div>
                                            {provided.placeholder}
                                            </div>
                                        )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    </div>
                                )}
                                </Droppable>
                            </DragDropContext>
                        </List>

                        <form onSubmit={this.addNote}>
                            <TextField
                                id="note"
                                label="Enter new note"
                                className={classes.textField}
                                value={this.state.current}
                                onChange={this.handleChange('current')}
                                margin="normal"
                                />
                            <br />
                            <Button variant="raised" color="primary" type="submit">Add</Button>
                        </form>

                    </Paper>
                    
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Main);
