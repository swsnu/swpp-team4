[![BuildStatus](https://travis-ci.com/swsnu/swpp2020-team4.svg?branch=master)](https://travis-ci.com/swsnu/swpp2020-team4)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team4&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team4)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team4/badge.svg)](https://coveralls.io/github/swsnu/swpp2020-team4)

# swpp2020-team4

## https://quant.cash

###How To Run

#### 1. Clone this repository

    git clone https://github.com/swsnu/swpp2020-team4

#### 2. Setup environment for running QuantCash Front & Backend

For now, these steps assume that you are using Windows 10 as all 4 members are developing under such environment.   
Please move to 'front' directory, install npm modules with `yarn`, and start frontend server with `yarn start`

##### (1) setup virtual environment for backend

    cd back
    virtualenv venv
    venv\Scripts\activate.bat

##### (2) run migration

    manage.py migrate

##### (3) install necessary dependencies for backend

    pip install -r requirements.txt
