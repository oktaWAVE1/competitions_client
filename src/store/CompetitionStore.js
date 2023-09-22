import {makeAutoObservable} from "mobx";

export default class CompetitionStore {
    constructor() {

        this._competition = []
        this._currentCompetition = {}
        makeAutoObservable(this)
    }


    setCompetition(competition) {
        this._competition = competition
    }

    get competition() {
        return this._competition
    }

    setCurrentCompetition(currentCompetition) {
        this._currentCompetition = currentCompetition
    }

    get currentCompetition() {
        return this._currentCompetition
    }


}