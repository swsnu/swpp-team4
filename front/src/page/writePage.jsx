import React, { useEffect, useState } from "react";
// import { ConnectedRouter } from 'connected-react-router';
// import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Controlled as CodeMirror } from "react-codemirror2";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import MenuBar from "../Component/menuBar";
import * as actionCreators from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { submitSnippet } from "../store/actions/snippet";
import { submitAlgo } from "../store/actions/algo";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/theme/neat.css");
require("codemirror/mode/python/python.js");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 60,
    margin: "auto",
    paddingTop: 10,
    paddingLeft: 10
  },
  drawerContainer: {
    overflow: "auto"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export const WritePage = (props) => {
  const classes = useStyles();
  const [TabValue, setTabValue] = useState(1);
  const dispatch = useDispatch();
  const snippetSubmitStore = useSelector(s => s.user.snippetSubmit);
  const algorithmSubmitStore = useSelector(s => s.user.algorithmSubmit);
  const loadingStore = useSelector(s => s.user.loading);

  const [editorValue, setEditorValue] = useState({
    1: "scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), universe.query('(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)').to_numpy()))",
    2: `for index, candidate in enumerate(scope):
            if index==0:
                chosen_stocks.append(candidate)
                break`,
    3: `for index, candidate in enumerate(sell_candidates):
            if (self.universe.loc[self.universe['code'] == str(int(candidate.get_id()))].iloc[0]['close'])/candidate.avg_purchase_price-1>0.05:
                chosen_stocks.append(candidate)`,
    4: `if opt == "buy":
        for stock in chosen_stocks:
            buy_amount_list.append((stock, 1))
else:
    for stock in chosen_stocks:
        sell_amount_list.append((stock, stock.get_amount()))`
  });

  /* istanbul ignore next */
  const handleEditorValueChange = (i, d) => {
    setEditorValue({ ...editorValue, [i]: d });
    // handleEditorValidationChange(i, false);
  };

  // const [snippetValidated, setSnippetValidated] = useState({
  //   1: false,
  //   2: false,
  //   3: false,
  //   4: false,
  // });

  // const handleEditorValidationChange = (i, v) => {
  //   setSnippetValidated({...snippetValidated, [i]: v});
  // };

  const [snippetName, setSnippetName] = useState({
    1: "",
    2: "",
    3: "",
    4: ""
  });

  const [snippetDescr, setSnippetDescr] = useState({
    1: "",
    2: "",
    3: "",
    4: ""
  });

  const [algorithmName, setAlgorithmName] = useState("");
  const [algorithmDescr, setAlgorithmDescr] = useState("");
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

  /* istanbul ignore next */
  const handleDraft = (n) => {
    if (n !== undefined) {
      const draft = JSON.parse(localStorage.getItem(n));
      setEditorValue(draft.code);
      setSnippetName(draft.name);
    }
  };

  /* istanbul ignore next */
  const handleImport = () => {
    setImportModalOpen(true);
    // TODO: change content of modal
    // make editor readonly by changing snippetValidated & snippetSubmitted
  };

  // const handleValidate = (i) => {
  //   if (Math.random() > 0.5) {
  //     window.alert('validated');
  //     handleEditorValidationChange(i, true);
  //   } else {
  //     window.alert('validation fail: change name');
  //   }
  // };

  const handleSubmitSnippet = (i) => {
    // TODO: check for name duplicate
    const snippetType = [undefined, "scope", "buy", "sell", "amount"];
    dispatch(submitSnippet(snippetName[i], snippetDescr[i], snippetType[i], editorValue[i], i));
  };

  const saveAlgorithmAsDraft = () => {
    localStorage.setItem(
      algorithmName,
      JSON.stringify({
        code: editorValue,
        name: snippetName
      })
    );
    // TODO: message?
    window.alert("code saved to localstorage");
  };

  const handleSubmitAlgorithm = () => {
    // TODO: check for name duplicate  => not now
    // TODO: feedback message?
    if (
      snippetSubmitStore[0] !== false
      && snippetSubmitStore[1] !== false
      && snippetSubmitStore[2] !== false
      && snippetSubmitStore[3] !== false
      && algorithmName !== ""
      && algorithmDescr !== ""
    ) {
      dispatch(submitAlgo(algorithmName, algorithmDescr, snippetSubmitStore));
    } else {
      window.alert("Please submit algorithms first");
    }
  };

  return (
    <div className={classes.root}>
      <MenuBar/>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={4} style={{ backgroundColor: "#eeeeee" }}>
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
                <Tab id='snippet_1' label="Snippet: Scope" value={1}/>
                <Tab id='snippet_2' label="Snippet: Buy" value={2}/>
                <Tab id='snippet_3' label="Snippet: Sell" value={3}/>
                <Tab id='snippet_4' label="Snippet: Amount" value={4}/>
              </Tabs>
            </Paper>
            <div style={{ margin: 10 }}>
              <TextField
                id="snippet_name"
                variant="outlined"
                size={"small"}
                label="snippet name"
                disabled={snippetSubmitStore[TabValue] !== false}
                fullWidth
                value={snippetName[TabValue]}
                onChange={(e) => {
                  setSnippetName({
                    ...snippetName,
                    [TabValue]: e.target.value
                  });
                }}
              />
            </div>
            <div style={{ margin: 10 }}>
              <TextField
                id="snippet_descr"
                variant="outlined"
                size={"small"}
                label="snippet Description"
                disabled={snippetSubmitStore[TabValue] !== false}
                fullWidth
                value={snippetDescr[TabValue]}
                onChange={(e) => {
                  setSnippetDescr({
                    ...snippetDescr,
                    [TabValue]: e.target.value
                  });
                }}
              />
            </div>
            <CodeMirror
              value={editorValue[TabValue]}
              options={{
                mode: "python",
                theme: "material",
                lineNumbers: true,
                readOnly: (snippetSubmitStore[TabValue] !== false)
              }}
              onBeforeChange={
                /* istanbul ignore next */
                (editor, data, value) => {
                handleEditorValueChange(TabValue, value);
              }}
              // onChange={(editor, data, value) => {
              //   // setEditor1Value(value);
              // }}
            />
            <ButtonGroup color="primary" style={{ margin: 10 }}>
              <Button
                id='import_algorithm'
                size={"small"}
                disabled={snippetSubmitStore[TabValue] !== false}
                onClick={() => {
                  handleImport(TabValue);
                }}
              >
                Import
              </Button>
              {/*<Button*/}
              {/*  id='snippet_validate'*/}
              {/*  size={'small'}*/}
              {/*  disabled={*/}
              {/*    snippetName[TabValue] === '' || snippetValidated[TabValue]*/}
              {/*  }*/}
              {/*  onClick={() => {*/}
              {/*    handleValidate(TabValue);*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Validate*/}
              {/*</Button>*/}
              <Button
                id='submit_snippet'
                size={"small"}
                disabled={
                  // snippetName[TabValue] === '' || !snippetValidated[TabValue]
                  snippetName[TabValue] === ""
                  || snippetDescr[TabValue] === ""
                  || editorValue[TabValue] === ""
                  || snippetSubmitStore[TabValue] !== false
                }
                onClick={() => {
                  handleSubmitSnippet(TabValue);
                }}
              >
                Submit Snippet
              </Button>
            </ButtonGroup>
            <Typography id='status_message' component="span" style={{ color: "#ff0000" }}>
              {/*{`Status: ${snippetValidated[TabValue] === true*/}
              {/*  ? snippetSubmitStore[TabValue] === true*/}
              {/*    ? 'Submitted'*/}
              {/*    : 'Not submitted'*/}
              {/*  : 'Unvalidated'}`*/}
              {/*}*/}
              {`Status: ${snippetSubmitStore[TabValue] !== false
                ? "Submitted"
                : "Not submitted"}`
              }
            </Typography>
          </Paper>

          <Grid container justify="space-between" style={{ padding: 10 }}>
            <Grid item xs={3}>
              <TextField
                id="algorithm_name"
                variant="outlined"
                label="Algorithm name"
                size={"small"}
                style={{ marginRight: 10 }}
                value={algorithmName}
                onChange={(e) => {
                  setAlgorithmName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                id="algorithm_descr"
                variant="outlined"
                label="Algorithm Description"
                size={"small"}
                fullWidth
                style={{ marginRight: 10 }}
                value={algorithmDescr}
                onChange={(e) => {
                  setAlgorithmDescr(e.target.value);
                }}
              />
            </Grid>
            <Grid item style={{ marginTop: 16 }}>
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
                  disabled={
                    algorithmName === ""
                    || snippetSubmitStore[1] === false
                    || snippetSubmitStore[2] === false
                    || snippetSubmitStore[3] === false
                    || snippetSubmitStore[4] === false
                    || algorithmSubmitStore !== false
                  }
                  onClick={() => {
                    handleSubmitAlgorithm();
                  }}
                >
                  Submit as Algorithm
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item style={{ marginTop: 16 }}>
              <Button
                size={"small"} color={"secondary"} variant={"contained"}
                onClick={() => {
                  props.history.push("/");
                }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={importModalOpen}
        onClose={
          /* istanbul ignore next */
          () => {
          setImportModalOpen(false);
        }}
      >
        <Paper style={{ width: "100%", height: 400 }}>{"asdasd"}</Paper>
      </Dialog>
      <Backdrop
        open={loadingStore}
        onClick={() => {
          dispatch({ type: "CHANGE_LOADING", data: false });
        }}
        style={{ zIndex: 999 }}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
    </div>
  );
};
