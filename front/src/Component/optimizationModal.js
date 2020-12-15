import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

export const OptimizationModal = (props) => {
    const [Parameter, setParameter] = React.useState(
        {
            'learning_rate': [0.0001, 0.05],
            'num_leaves': [300, 600],
            'max_depth': [2, 25],
            'min_child_weight': [30, 100],
            'colsample_bytree': [0, 0.99],
            'feature_fraction': [0.0001, 0.99],
            'bagging_fraction': [0.0001, 0.99],
            'lambda_l1': [0, 0.99],
            'lambda_l2': [0, 0.99],
        }
    );

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
                    id="sign_up_button"
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