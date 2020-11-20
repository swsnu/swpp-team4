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
import { Controlled as CodeMirror } from 'react-codemirror2';


export const MarketTableRow = (
  {
    id,
    name,
    author,
    liked,
    onLikedChange,
    description,
    code,
  },
) => {
  const [rowExpanded, setRowExpanded] = useState(false);

  return <>
    <TableRow>
      <TableCell align="left">
        {id}
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
              Description
            </Typography>
            <div style={{ marginLeft: 15 }}>
              {description}
            </div>
            <Typography variant="h6" gutterBottom component="div" style={{ marginTop: 20 }}>
              Code
            </Typography>
            <div style={{ marginLeft: 15 }}>
              <CodeMirror
                value={code}
                options={{
                  mode: 'python',
                  theme: 'material',
                  lineNumbers: true,
                  readOnly: true,
                }}
              />
            </div>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>;
};
