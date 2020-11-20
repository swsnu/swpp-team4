import React, { useEffect, useState } from 'react';
import MenuBar from '../Component/menuBar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { MarketTableRow } from '../Component/market/marketTableRow';

export const MarketPage = props => {

  const [searchBy, setSearchBy] = React.useState('name');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResult, setSearchResult] = React.useState([]);
  // TODO: id, rank, name, author, liked

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const onSearch = (s) => { // TODO: s is the condition
    try {
      // const response =  axios.post(???)
      // TODO: id, rank, name, author, liked, description, code,
      // setSearchResult()
    } catch (e) {
      console.log(e);
      window.alert('Failed to search snippet!');
      setSearchResult([]);
    }
  };

  const onToggleLiked = (id, value) => {
    try {
      // const response =  axios.post(???)
      // TODO: id, value
      setSearchResult(searchResult.map(e => {
        if (e.id === id) {
          return { ...e, liked: value };
        } else {
          return e;
        }
      }));
    } catch (e) {
      console.log(e);
      window.alert('Failed!');
    }
  };


  useEffect(() => {
    onSearch('rank');
  }, []);


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
            onClick={() => {
              onSearch(searchBy);
            }}
            variant='contained'
            color='primary'
            size='large'
            style={{ marginLeft: 40 }}
            disabled={searchQuery === ''}
          >
            Search
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
                ID
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
            {/*TODO: delete below*/}
            <MarketTableRow
              id={1}
              name={'test Name'}
              author={'chingis'}
              liked={false}
              onLikedChange={(v) => {
                console.log(v);
                onToggleLiked(0, v);
              }}
              description={'This is Snippet whatever lorem epsum dorlorwdalaw fqw df asdcx cc cqw'}
              code={`for index, candidate in enumerate(scope):
            if index==0:
                chosen_stocks.append(candidate)
                break`}
            />

            {searchResult.map(e => <MarketTableRow
              id={1}
              name={'test Name'}
              author={'chingis'}
              liked={false}
              onLikedChange={(v) => {
                console.log(v);
                onToggleLiked(0, v);
              }}
              description={'This is Snippet whatever lorem epsum dorlorwdalaw fqw df asdcx cc cqw'}
              code={`for index, candidate in enumerate(scope):
            if index==0:
                chosen_stocks.append(candidate)
                break`}
            />)
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

