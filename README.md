# swpp2020-team4

## https://quant.cash

###How To Run

#### 1. Clone this repository

    git clone https://github.com/swsnu/swpp2020-team4

#### 2. Setup environment for running QuantCash Front & Backend

For now, these steps assume that you are using Windows 10 as all 4 members are developing under such environment.

##### (1) setup virtual environment for backend

    cd back
    virtualenv venv
    venv\Scripts\activate.bat

##### (2) run migration

    manage.py migrate

##### (3) install necessary dependencies for backend

    pip install -r requirements.txt
