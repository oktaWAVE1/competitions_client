import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from "./store/UserStore";
import CompetitionStore from "./store/CompetitionStore";
import SportStore from "./store/SportStore";
import LoadingStore from "./store/LoadingStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        competition: new CompetitionStore(),
        sport: new SportStore(),
        loading: new LoadingStore(),
    }}
    >

        <div className='App'>
            <App />
        </div>


    </Context.Provider>
);

