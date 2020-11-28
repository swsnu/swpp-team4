import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';

export const NewBackTestForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startingBudget, setStartingBudget] = useState(2000);

  return (
    <>
      <Typography variant="h6" component="div" style={{ marginTop: 24 }}>
        Start New Backtest
      </Typography>
      <div
        style={{
          // display: 'flex',
          // justifyContent: 'right',
          padding: 16,
        }}
      >
        <TextField
          id="newBacktest-startDate"
          helperText="Start Date"
          size="small"
          type="date"
          style={{ marginRight: 16 }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          id="newBacktest-endDate"
          helperText="End Date"
          size="small"
          type="date"
          style={{ marginRight: 16 }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <TextField
          id="newBacktest-startingBudget"
          helperText="Starting Budget"
          size={'small'}
          type={'number'}
          inputProps={{ step: 10000 }}
          style={{ marginRight: 16 }}
          value={startingBudget}
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value !== '') {
              setStartingBudget(Number(e.target.value));
            }
          }}
        />
        <Button
          id="newBacktest-submit"
          onClick={() => {
            onSubmit({
              startDate,
              endDate,
              startingBudget,
            });
          }}
          variant="contained"
          color="primary"
          style={{ marginTop: 'auto' }}
          disabled={
            startDate === '' ||
            endDate === '' ||
            startDate >= endDate ||
            startingBudget <= 0
          }
        >
          Initiate
        </Button>
      </div>
    </>
  );
};
