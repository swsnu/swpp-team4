import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import {Typography} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import React, {useState} from "react";

export const RowByDateWithLogTable = ({row}) => {

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
