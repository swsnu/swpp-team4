import React, {useState} from 'react';
import MenuBar from "../Component/menuBar";
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";



const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    button: {
        marginLeft: 500,
    },
    paper: {
        textAlign: 'center',
    }
}));

export const TabPanel = (props) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}



TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export const Algo = props => {
    const classes = useStyles();

    const [Public, setPublic] = useState(true);

    const handleClick = () => {
        setPublic(!Public);
    }

    return (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                {props.name}
                <Button className={classes.button}
                        onClick={handleClick}
                        variant="outlined"
                        color="primary">{Public ? 'Public' : 'Private'}</Button>
                <Button variant="outlined" color="primary">Delete</Button>
            </Paper>
        </Grid>
    );
}

export const SavedAlgo = props => {
    const classes = useStyles();

    const handleClick = () => {
        window.location.replace('/algo/write');
    }

    return (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                {props.name}
                <Button className={classes.button}
                        onClick={handleClick}
                        variant="outlined"
                        color="primary">resume</Button>
                <Button variant="outlined" color="primary">Delete</Button>
            </Paper>
        </Grid>
    );
}

export const Snippet = props => {
    const classes = useStyles();

    const [Public, setPublic] = useState(true);

    const handleClick = () => {
        setPublic(!Public);
    }

    return (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                {props.name}
                <Button className={classes.button}
                        onClick={handleClick}
                        variant="outlined"
                        color="primary">{Public ? 'Public' : 'Private'}</Button>
            </Paper>
        </Grid>
    );
}



export const LikedSnippet = props => {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                {props.name}
                <Button className={classes.button}
                        variant="outlined"
                        color="primary">unlike</Button>
            </Paper>
        </Grid>
    );
}

export const ManagePage = props => {

    const [value, setValue] = React.useState('one');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <MenuBar/>
            <Button
              id='new-algorithm'
                style={{
                    marginLeft: 1050,
                }}
                onClick={() => {

                props.history.push('/algo/write');

            }} variant="contained" color="primary">
                New Algorithm
            </Button>
            <Tabs onChange={handleTabChange}
                  value={value}
                  indicatorColor="primary">
                <Tab id='tab-one' value="one" label="My Algos"/>
                <Tab value="two" label="My Snippets"/>
                <Tab value="three" label="Liked Snippets"/>
                <Tab value="four" label="Saved Algos"/>
            </Tabs>
            <TabPanel value={value} index="one">
                <Algo name="Algo 1"/>
                <Algo name="Algo 2"/>
                <Algo name="Algo 3"/>
                <Algo name="Algo 4"/>
                <Algo name="Algo 5"/>
                <Algo name="Algo 6"/>
                <Algo name="Algo 7"/>
                <Algo name="Algo 8"/>
                <Algo name="Algo 9"/>
            </TabPanel>
            <TabPanel value={value} index="two">
                <Snippet name="Snippet 1"/>
                <Snippet name="Snippet 2"/>
                <Snippet name="Snippet 3"/>
                <Snippet name="Snippet 4"/>
                <Snippet name="Snippet 5"/>
                <Snippet name="Snippet 6"/>
                <Snippet name="Snippet 7"/>
                <Snippet name="Snippet 8"/>
            </TabPanel>
            <TabPanel value={value} index="three">
                <LikedSnippet name="Snippet 1"/>
                <LikedSnippet name="Snippet 2"/>
                <LikedSnippet name="Snippet 3"/>
                <LikedSnippet name="Snippet 4"/>
                <LikedSnippet name="Snippet 5"/>
                <LikedSnippet name="Snippet 6"/>
            </TabPanel>
            <TabPanel value={value} index="four">
                <SavedAlgo name="Algo 1"/>
                <SavedAlgo name="Algo 2"/>
                <SavedAlgo name="Algo 3"/>
                <SavedAlgo name="Algo 4"/>
                <SavedAlgo name="Algo 5"/>
                <SavedAlgo name="Algo 6"/>
            </TabPanel>
        </div>
    );
}


export default withRouter(ManagePage);

