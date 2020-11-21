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
import axios from 'axios';

export const MarketPage = props => {

  const [searchBy, setSearchBy] = useState('name'); // name, description, author
  const [searchType, setSearchType] = useState('all'); // all, buy, sell, scope ...
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  // TODO: id, rank, name, author, liked

  // TODO: delete, this is for leaderboard backend testing
  useEffect(async () => {
    const res = await axios.get('/api/snippet', { params: { 'type': 'buy', name: 'qwe' } });
    console.log(res.data);

  }, []);

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const onSearch = async (s) => { // TODO: s is the condition
    try {
      // const response =  axios.post(???)
      // TODO: id, rank, name, author, liked, description, code,
      if (s === 'rank') {
        // TODO: search buy rank.
        // const res = await axios.get('/api/snippet', ???? );
        // setSearchResult(res.data);
      } else {
        let param = {};
        if (s !== 'all') {
          param.type = s;
        }
        if (searchBy === 'name') {
          param.name = searchQuery;
        } else if (searchBy === 'description') {
          param.description = searchQuery;
        } else if (searchBy === 'author') {
          param.author_name = searchQuery;
        }
        console.log(param);
        const res = await axios.get('/api/snippet', { params: param });
        // author: 1
        // id: 11
        // code: "k"
        // description: "erf"
        // is_shared: false
        // name: "qwe"
        // type: "buy"
        console.log(res.data);
        setSearchResult(res.data);
      }
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
              onSearch(searchType);
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
        <RadioGroup id="search-by-radio" value={searchBy} onChange={handleSearchByChange} row>
          <FormLabel component="legend" style={{ marginTop: 15, marginRight: 10 }}>
            Search By:
          </FormLabel>
          <FormControlLabel value="name" control={<Radio/>} label="Name"/>
          <FormControlLabel value="author" control={<Radio/>} label="Author"/>
          <FormControlLabel value="description" control={<Radio/>} label="Description"/>
        </RadioGroup>
        <RadioGroup id="search-type-radio" value={searchType} onChange={handleSearchTypeChange} row>
          <FormLabel component="legend" style={{ marginTop: 15, marginRight: 10 }}>
            Search Type:
          </FormLabel>
          <FormControlLabel value="all" control={<Radio/>} label="All"/>
          <FormControlLabel value="scope" control={<Radio/>} label="Scope"/>
          <FormControlLabel value="buy" control={<Radio/>} label="Buy"/>
          <FormControlLabel value="sell" control={<Radio/>} label="Sell"/>
          <FormControlLabel value="amount" control={<Radio/>} label="Amount"/>
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
                Type
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
            {searchResult.map(e => <MarketTableRow
              id={e.id}
              name={e.name}
              author={e.author_name}
              type={e.type}
              liked={false} // TODO
              onLikedChange={(v) => {
                console.log(v);
                onToggleLiked(e.id, v);
              }}
              description={e.description}
              code={e.code}
            />)
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

