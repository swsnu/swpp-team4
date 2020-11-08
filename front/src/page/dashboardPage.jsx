import React, {useState} from 'react';
import {ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@material-ui/core';
import MenuBar from '../Component/menuBar';
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {BacktestRow} from "../Component/dashboard/backtest/backtestRow";
import {BacktestDetailDialog} from "../Component/dashboard/backtest/backtestDetailDialog";
import {rows} from '../Component/dashboard/backtest/mock'
import {NewBackTestForm} from "../Component/dashboard/backtest/newBackTestForm";

export const DashboardPage = () => {

  const [tab, setTab] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [backtestDetailDialogData, setBacktestDetailDialogData] = useState([])
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(0)

  return (
    <div>
      <MenuBar/>
      <div>
        <Grid container spacing={3} style={{marginTop: 16}}>
          <Grid item xs={3} component={Paper}>
            <div style={{width: '100%', height: '100%', margin: 0}}>
              <Typography variant="h6" gutterBottom component="div">
                My Algorithms
              </Typography>
              <List style={{margin: 8}}>
                <ListItem
                  divider button
                  selected={selectedAlgorithmId === 0}
                  onClick={() => {
                    setSelectedAlgorithmId(0)
                  }}
                >
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
                <ListItem
                  divider button
                  selected={selectedAlgorithmId === 1}
                  onClick={() => {
                    setSelectedAlgorithmId(1)
                  }}
                >
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
                <ListItem
                  divider button
                  selected={selectedAlgorithmId === 2}
                  onClick={() => {
                    setSelectedAlgorithmId(2)
                  }}
                >
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
                <ListItem
                  divider button
                  selected={selectedAlgorithmId === 3}
                  onClick={() => {
                    setSelectedAlgorithmId(3)
                  }}
                >
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
              </List>
              The right-sided bar contains the list of user's algorithm which are available for testing
              (i.e. algorithm which the user has accessed) In the side bar,
              the algorithms are ordered by the reverse of the algorithm's id.
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
                <Tab label="Backtest"/>
                <Tab label="Simulation"/>
              </Tabs>
              <div style={{display: tab === 0 ? 'block' : 'none', height: 400, marginTop: 16}}>
                <Typography variant="h6" gutterBottom component="div">
                  Backtests
                </Typography>
                <TableContainer component={Paper} style={{maxHeight: 300, overflowY: 'auto'}}>
                  <Table stickyHeader >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{width: 30}}/>
                        <TableCell>Name?</TableCell>
                        <TableCell align="right">
                          Profit(%)
                        </TableCell>
                        <TableCell align="right">
                          MDD
                        </TableCell>
                        <TableCell align="right">
                          Alpha
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) =>
                        BacktestRow({
                          data: row,
                          onOpenLog: () => {
                            // TODO
                            setBacktestDetailDialogData([])
                            setDialogOpen(true)
                          }
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <BacktestDetailDialog
                  data={backtestDetailDialogData}
                  open={dialogOpen}
                  handleClose={() => setDialogOpen(false)}
                />
                <NewBackTestForm onSubmit={(d) => {
                  console.log(d)
                }}/>
              </div>
              <div style={{display: tab === 1 ? 'block' : 'none'}}>

              </div>
            </div>
          </Grid>
        </Grid>

      </div>
    </div>
  );
};
