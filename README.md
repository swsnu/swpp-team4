[![BuildStatus](https://travis-ci.org/swsnu/swpp2020-team4.svg?branch=master)](https://travis-ci.org/swsnu/swpp2020-team4)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team4&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team4)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team4/badge.svg)](https://coveralls.io/github/swsnu/swpp2020-team4)

# swpp2020-team4

## https://quant.cash

### How To Run

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

##### (4) setting up multi-threading environment for the backend
First, you need to have REDIS installed, and have it running in docker environment. 


    (~/back) 
    

##### (5) setting up celery and celery-beats

Open docker quickstart terminal and run following commands
- docker pull redis
- docker run -d -p 6379:6379 (container identifier)
- docker exec -it (container identifier) /bin/sh
- redis-server      

From two other separate terminals, run two following commands
- celery -A qc_back worker --loglevel=info --pool=solo   (pool 옵션은 윈도우에서만 필요함)
- celery -A qc_back beat --scheduler django_celery_beat.schedulers:DatabaseScheduler



