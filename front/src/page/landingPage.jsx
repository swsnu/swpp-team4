import React from 'react';
import {ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import MenuBar from '../Component/menuBar';
import {bigLogo, explain, getStarted} from '../static';
import {Typography} from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import SignupModal from "../Component/signupModal";

export const LandingPage = () => {
    const [signUpAnchorEl, setSignUpAnchorEl] = React.useState(null);
    const handleSignUpClick = (event) => {
        setSignUpAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleSignUpClose = () => {
        setSignUpAnchorEl(null);
    };
    const signUpOpen = Boolean(signUpAnchorEl);

    return (
        <div>
            <MenuBar/>
            <img src={bigLogo} style={{marginTop: 200, width: '40%'}}/>
            <br/>
            <Typography style={{width: '30%'}}>
                It's not easy to make money from stock.
                <br style={{marginTop: 10}}/>
                Start with the items recommended by AI quant.
            </Typography>
            <Button onClick={handleSignUpClick}>
                <img src={getStarted} style={{marginTop: 20, width: '70%'}}/>
            </Button>
            <Popover
                open={signUpOpen}
                anchorEl={signUpAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleSignUpClose}
            >
                <SignupModal/>
            </Popover>
        </div>
    );
};
