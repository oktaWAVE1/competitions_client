import {makeAutoObservable} from "mobx";

export default class LoadingStore {
    constructor() {

        this._loading = true
        this._refresh = 1
        makeAutoObservable(this)
    }


    setLoading(loading) {
        this._loading = loading
    }

    get loading() {
        return this._loading
    }

    setRefresh(refresh) {
        this._refresh = refresh
    }

    get refresh() {
        return this._refresh
    }


}