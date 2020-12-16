import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

export const OptimizationModal = (props) => {
    const [Parameter, setParameter] = React.useState(
        {
            'Parameter 1': [0.0001, 0.05],
            'Parameter 2': [300, 600],
            'Parameter 3': [2, 25],
        }
    );

    const [index, setIndex] = React.useState(4);

    const handleChange = (e) => {
        const name = e.target.name.split(" ");
        let newParameter = Parameter;
        if (name[1] === 'max') {
            newParameter[name[0]][1] = e.target.value;
        }
        else if (name[1] === 'min') {
            newParameter[name[0]][0] = e.target.value;
        }
        setParameter(newParameter);
    };

    const handleSubmit = async () => {
        props.handlePending();
    };

    const handleVariable = async () => {
        let newParameter = Parameter;
        newParameter["Parameter " + index] = [];
        setIndex(index + 1);
        setParameter(newParameter);
    };

    return (
        <div className="SignupModal">
            <Paper elevation={3} style={{padding: 10}}>
                {Object.keys(Parameter).map(key => {
                    return (
                        <div>
                            {key}
                            <br/>
                            <TextField
                                name={key + ' min'}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                            />
                            ~
                            <TextField
                                name={key + ' max'}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                            />
                            <br/>
                        </div>
                    )
                })}
                <Button
                    onClick={handleVariable}
                    fullWidth
                    style={{marginTop: 10}}
                >
                    New Variable
                </Button>
                <Button
                    onClick={handleSubmit}
                    fullWidth
                    style={{marginTop: 10}}
                >
                    Submit
                </Button>
            </Paper>
        </div>
    );
};