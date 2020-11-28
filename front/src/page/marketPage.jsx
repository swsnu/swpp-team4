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
import { useSelector, useDispatch } from 'react-redux';

export const MarketPage = () => {
  const [searchBy, setSearchBy] = useState('name'); // name, description, author
  const [searchType, setSearchType] = useState('all'); // all, buy, sell, scope ...
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  // id, rank, name, author, liked
  const userInfo = useSelector((s) => s.user.userInfo);

  const handleSearchByChange = (e) => {
    console.log(e.target.value);
    setSearchBy(e.target.value);
  };
  const handleSearchTypeChange = (e) => {
    console.log(e.target.value);
    setSearchType(e.target.value);
  };

  const onSearch = async (s) => {
    try {
      if (s === 'rank') {
        console.log('rank search');
        // TODO: search by rank.
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
        } else {
          // searchBy === 'author'
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
        // liker_list: [{id: 1, username: "test"}]
        console.log(res.data);
        setSearchResult(res.data);
      }
    } catch (e) {
      console.log(e);
      window.alert('Failed to search snippet!');
      setSearchResult([]);
    }
  };

  const onToggleLiked = async (id, value) => {
    try {
      const changed_snippet = await axios.post('/api/like/snippet', {
        id,
        value,
      });
      setSearchResult(
        searchResult.map((e) =>
          e.id === changed_snippet.data.id ? changed_snippet.data : e,
        ),
      );
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
      <MenuBar />
      <Typography variant="h5">Search Snippet</Typography>
      <br />

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
            variant="contained"
            color="primary"
            size="large"
            style={{ marginLeft: 40 }}
            disabled={searchQuery === ''}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <FormControl component="fieldset" style={{ marginBottom: 20 }}>
        <RadioGroup
          id="search-by-radio"
          value={searchBy}
          onChange={handleSearchByChange}
          row
        >
          <FormLabel
            component="legend"
            style={{ marginTop: 15, marginRight: 10 }}
          >
            Search By:
          </FormLabel>
          <FormControlLabel
            value="name"
            control={<Radio />}
            label="Name"
            id="search-by-name"
          />
          <FormControlLabel
            value="author"
            control={<Radio />}
            label="Author"
            id="search-by-author"
          />
          <FormControlLabel
            value="description"
            control={<Radio />}
            label="Description"
            id="search-by-description"
          />
        </RadioGroup>
        <RadioGroup
          id="search-type-radio"
          value={searchType}
          onChange={handleSearchTypeChange}
          row
        >
          <FormLabel
            component="legend"
            style={{ marginTop: 15, marginRight: 10 }}
          >
            Search Type:
          </FormLabel>
          <FormControlLabel
            value="all"
            control={<Radio />}
            label="All"
            id="search-type-all"
          />
          <FormControlLabel
            value="scope"
            control={<Radio />}
            label="Scope"
            id="search-type-scope"
          />
          <FormControlLabel
            value="buy"
            control={<Radio />}
            label="Buy"
            id="search-type-buy"
          />
          <FormControlLabel
            value="sell"
            control={<Radio />}
            label="Sell"
            id="search-type-sell"
          />
          <FormControlLabel
            value="amount"
            control={<Radio />}
            label="Amount"
            id="search-type-amount"
          />
        </RadioGroup>
      </FormControl>

      <TableContainer
        component={Paper}
        style={{ overflowY: 'auto', minHeight: 700 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Author</TableCell>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Liked</TableCell>
              <TableCell align="right">Expand</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResult.map((e) => (
              <MarketTableRow
                key={e.id}
                id={e.id}
                name={e.name}
                author={e.author_name}
                type={e.type}
                liked={e.liker_list
                  .map((z) => z.username)
                  .includes(userInfo.username)}
                onLikedChange={(v) => {
                  console.log(v);
                  onToggleLiked(e.id, v);
                }}
                description={e.description}
                code={e.code}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
