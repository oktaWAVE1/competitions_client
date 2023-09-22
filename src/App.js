import './App.css';
import {BrowserRouter} from "react-router-dom";
import Footer from "./components/footer/Footer";
import AppRouter from "./components/appRouter";
import MyNavbar from "./components/navbar/MyNavbar";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import Loader from "./UI/Loader/Loader";
import {check} from "./http/userAPI";
import {observer} from "mobx-react-lite";

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        check().then(data => {
            if(typeof data === 'object') {
                user.setUser(data);
                user.setIsAuth(true);
            }
        }).finally(() => {
            setLoading(false)
        })
    },[])
    if(loading) {
        return <Loader />
    }
    return (
      <BrowserRouter>

        <MyNavbar/>
        <div className="mainContainer">
          <AppRouter/>
        </div>

        <Footer/>
      </BrowserRouter>
  );
})

export default App;
