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
import DialogContent from '@material-ui/core/DialogContent';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const mockSimulationData = {
  id: 10001,
  alpha: 95.00557420115997,
  profit: 92.4978,
  MDD: 5.355000000000004,
  transaction_log: [
    {
      sell: [],
      buy: [],
      date: '2020-01-03',
    },
    {
      sell: [],
      buy: [
        {
          name: '대신정보통신',
          price: 1400,
          amount: 714,
        },
      ],
      date: '2020-01-06',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-07',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-08',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-09',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-10',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-13',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-14',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-15',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-16',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-17',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-20',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-21',
    },
    {
      sell: [],
      buy: [
        {
          name: '글로스퍼랩스',
          price: 375,
          amount: 1,
        },
      ],
      date: '2020-01-22',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-23',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-28',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-29',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-30',
    },
    {
      sell: [],
      buy: [],
      date: '2020-01-31',
    },
  ],
  daily_profit: [
    {
      date: '2020-01-03',
      profit: 100.0,
    },
    {
      date: '2020-01-06',
      profit: 100.0,
    },
    {
      date: '2020-01-07',
      profit: 100.714,
    },
    {
      date: '2020-01-08',
      profit: 96.787,
    },
    {
      date: '2020-01-09',
      profit: 104.641,
    },
    {
      date: '2020-01-10',
      profit: 104.641,
    },
    {
      date: '2020-01-13',
      profit: 103.927,
    },
    {
      date: '2020-01-14',
      profit: 103.57,
    },
    {
      date: '2020-01-15',
      profit: 104.641,
    },
    {
      date: '2020-01-16',
      profit: 102.856,
    },
    {
      date: '2020-01-17',
      profit: 102.142,
    },
    {
      date: '2020-01-20',
      profit: 99.286,
    },
    {
      date: '2020-01-21',
      profit: 100.0,
    },
    {
      date: '2020-01-22',
      profit: 101.428,
    },
    {
      date: '2020-01-23',
      profit: 102.4982,
    },
    {
      date: '2020-01-28',
      profit: 97.1404,
    },
    {
      date: '2020-01-29',
      profit: 96.7833,
    },
    {
      date: '2020-01-30',
      profit: 95.3535,
    },
    {
      date: '2020-01-31',
      profit: 92.4978,
    },
  ],
};

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
  console.log(mockSimulationData);

  useEffect(() => {
    // get list of all my algorithms
    dispatch(getAllMyAlgorithm());
  }, []);

  const selectAlgorithm = async (id) => {
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
      setSimulationData(mockSimulationData);
    }
  };

  /* istanbul ignore next */
  const getAlgorithmEvaluation = (id) => {
    // TODO: get Backtesting and Performance(daily test) data of certain algorithm
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
                      await selectAlgorithm(e.id);
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
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
