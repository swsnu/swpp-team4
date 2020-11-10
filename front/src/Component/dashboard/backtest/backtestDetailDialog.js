import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import React from "react";
import { RowByDateWithLogTable } from "./rowByDateWithLogTable";
import { rows } from "./mock";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Typography } from "@material-ui/core";

export const BacktestDetailDialog = ({ id, transaction_log, daily_profit, open, handleClose }) => {

  return <Dialog
    fullWidth={true}
    maxWidth={"md"}
    open={open}
    onClose={handleClose}
  >
    <DialogTitle>
      Log of Backtest #{id}
    </DialogTitle>
    <DialogContent>
      <Typography variant="h6" gutterBottom component="div">
        Daily Profit Rate
      </Typography>
      <ResponsiveContainer
        width={"100%"} height={250}
      >
        <LineChart
          data={daily_profit}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date"/>
          <YAxis interval={0} domain={[dataMin => Math.floor(dataMin - 5), dataMax => Math.ceil(dataMax + 5)]}/>
          <Tooltip/>
          <Legend/>
          <Line type="monotone" dataKey="profit" stroke="#82ca9d"/>
          <ReferenceLine y={100} stroke="red"/>
        </LineChart>
      </ResponsiveContainer>
      <Typography variant="h6" gutterBottom component="div">
        Detailed log
      </Typography>
      <TableContainer component={Paper} style={{ maxHeight: 500, overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 30 }}/>
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
            {daily_profit.map((e, i) => {
                console.log(e);
                console.log(i);
                return <RowByDateWithLogTable
                  transaction_log={transaction_log[i]}
                  daily_profit={daily_profit[i]}
                />;
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
  </Dialog>;
};
