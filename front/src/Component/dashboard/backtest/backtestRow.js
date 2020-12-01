import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';

export const BacktestRow = ({ data, onOpenLog }) => {
  const [rowExpanded, setRowExpanded] = useState(false);

  return (
    <>
      <TableRow key={data.id}>
        <TableCell component="th" scope="row">
          <IconButton
            size="small"
            id="toggle-expand"
            onClick={() => {
              setRowExpanded(!rowExpanded);
            }}
          >
            {rowExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {data.id}
        </TableCell>
        <TableCell align="right">{data.profit}</TableCell>
        <TableCell align="right">{data.MDD}</TableCell>
        <TableCell align="right">{data.alpha}</TableCell>
      </TableRow>
      {rowExpanded && (
        <TableRow key={data.id + '_expanded'}>
          <TableCell style={{ width: 30 }} />
          <TableCell align="left" colSpan={3}>
            {/*Backtest Settings: (start date, end date, initial_budget)*/}
            Testing Period: {data.start_date.slice(0, 10)} ~{' '}
            {data.end_date.slice(0, 10)},
            <br />
            Initial budget: {data.initial_budget}KRW
            {/*  end_date: "2020-02-02T00:00:00Z"  */}
          </TableCell>
          <TableCell style={{ width: 120 }}>
            <Button variant="contained" color="primary" onClick={onOpenLog}>
              Open Log
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
