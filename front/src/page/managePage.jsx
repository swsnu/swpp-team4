import React, {useEffect, useState} from 'react';
import MenuBar from '../Component/menuBar';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
    deleteAlgo,
    getAllMyAlgorithm,
    shareAlgo,
} from '../store/actions/algo';
import {loadDraftName} from '../store/actions/editor';
import {useDispatch, useSelector} from 'react-redux';

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    getAllMySnippets,
    getLikedSnippets,
    likeSnippet,
    shareSnippet,
} from '../store/actions/snippet';
import Grid from "@material-ui/core/Grid";

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

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    button: {
        align: 'center',
    },
    paper: {
        textAlign: 'center',
    },
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
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export const Algo = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [Public, setPublic] = useState(props.public);
    const handleClick = () => {
        let response = true;
        if (Public) {
            response = window.confirm('Do you wanna set this algorithm private?');
        } else {
            response = window.confirm('Do you wanna set this algorithm public?');
        }
        if (response) {
            setPublic(!Public);
            dispatch(shareAlgo(props.id, Public));
        }
    };
    const handleDelete = () => {
        const response = window.confirm('Delete this algorithm?');
        if (response) {
            dispatch(deleteAlgo(props.id));
        }
    };

    return (
        <div className="Algo">
            <Accordion
                square
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
            >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography component={'span'}>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography component={'span'}>
                                {props.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <div style={{textAlign: 'center'}}>
                                <Button
                                    id="algo_share"
                                    className={classes.button}
                                    onClick={handleClick}
                                    variant="outlined"
                                    color="primary"
                                >
                                    {Public ? 'Public' : 'Private'}
                                </Button>
                                <Button
                                    id="algo_delete"
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>

                            </div>
                        </Grid>
                    </Grid>

                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export const SavedAlgo = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleClick = () => {
        dispatch(loadDraftName(props.algoName));
        props.history.push('/algo/write');
    };
    const handleDelete = () => {
        const response = window.confirm('Delete this draft?');
        if (response) {
            localStorage.removeItem(props.algoName);
        }
    };

    return (
        <div className="SavedAlgo">
            <Accordion
                square
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
            >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography component={'span'}>{props.algoName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography id="snippet_names" component={'span'}>
                                snippet1: {props.snippetName1}
                                <br/>
                                snippet2: {props.snippetName2}
                                <br/>
                                snippet3: {props.snippetName3}
                                <br/>
                                snippet4: {props.snippetName4}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                id="saved_algo_resume"
                                className={classes.button}
                                onClick={handleClick}
                                variant="outlined"
                                color="primary"
                            >
                                resume
                            </Button>
                            <Button
                                id="saved_algo_delete"
                                variant="outlined"
                                color="primary"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export const Snippet = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [expanded, setExpanded] = React.useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [Public, setPublic] = useState(props.public);
    const handleClick = () => {
        let response = true;
        if (Public) {
            response = window.confirm('Do you wanna set this snippet private?');
        } else {
            response = window.confirm('Do you wanna set this snippet public?');
        }
        if (response) {
            setPublic(!Public);
            dispatch(shareSnippet(props.id, Public));
        }
    };

    return (
        <div className="Snippet">
            <Accordion
                id="snippet_accordion"
                square
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
            >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography component={'span'}>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={11}>
                            <Typography component={'span'}>
                                {props.description}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                id="snippet_share"
                                className={classes.button}
                                onClick={handleClick}
                                variant="outlined"
                                color="primary"
                            >
                                {Public ? 'Public' : 'Private'}
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export const LikedSnippet = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleClick = () => {
        const response = window.confirm('Unlike this snippet?');
        if (response) {
            dispatch(likeSnippet(props.id, false));
        }
    };

    return (
        <div className="LikedSnippet">
            <Accordion
                square
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
            >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography component={'span'}>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={11}>
                            <Typography component={'span'}>
                                {props.description}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                id="snippet_like"
                                className={classes.button}
                                variant="outlined"
                                color="primary"
                                onClick={handleClick}
                            >
                                unlike
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export const ManagePage = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllMyAlgorithm());
    }, []);
    useEffect(() => {
        dispatch(getAllMySnippets());
    }, []);
    useEffect(() => {
        dispatch(getLikedSnippets());
    }, []);

    const myAlgos = useSelector((store) => store.algo.ownedAlgorithmList);
    const mySnippets = useSelector((store) => store.snippet.ownedSnippetList);
    const likedSnippets = useSelector((store) => store.snippet.likedSnippetList);
    const [tempAlgos, setTempAlgos] = useState([]);


    useEffect(() => {
        const algos = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const object = JSON.parse(localStorage.getItem(key));
            const snippet = object.name;
            const code = object.code;
            const tempAlgo = {
                id: i,
                algoName: key,
                snippetName1: snippet[1],
                snippetName2: snippet[2],
                snippetName3: snippet[3],
                snippetName4: snippet[4],
                code: code,
            };
            algos.push(tempAlgo);
        }
        setTempAlgos(algos);
    }, []);

    useEffect(() => {
        window.addEventListener("storage", () => {
            const algos = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const object = JSON.parse(localStorage.getItem(key));
                const snippet = object.name;
                const code = object.code;
                const tempAlgo = {
                    id: i,
                    algoName: key,
                    snippetName1: snippet[1],
                    snippetName2: snippet[2],
                    snippetName3: snippet[3],
                    snippetName4: snippet[4],
                    code: code,
                };
                algos.push(tempAlgo);
            }
            setTempAlgos(algos);
        });
    })

    const [value, setValue] = React.useState('one');
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="ManagePage">
            <MenuBar/>
            <Button
                id="new-algorithm"
                style={{
                    marginLeft: 1050,
                }}
                onClick={() => {
                    props.history.push('/algo/write');
                }}
                variant="contained"
                color="primary"
            >
                New Algorithm
            </Button>
            <Tabs onChange={handleTabChange} value={value} indicatorColor="primary">
                <Tab id="tab-one" value="one" label="My Algos"/>
                <Tab id="tab-two" value="two" label="My Snippets"/>
                <Tab id="tab-three" value="three" label="Liked Snippets"/>
                <Tab id="tab-four" value="four" label="Saved Algos"/>
            </Tabs>
            <TabPanel value={value} index="one">
                {myAlgos.map((algo) => {
                    return (
                        <Algo
                            key={algo.id}
                            id={algo.id}
                            name={algo.name}
                            description={algo.description}
                            public={algo.is_public}
                        />
                    );
                })}
            </TabPanel>
            <TabPanel value={value} index="two">
                {mySnippets.map((snippet) => {
                    return (
                        <Snippet
                            key={snippet.id}
                            id={snippet.id}
                            name={snippet.name}
                            description={snippet.description}
                            public={snippet.is_shared}
                        />
                    );
                })}
            </TabPanel>
            <TabPanel value={value} index="three">
                {likedSnippets.map((snippet) => {
                    return (
                        <LikedSnippet
                            key={snippet.id}
                            id={snippet.id}
                            name={snippet.name}
                            description={snippet.description}
                        />
                    );
                })}
            </TabPanel>
            <TabPanel value={value} index="four">
                {tempAlgos.map((algo) => {
                    return (
                        <SavedAlgo
                            key={algo.id}
                            algoName={algo.algoName}
                            snippetName1={algo.snippetName1}
                            snippetName2={algo.snippetName2}
                            snippetName3={algo.snippetName3}
                            snippetName4={algo.snippetName4}
                            history={props.history}
                        />
                    );
                })}
            </TabPanel>
        </div>
    );
};

export default withRouter(ManagePage);
