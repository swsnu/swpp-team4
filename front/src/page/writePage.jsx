import React, { useEffect, useState } from 'react';
// import { ConnectedRouter } from 'connected-react-router';
// import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
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
import Dialog from '@material-ui/core/Dialog';
import MenuBar from '../component/menuBar';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/python/python.js');

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

  const [snippetSubmitted, setSnippetSubmitted] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const handleSnippetSubmittionChange = (i, v) => {
    setSnippetSubmitted({ ...snippetSubmitted, [i]: v });
  };

  const [snippetName, setSnippetName] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
  });

  const [algorithmName, setAlgorithmName] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // const [errorMsg, setErrorMsg] = useState({
  //   1: '',
  //   2: '',
  //   3: '',
  //   4: '',
  // });
  //
  // const handleErrorMsgChange = (i, v) => {
  //   setErrorMsg({ ...errorMsg, [i]: v });
  // };

  useEffect(() => {
    // TODO: editor라는 store의 loadedDraftName 항목을 통해 draft의 이름을 불러온다
    handleDraft(undefined);
  }, []);

  const handleDraft = (n) => {
    if (n !== undefined) {
      const draft = JSON.parse(localStorage.getItem(n));
      setEditorValue(draft.code);
      setSnippetName(draft.name);
    }
  };

  const handleImport = () => {
    setImportModalOpen(true);
    // TODO: change content of modal
    // make editor readonly by changing snippetValidated & snippetSubmitted
  };

  const handleValidate = (i) => {
    if (Math.random() > 0.5) {
      window.alert('validated');
      handleEditorValidationChange(i, true);
    } else {
      window.alert('validation fail: change name');
    }
  };

  const handleSubmitSnippet = (i) => {
    // TODO: send request to check for name duplicate
    if (Math.random() > 0.5) {
      window.alert('snippet submitted! ');
      handleSnippetSubmittionChange(i, true);
    } else {
      window.alert('duplicate name, please change snippet name');
    }
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
    window.alert('code saved to localstorage');
  };

  const handleSubmitAlgorithm = () => {
    // TODO: check for name duplicate
    // TODO: message?
    if (
      snippetSubmitted[1] === true &&
      snippetSubmitted[2] === true &&
      snippetSubmitted[3] === true &&
      snippetSubmitted[1] === true
    ) {
      if (Math.random() > 0.5) {
        window.alert('duplicate name, please change snippet name');
      } else {
        window.alert('algorithm submitted');
      }
    } else {
      window.alert('Please submit algorithms first');
    }
  };

  return (
    <div className={classes.root}>
      <MenuBar/>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={4} style={{ backgroundColor: '#eeeeee' }}>
          API DOC
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={1}>
            <Paper elevation={3} style={{ marginBottom: 5, marginTop: 5 }}>
              <Tabs
                value={TabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab id='snippet_1' label="Snippet One" value={1}/>
                <Tab id='snippet_2' label="Snippet Two" value={2}/>
                <Tab id='snippet_3' label="Snippet Three" value={3}/>
                <Tab id='snippet_4' label="Snippet Four" value={4}/>
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
              options={{
                mode: 'python',
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => {
                handleEditorValueChange(TabValue, value);
              }}
              // onChange={(editor, data, value) => {
              //   // setEditor1Value(value);
              // }}
            />
            <ButtonGroup color="primary" style={{ margin: 10 }}>
              <Button
                id='import_algorithm'
                size={'small'}
                onClick={() => {
                  handleImport(TabValue);
                }}
              >
                Import
              </Button>
              <Button
                id='snippet_validate'
                size={'small'}
                disabled={
                  snippetName[TabValue] === '' || snippetValidated[TabValue]
                }
                onClick={() => {
                  handleValidate(TabValue);
                }}
              >
                Validate
              </Button>
              <Button
                id='submit_snippet'
                size={'small'}
                disabled={
                  snippetName[TabValue] === '' || !snippetValidated[TabValue]
                }
                onClick={() => {
                  handleSubmitSnippet(TabValue);
                }}
              >
                Submit Snippet
              </Button>
            </ButtonGroup>
            <Typography id='status_message' component="span" style={{ color: '#ff0000' }}>
              {`Status: ${snippetValidated[TabValue] === true
                ? snippetSubmitted[TabValue] === true
                  ? 'Submitted'
                  : 'Not submitted'
                : 'Unvalidated'}`
              }
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
                  id='save_algorithm'
                  onClick={() => {
                    saveAlgorithmAsDraft();
                  }}
                >
                  Save As Draft
                </Button>
                <Button
                  id='submit_algorithm'
                  disabled={algorithmName === ''}
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
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
      >
        <Paper style={{ width: '100%', height: 400 }}>{'asdasd'}</Paper>
      </Dialog>
    </div>
  );
};
