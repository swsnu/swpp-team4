import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";

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
