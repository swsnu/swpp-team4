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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AppBar from '@material-ui/core/AppBar';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

const createData = (name, calories, fat, carbs, protein) => {
  return {name, calories, fat, carbs};
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export const BacktestDetailRow = (row) => {

  const [rowExpanded, setRowExpanded] = useState(false)

  return <>
    <TableRow key={row.name}>
      <TableCell component="th" scope="row">
        <IconButton size='small' onClick={() => {
          setRowExpanded(!rowExpanded)
        }}>
          {rowExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell align="right">{row.calories}</TableCell>
      <TableCell align="right">{row.fat}</TableCell>
      <TableCell align="right">{row.carbs}</TableCell>
    </TableRow>
    <TableRow key={row.name + '_expanded'}>

      <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
        <Collapse in={rowExpanded} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Buy
            </Typography>
            <Table size="small" style={{width: '80%'}}>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>삼성전자</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>삼성전자</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>삼성전자</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography variant="h6" gutterBottom component="div" style={{marginTop: 16}}>
              Sell
            </Typography>
            <Table size="small" style={{width: '80%'}}>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>삼성전자</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>삼성전자</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>삼성전자</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>
}


const BacktestDetailDialog = ({data, open, handleClose}) => {

  return <Dialog
    fullWidth={true}
    maxWidth={'md'}
    open={open}
    onClose={handleClose}
  >
    <DialogTitle>
      Log of Backtest #92753
    </DialogTitle>
    <DialogContent>
      <TableContainer component={Paper} style={{maxHeight: 500, overflowY: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{width: 30}}/>
              <TableCell>
                Date
              </TableCell>
              <TableCell align="right">
                Profit(%)
              </TableCell>
              <TableCell align="right">
                Bought
              </TableCell>
              <TableCell align="right">
                Sold
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => BacktestDetailRow(row))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
  </Dialog>
}


export const BacktestRow = ({data, onOpenLog}) => {

  const [rowExpanded, setRowExpanded] = useState(false)

  return <>
    <TableRow key={data.name}>
      <TableCell component="th" scope="row">
        <IconButton size='small' onClick={() => {
          setRowExpanded(!rowExpanded)
        }}>
          {rowExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        {data.name}
      </TableCell>
      <TableCell align="right">{data.calories}</TableCell>
      <TableCell align="right">{data.fat}</TableCell>
      <TableCell align="right">{data.carbs}</TableCell>
    </TableRow>
    {rowExpanded
    && <TableRow key={data.name + '_expanded'}>
      <TableCell style={{width: 30}}/>
      <TableCell align="left" colSpan={3}>
        {/*Backtest Settings: (start date, end date, initial_budget)*/}
        Testing Period: 2020/02/24 ~ 2020/12/31,
        <br/>
        Initial budget: 40,000,000KRW
      </TableCell>
      <TableCell style={{width: 120}}>
        <Button variant='contained' color='primary' onClick={onOpenLog}>
          Open Log
        </Button>
      </TableCell>
    </TableRow>
    }
  </>
}


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
                <ListItem divider button>
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
                <ListItem divider button>
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
                <ListItem divider button>
                  <ListItemText
                    primary="Algorithm name (#id)"
                    secondary={'Description for it? '}
                  />
                </ListItem>
                <ListItem divider button>
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
                  <Table>
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
                <Typography variant="h6" component="div" style={{marginTop: 24}}>
                  Start New Backtest
                </Typography>
                <div
                  style={{
                    // display: 'flex',
                    // justifyContent: 'right',
                    padding: 16
                  }}
                >
                  <TextField
                    id="newBacktest-startDate"
                    helperText="Start Date"
                    size='small'
                    type='date'
                    style={{marginRight: 16}}
                  />
                  <TextField
                    id="newBacktest-endDate"
                    helperText="End Date"
                    size='small'
                    type='date'
                    style={{marginRight: 16}}
                  />
                  <TextField
                    id="newBacktest-endDate"
                    helperText="startingBudget"
                    size='small'
                    type='number'
                    style={{marginRight: 16}}
                  />
                  <Button variant='contained' color='primary' style={{marginTop: 'auto'}}>
                    Initiate
                    {/*TODO:  user must specify the starting date and ending date of the backtest, and the initial budget.
                            All are necessary settings, so only if the user has filled the every entry,
                            the button 'Run' is enabled
                            Dialog?
                  */}
                  </Button>
                </div>
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
