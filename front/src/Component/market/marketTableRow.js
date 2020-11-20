import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';


export const MarketTableRow = (
  {
    rank,
    name,
    author,
    liked,
    onLikedChange,
  },
) => {
  const [rowExpanded, setRowExpanded] = useState(false);

  return <>
    <TableRow>
      <TableCell align="left">
        {rank}
      </TableCell>
      <TableCell align="left">
        {name}
      </TableCell>
      <TableCell align="left">
        {author}
      </TableCell>
      <TableCell align="left">
        <IconButton className='toggle-like' size='small' onClick={() => {
          onLikedChange(!liked);
        }}>
          {liked ? <FavoriteIcon color="secondary"/> : <FavoriteBorderIcon/>}
        </IconButton>
      </TableCell>
      <TableCell align="right">
        <IconButton className='toggle-expand' size='small' onClick={() => {
          setRowExpanded(!rowExpanded);
        }}>
          {rowExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Collapse in={rowExpanded} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Info
            </Typography>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>;
};
