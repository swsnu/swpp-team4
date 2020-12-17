import React, {useEffect, useState} from 'react';
import MenuBar from "../Component/menuBar";
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

/*istanbul ignore next*/
const createData = (ranking, name, author, profit, description) => {
    return {
        ranking,
        name,
        author,
        profit,
        description
    };
}

/*istanbul ignore next*/
const Row = props => {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton id='row-button' aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell>{row.ranking}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.profit}</TableCell>
                <TableCell align="right">{row.author}</TableCell>
                {/*<TableCell align="right">{row.mdd}</TableCell*/}
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {/*<Typography variant="h6" gutterBottom component="div">
                                Graph
                            </Typography>*/}
                            <Typography variant="h6" gutterBottom component="div">
                                Description
                            </Typography>
                            {row.description}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

/*istanbul ignore next*/
const CollapsibleTable = props => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>id</TableCell>
                        <TableCell>Algorithm</TableCell>
                        <TableCell>Profit</TableCell>
                        <TableCell align="right">Author</TableCell>
                        {/*<TableCell align="right">MDD</TableCell>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <Row key={row.name} row={row}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export const LeaderboardPage = props => {

    const [algoList, setAlgoList] = useState([]);
    const [rows, setRows] = useState([]);

    /*istanbul ignore next*/
    const getAlgorithms = async () => {
        const response = await axios.get('/api/algo/sort');
        if (response.status === 200) {
            setAlgoList(response.data);
            const newRows = algoList.map(algo => createData(algo.rank, algo.name, algo.author,
                algo.profit, algo.description));
            setRows(newRows);
        }
    }

    useEffect(() => {
        getAlgorithms();
    },);

    return (
        <div className='LeaderboardPage'>
            <MenuBar/>
            <CollapsibleTable rows={rows}/>
        </div>
    );
}