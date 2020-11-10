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
import * as theme from "@material-ui/system";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    button: {
        marginLeft: 100,
    },
    paper: {
        textAlign: 'center',
    }
}));

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

function TabPanel(props) {
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

const Algo = props => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [Public, setPublic] = useState(true);

    const handleClick = () => {
        setPublic(!Public);
    }

    return (
        <Grid item xs={12}>
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                    <Button variant="outlined" color="primary" className={classes.button}
                            onClick={handleClick}>{Public ? 'Public' : 'Private'}</Button>
                    <Button variant="outlined" color="primary">Delete</Button>

                </AccordionDetails>
            </Accordion>
        </Grid>
    );
}

const SavedAlgo = props => {
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleClick = () => {
        props.history.push('/algo/write');
    }

    return (
        <Grid item xs={12}>
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        This is an algorithm made by Hwarim. This is an algorithm made by Hwarim. This is an algorithm made by Hwarim.
                        This is an algorithm made by Hwarim. This is an algorithm made by Hwarim. This is an algorithm made by Hwarim.
                    </Typography>
                    <Button className={classes.button}
                            onClick={handleClick}
                            variant="outlined"
                            color="primary">resume</Button>
                    <Button variant="outlined" color="primary">Delete</Button>

                </AccordionDetails>
            </Accordion>
        </Grid>
    );
}

const Snippet = props => {
    const classes = useStyles();

    const [Public, setPublic] = useState(true);

    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleClick = () => {
        setPublic(!Public);
    }

    return (
        <Grid item xs={12}>
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                    <Button className={classes.button}
                         onClick={handleClick}
                         variant="outlined"
                         color="primary">{Public ? 'Public' : 'Private'}</Button>

                </AccordionDetails>
            </Accordion>
        </Grid>
    );
}

const LikedSnippet = props => {
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Grid item xs={12}>
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                    <Button className={classes.button}
                         variant="outlined"
                         color="primary">unlike</Button>

                </AccordionDetails>
            </Accordion>
        </Grid>
    );
}

export const ManagePage = props => {

    const classes = useStyles();

    const [value, setValue] = React.useState('one');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <MenuBar/>
            <Button
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
                <Tab value="one" label="My Algos"/>
                <Tab value="two" label="My Snippets"/>
                <Tab value="three" label="Liked Snippets"/>
                <Tab value="four" label="Saved Algos"/>
            </Tabs>
            <TabPanel value={value} index="one">
                <Algo name="Algo #1"/>
            </TabPanel>
            <TabPanel value={value} index="two">
                <Snippet name="Snippet 1"/>
                <Snippet name="Snippet 2"/>
                <Snippet name="Snippet 3"/>
                <Snippet name="Snippet 4"/>
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
                <SavedAlgo name="Algo #1"/>
                <SavedAlgo name="Algo #2"/>
                <SavedAlgo name="Algo #3"/>
            </TabPanel>
        </div>
    );
}

export default withRouter(ManagePage);