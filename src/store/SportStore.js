import {makeAutoObservable} from "mobx";

export default class SportStore {
    constructor() {

        this._sport = []
        this._currentSport = {}
        makeAutoObservable(this)
    }


    setSport(sport) {
        this._sport = sport
    }

    get sport() {
        return this._sport
    }

    setCurrentSport(currentSport) {
        this._competitionSport = currentSport
    }

    get (currentSport) {
        return this._currentSport
    }


}