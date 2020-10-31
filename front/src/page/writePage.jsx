import React, { useEffect, useState } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/python/python.js');

const codeMirrorOptions = {
  mode: 'python',
  theme: 'material',
  lineNumbers: true,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 60,
    margin: 'auto',
    paddingTop: 10,
    paddingLeft: 10,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const WritePage = () => {
  const classes = useStyles();
  const [TabValue, setTabValue] = useState(1);

  const [editorValue, setEditorValue] = useState({
    1: '1111',
    2: '2222',
    3: '33333',
    4: '44',
  });

  const handleEditorValueChange = (i, d) => {
    setEditorValue({ ...editorValue, [i]: d });
    handleEditorValidationChange(i, false);
  };

  const [snippetValidated, setSnippetValidated] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const handleEditorValidationChange = (i, v) => {
    setSnippetValidated({ ...snippetValidated, [i]: v });
  };

  const [snippetName, setSnippetName] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
  });

  const [algorithmName, setAlgorithmName] = useState('');

  useEffect(() => {
    console.log(editorValue);
  }, [editorValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImport = (n) => {
    // TODO  setEditorValue  setSnippetName
  };

  const handleValidate = (i) => {
    if (Math.random() > 0.5) {
      console.log('validated');
      handleEditorValidationChange(i, true);
    }
  };

  const handleSubmitSnippet = (n) => {
    // TODO: check for name duplicate
    // error message handling and disabling editor
  };

  const saveAlgorithmAsDraft = () => {
    localStorage.setItem(
      algorithmName,
      JSON.stringify({
        code: editorValue,
        name: snippetName,
      }),
    );
    // TODO: message?
  };

  const handleSubmitAlgorithm = () => {
    // TODO: check for name duplicate
    // TODO: message?
  };

  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appBar}>
        <Typography variant={'h6'}>Quant Cash Dashboard</Typography>
      </AppBar>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={4} style={{ backgroundColor: '#eeeeee' }}>
          API DOC
        </Grid>
        <Grid item xs={8} spacing={2} alignItems="stretch">
          <Paper elevation={1}>
            <Paper elevation={3} style={{ marginBottom: 5, marginTop: 5 }}>
              <Tabs
                value={TabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                dense
              >
                <Tab label="Snippet One" value={1} />
                <Tab label="Snippet Two" value={2} />
                <Tab label="Snippet Three" value={3} />
                <Tab label="Snippet Four" value={4} />
              </Tabs>
            </Paper>
            <div
              style={{
                marginBottom: 10,
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <TextField
                id="snippet_name"
                variant="outlined"
                size={'small'}
                label="snippet name"
                fullWidth
                value={snippetName[TabValue]}
                onChange={(e) => {
                  setSnippetName({
                    ...snippetName,
                    [TabValue]: e.target.value,
                  });
                }}
              />
            </div>
            <CodeMirror
              value={editorValue[TabValue]}
              options={codeMirrorOptions}
              onBeforeChange={(editor, data, value) => {
                handleEditorValueChange(TabValue, value);
              }}
              // onChange={(editor, data, value) => {
              //   // setEditor1Value(value);
              // }}
            />
            <ButtonGroup color="primary" style={{ margin: 10 }}>
              <Button
                size={'small'}
                onClick={() => {
                  handleImport(TabValue);
                }}
              >
                Import
              </Button>
              <Button
                size={'small'}
                disabled={snippetValidated[TabValue]}
                onClick={() => {
                  handleValidate(TabValue);
                }}
              >
                Validate
              </Button>
              <Button
                size={'small'}
                disabled={!snippetValidated[TabValue]}
                onClick={() => {
                  handleSubmitSnippet(TabValue);
                }}
              >
                Submit Snippet
              </Button>
            </ButtonGroup>
            <Typography component="span" style={{ color: '#ff0000' }}>
              Duplicate name: change name and submit again
            </Typography>
          </Paper>

          <Grid container justify="space-between" style={{ padding: 10 }}>
            <Grid item>
              <TextField
                id="algorithm_name"
                variant="outlined"
                label="Algorithm name"
                size={'small'}
                style={{ marginRight: 10 }}
                value={algorithmName}
                onChange={(e) => {
                  setAlgorithmName(e.target.value);
                }}
              />
              <ButtonGroup color="primary" style={{ marginTop: 2 }}>
                <Button
                  onClick={() => {
                    saveAlgorithmAsDraft();
                  }}
                >
                  Save As Draft
                </Button>
                <Button
                  onClick={() => {
                    handleSubmitAlgorithm();
                  }}
                >
                  Submit as Algorithm
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Button size={'small'} color={'secondary'} variant={'contained'}>
                Back
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
