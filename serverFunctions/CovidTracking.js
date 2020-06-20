/*  filename: CovidTracking.js
    description: Provides CovidTracking class to make requests to
                    covidtracking.com api for data.
*/

const axios = require('axios');


/*  name: class CovidTracking
    description: Contains methods to request data from covidtracking.com
                    api. No arguments necessary in constructor. Uses
                    axios library. All get methods return promises that 
                    do not resolve until request has been returned.
*/
class CovidTracking {

    constructor(domain = 'https://covidtracking.com/') {
        this.JSON = '.json';
        this.CSV = '.csv';
        this.DAILY = '/daily.json';
        this.CURRENT_JSON = '/current.json';
        this.CURRENT_CSV = '/current.csv';

        this.STATE = '/api/v1/states/';
        this.STATE_DATE = '/api/v1/states/'

        this.US_CURRENT = '/api/v1/us/';

        this.DOMAIN = domain

        this.requestOptions = {

        };
    }

    /******************* Main call methods ****************/
    getUs(date, historic = false) {

        if (historic && date) {
            return this._getUsHistoricDate(date)
        }
        else if (historic) {
            return this._getUsHistoric();
        }
        else {
            return this._getUsCurrent();
        }
    }

    getAllStates(historic = false) {
        if (historic) {
            return this._getAllStatesHistoric();
        }
        else {
            return this._getAllStatesCurrent();
        }
    }

    getState(state, date, historic = false) {
        if (historic && date) {
            return this._getStateHistoricDate(state, date)
        }
        else if (historic) {
            return this._getStateHistoric(state);
        }
        else {
            return this._getStateCurrent(state);
        }
    }
    /***************** Main call methods end ***************/


    /************************** US All **************************/
    //entire US, today's date
    _getUsCurrent() {
        return this._request(this.US_CURRENT + this.CURRENT_JSON)
    }

    //entire US aggregated, all data aggregated
    _getUsHistoric() {
        return this._request(this.US_CURRENT + this.DAILY)
    }

    //entire US aggregated, just on date
    _getUsHistoricDate(date) {
        return this._request(this.US_CURRENT + date + this.JSON)
    }

    /************************** States All **************************/
    //all states, today's date
    _getAllStatesCurrent() {
        return this._request(this.STATE + this.CURRENT_JSON)

    }

    //all states, all data aggregated but separated by state
    _getAllStatesHistoric() {
        return this._request(this.STATE + this.DAILY)
    }

    /************************* Single State *************************/
    //single state, today's date
    _getStateCurrent(state) {
        return this._request(this.STATE + state + this.CURRENT_JSON)
    }

    //single state, all data aggregated
    _getStateHistoric(state) {
        return this._request(this.STATE + state + this.DAILY)
    }

    /*  name: getStateHistoricDate
        description: state should be 2 letter lowercase string, date should be
                        in format yyyymmdd. Returns promise that resolves 
                        after request returns.
    */
    _getStateHistoricDate(state, date) {
        return this._request(this.STATE_DATE + start + '/' + date + JSON)
    }

    /*  name: request
        arguments: resource should be just the path the resource on remote server
        description: return promise that resolves with object of requested data.
    */
    _request(resource) {
        let fqdn = this.DOMAIN + resource;

        return axios.get(fqdn)
            .then(req => {
                return req.data;
            })
    }
}

module.exports = { CovidTracking };
