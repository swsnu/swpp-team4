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
import {BacktestDetailRow} from "./backtestDetailRow";
import {rows} from './mock'

export const BacktestDetailDialog = ({data, open, handleClose}) => {

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
