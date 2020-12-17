import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import MenuBar from '../Component/menuBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Grid from '@material-ui/core/Grid';
import { BacktestRow } from '../Component/dashboard/backtest/backtestRow';
import { BacktestDetailDialog } from '../Component/dashboard/backtest/backtestDetailDialog';
import { NewBackTestForm } from '../Component/dashboard/backtest/newBackTestForm';
import { getAllMyAlgorithm } from '../store/actions/algo';
import { RowByDateWithLogTable } from '../Component/dashboard/backtest/rowByDateWithLogTable';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Controlled as CodeMirror } from 'react-codemirror2';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const DashboardPage = () => {
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [backtestDetailDialogData, setBacktestDetailDialogData] = useState({
    id: 0,
    transaction_log: [],
    daily_profit: [],
  });
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(0);
  const dispatch = useDispatch();
  const ownedAlgorithmListStore = useSelector((s) => s.algo.ownedAlgorithmList);
  const [tableData, setTableData] = useState([]);
  const [simulationData, setSimulationData] = useState({
    profit_dict: '[]',
    transaction_log: '[]',
  });

  const [optimizationParameterNum, setOptimizationParameterNum] = useState(0);
  const [optimizationRanges, setOptimizationRanges] = useState({
    // param_0_0  param_0_1
    // param_1_0  param_1_1
  });
  const [unOptimizedCode, setUnOptimizedCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');

  useEffect(() => {
    // get list of all my algorithms
    dispatch(getAllMyAlgorithm());
  }, []);

  const selectAlgorithm = async (id, data) => {
    setSelectedAlgorithmId(id);
    // TODO: get Backtesting and Performance(daily test) data of certain algorithm
    try {
      const response = await axios.get(`api/algo/${id}/report`);
      console.log(response);
      setTableData(response.data);
    } catch (e) {
      console.log(e);
      setTableData([]);
    }
    try {
      const response = await axios.get(`api/algo/${id}/performance`);
      console.log(response);
      setSimulationData(response.data);
    } catch (e) {
      setSimulationData({
        profit_dict: '[]',
        transaction_log: '[]',
      });
    }

    try {
      const response = await axios.get(`api/algo/${id}/opt`);
      console.log(response.data);
      setOptimizedCode(response.data);
    } catch (e) {
      setOptimizedCode('');
    }

    //optimization
    const scopeSnippet = data.snippet_scope_data.code;
    setUnOptimizedCode(scopeSnippet);
    const paramNum = scopeSnippet.split('@').length - 1;
    setOptimizationParameterNum(paramNum);
    const ob = {};
    for (let i = 0; i <= paramNum; i++) {
      ob[`param_${i}_0`] = '1';
      ob[`param_${i}_1`] = '10';
    }
    setOptimizationRanges(ob);
    // TODO: fetch ~~
  };


  const startBacktest = async (
    {
      startDate,
      endDate,
      startingBudget,
    },
  ) => {
    try {
      const response = await axios.post(`api/algo/backtest`, {
        start: startDate,
        end: endDate,
        budget: startingBudget,
        algo_id: selectedAlgorithmId,
      });
      console.log(response);
      window.alert('백테스팅을 시작했습니다.');
    } catch (e) {
      window.alert('에러 발생! 백테스팅이 시작되지 않았습니다.');
      console.log(e);
    }
  };
  // /* istanbul ignore next */
  // const getAlgorithmEvaluation = (id) => {
  //   // TODO: get Backtesting and Performance(daily test) data of certain algorithm
  // };

  const startOptimization = async () => {
    console.log(optimizationRanges);
    const ob = Object.keys(optimizationRanges).reduce((acc, cur) => {
      if (isNaN(parseInt(optimizationRanges[cur]))) {
        return acc;
      } else {
        return {
          ...acc,
          [cur]: parseInt(optimizationRanges[cur]),
        };
      }
    }, {});
    console.log(ob);
    try {
      await axios.post(`api/algo/${selectedAlgorithmId}`, ob);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <MenuBar/>
      <div>
        <Grid container spacing={3} style={{ marginTop: 16 }}>
          <Grid item xs={3} component={Paper}>
            <div style={{ width: '100%', height: '100%', margin: 0 }}>
              <Typography variant="h6" gutterBottom component="div">
                My Algorithms
              </Typography>
              <List style={{ margin: 8, maxHeight: 500, overflowY: 'auto' }}>
                {ownedAlgorithmListStore.map((e) => (
                  <ListItem
                    divider
                    button
                    className={`myAlgo-${e.id}`}
                    selected={selectedAlgorithmId === e.id}
                    onClick={async () => {
                      await selectAlgorithm(e.id, e);
                    }}
                  >
                    <ListItemText
                      primary={`${e.name} (#${e.id})`}
                      secondary={e.description}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          </Grid>
          <Grid item xs={9}>
            <div>
              <Tabs
                // component={Paper}
                value={tab}
                onChange={(e, v) => setTab(v)}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab id="tab-backtest" label="Backtest"/>
                <Tab id="tab-simulation" label="Simulation"/>
                <Tab id="tab-optimization" label="Optimization"/>
              </Tabs>
              <div
                style={{
                  display: tab === 0 ? 'block' : 'none',
                  height: 400,
                  marginTop: 16,
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Backtests
                </Typography>
                <TableContainer
                  component={Paper}
                  style={{ maxHeight: 300, overflowY: 'auto' }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 30 }}/>
                        <TableCell>Backtest ID</TableCell>
                        <TableCell align="right">Profit(%)</TableCell>
                        <TableCell align="right">MDD</TableCell>
                        <TableCell align="right">Alpha</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row) => (
                        <BacktestRow
                          data={row}
                          className={`BacktestRow-${row.id}`}
                          onOpenLog={() => {
                            setBacktestDetailDialogData({
                              id: row.id,
                              transaction_log: JSON.parse(
                                row.transaction_log.replaceAll(`'`, `"`),
                              ),
                              daily_profit: JSON.parse(
                                row.daily_profit.replaceAll(`'`, `"`),
                              ),
                            });
                            /* istanbul ignore next */
                            setDialogOpen(true);
                          }}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <BacktestDetailDialog
                  id={backtestDetailDialogData.id}
                  transaction_log={backtestDetailDialogData.transaction_log}
                  daily_profit={backtestDetailDialogData.daily_profit}
                  open={dialogOpen}
                  handleClose={
                    /* istanbul ignore next */
                    () => setDialogOpen(false)
                  }
                />
                <NewBackTestForm
                  onSubmit={(d) => {
                    console.log(d);
                    startBacktest(d);
                  }}
                />
              </div>
              <div
                style={{
                  display: tab === 1 ? 'block' : 'none',
                  height: 400,
                  marginTop: 16,
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Simulation
                </Typography>
                <ResponsiveContainer width={'100%'} height={250}>
                  <LineChart
                    data={
                      Object.keys(JSON.parse(simulationData.profit_dict)).map(e => ({
                        date: e,
                        profit: JSON.parse(simulationData.profit_dict)[e],
                      }))
                    }
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis
                      interval={0}
                      domain={[
                        /* istanbul ignore next */
                        (dataMin) => Math.floor(dataMin - 2),
                        /* istanbul ignore next */
                        (dataMax) => Math.ceil(dataMax + 2),
                      ]}
                    />
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d"/>
                    <ReferenceLine y={100} stroke="red"/>
                  </LineChart>
                </ResponsiveContainer>
                <Typography variant="h6" gutterBottom component="div">
                  Detailed log
                </Typography>
                <TableContainer
                  component={Paper}
                  style={{ maxHeight: 300, overflowY: 'auto' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 30 }}/>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Profit(%)</TableCell>
                        <TableCell align="right">Bought</TableCell>
                        <TableCell align="right">Sold</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {JSON.parse(simulationData.transaction_log).map((e, i) => (
                        <RowByDateWithLogTable
                          key={i}
                          transaction_log={JSON.parse(simulationData.transaction_log)[i]}
                          daily_profit={JSON.parse(simulationData.profit_dict)[e.date]}
                          mode={'f'}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div
                style={{
                  display: tab === 2 ? 'block' : 'none',
                  height: 400,
                  marginTop: 16,
                }}
              >
                <br/>
                <Typography variant="h6" gutterBottom component="div">
                  Current Scope Code
                </Typography>
                <Grid container>
                  <Grid item xs={9}>
                    <CodeMirror
                      value={unOptimizedCode}
                      options={{
                        mode: 'python',
                        theme: 'material',
                        lineNumbers: true,
                        readOnly: true,
                      }}
                      onBeforeChange={
                        /* istanbul ignore next */
                        (editor, data, value) => {
                        }
                      }
                    />
                    <br/>
                    <br/>
                    <Typography variant="h6" gutterBottom component="div">
                      Optimized Scope Code
                    </Typography>
                    <CodeMirror
                      value={optimizedCode}
                      options={{
                        mode: 'python',
                        theme: 'material',
                        lineNumbers: true,
                        readOnly: true,
                      }}
                      onBeforeChange={
                        /* istanbul ignore next */
                        (editor, data, value) => {
                        }
                      }
                    />
                    <br/>
                    <br/>
                    <br/>
                  </Grid>
                  <Grid item xs={3} style={{ padding: 20 }}>
                    {Array(optimizationParameterNum).fill(true).map((_, i) =>
                      <div style={{ marginBottom: 15 }} key={i}>
                        <div>
                          Parameter{i + 1}
                          {/*optimizationRanges, setOptimizationRanges*/}
                        </div>
                        <TextField
                          value={optimizationRanges[`param_${i}_0`] === undefined
                            ? 1
                            : optimizationRanges[`param_${i}_0`]
                          }
                          onChange={(e) => {
                            setOptimizationRanges({
                              ...optimizationRanges, [`param_${i}_0`]: e.target.value,
                            });
                          }}
                          variant="outlined"
                          size="small"
                          label={`Parameter${i + 1} Min`}
                          type="number"
                        />
                        <TextField
                          value={optimizationRanges[`param_${i}_1`] === undefined
                            ? 1
                            : optimizationRanges[`param_${i}_1`]
                          }
                          onChange={(e) => {
                            setOptimizationRanges({
                              ...optimizationRanges, [`param_${i}_1`]: e.target.value,
                            });
                          }}
                          variant="outlined"
                          size="small"
                          label={`Parameter${i + 1} Max`}
                          type="number"
                        />
                      </div>)
                    }
                    <div>
                      <Button
                        id="start_optimization"
                        variant="outlined"
                        color="primary"
                        onClick={startOptimization}
                      >
                        Optimize
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
