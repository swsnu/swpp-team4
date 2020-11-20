import React, { useState } from 'react';
import MenuBar from '../Component/menuBar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import { MarketTableRow } from '../Component/market/marketTableRow';

export const MarketPage = props => {

  const [searchBy, setSearchBy] = React.useState('name');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResult, setSearchResult] = React.useState([]);


  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const onSearch = () => {

    // axios.post(???)
    // setSearchResult()
  };

  const onToggleLiked = (id, value) => {

  };


  return (
    <div>
      <MenuBar/>
      <Typography variant="h5">
        Search Snippet
      </Typography>
      <br/>

      <Grid container>
        <Grid item xs={9}>
          <TextField
            id="search-input"
            label="Input query"
            fullWidth
            style={{ marginBottom: 20 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            id="search-snippet"
            onClick={onSearch}
            variant='contained'
            color='primary'
            size='large'
            style={{ marginLeft: 40 }}
            disabled={searchQuery === ''}
          >
            Initiate
          </Button>
        </Grid>
      </Grid>

      <FormControl component="fieldset" style={{ marginBottom: 20 }}>
        <FormLabel component="legend">
          Search By
        </FormLabel>
        <RadioGroup id="search-by-radio" value={searchBy} onChange={handleSearchByChange} row>
          <FormControlLabel value="name" control={<Radio/>} label="Name"/>
          <FormControlLabel value="author" control={<Radio/>} label="Author"/>
          <FormControlLabel value="snippet1" control={<Radio/>} label="Snippet1"/>
          <FormControlLabel value="snippet2" control={<Radio/>} label="Snippet2"/>
          <FormControlLabel value="snippet3" control={<Radio/>} label="Snippet3"/>
          <FormControlLabel value="snippet4" control={<Radio/>} label="Snippet4"/>
        </RadioGroup>
      </FormControl>

      <TableContainer component={Paper} style={{ overflowY: 'auto', minHeight: 700 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                #
              </TableCell>
              <TableCell align="left">
                Name
              </TableCell>
              <TableCell align="left">
                Author
              </TableCell>
              <TableCell align="left">
                Liked
              </TableCell>
              <TableCell align="right">
                Expand
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <MarketTableRow
              rank={1}
              name={'test Name'}
              author={'chingis'}
              liked={false}
              onLikedChange={(v) => {
                console.log(v);
                onToggleLiked(0, v);
              }}
            >


            </MarketTableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

