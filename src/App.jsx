import "./App.css";
import { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Preload from "./components/Preload";
import Favitem from "./components/Favitem";
import Search from "./components/Search";

function App() {
  const [wait,setwait] = useState(false);
  const [poke,setpoke] = useState(null);
  const [pokefav,setpokefav] = useState([]);
  const [countid,setcountid] = useState(1);

  //! load data
  
  useEffect(() => {
    const abortcontroller = new AbortController();

    const loaddata = async () => {
      try{
        let id = parseInt(Cookies.get("id"));
        if (!id) {
          Cookies.set("id",1);
          id = 1;
        }

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`,{signal:abortcontroller.signal});
        if (response.status == 200) {
          setpoke(response.data);
          setwait(true);
        }
      }
      catch{}
    }

    loaddata();

    return () => abortcontroller.abort();
  },[]);

  useEffect(() => {
    const abortcontroller = new AbortController();

    const loadFav = async () => {
      const favid = Cookies.get("favid") ? JSON.parse(Cookies.get("favid")):[];
      
      if (favid != "") {
        let arr = [];

        try{
          for (let e of favid) {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${e}`,{signal:abortcontroller.signal});
            if (response.status == 200) {
              arr.push(response.data);
            }
          }
        }
        catch{}

        setpokefav(arr);
      }
    }

    loadFav();

    return () => abortcontroller.abort();
  },[]);

  //!

  //! btn prev and next

  const prev = async () => {
    const abortcontroller = new AbortController();

    try{
      setwait(false);
      let id = parseInt(Cookies.get("id"));
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id - 1}`,{signal:abortcontroller.signal});
      if (response.status == 200) {
        setwait(true);
        setpoke(response.data);
        Cookies.set("id",parseInt(id - 1));
      }
    }
    catch{
      setwait(true);
    }

    return () => abortcontroller.abort();
  }

  const next = async () => {
    const abortcontroller = new AbortController();

    try{
      setwait(false);
      let id = parseInt(Cookies.get("id"));
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id + 1}`,{signal:abortcontroller.signal});
      if (response.status == 200) {
        setwait(true);
        setpoke(response.data);
        Cookies.set("id",parseInt(id + 1));
      }
    }
    catch{
      setwait(true);
    }

    return () => abortcontroller.abort();
  }

  //!

  //! click favourite and unfavourite

  const favourite = async (id) => {
    let favid = Cookies.get("favid");
    
    if (favid) {
      let arrfavid = JSON.parse(favid);
      let checkid = arrfavid.includes(id);

      if (!checkid) {
        arrfavid.push(id);
        Cookies.set("favid",JSON.stringify(arrfavid));
        setpokefav(prev => [...pokefav,poke]);
      }
      else {
        const newarrfavid = arrfavid.filter(e => {
          if (e != id) {
            return(e);
          }
        });
        Cookies.set("favid",JSON.stringify(newarrfavid));

        const newarrpokefav = pokefav.filter(e => {
          if (e.id != id) {
            return(e);
          }
        });

        setpokefav(prev => newarrpokefav);
      }
    }
    else {
      favid = [id];
      Cookies.set("favid",JSON.stringify(favid));
      setpokefav(prev => [...pokefav,poke]);
    }
  }

  const unfavourite = (id) => {
    let favid = Cookies.get("favid");
    let arrfavid = JSON.parse(favid);

    const newarrfavid = arrfavid.filter(e => {
      if (e != id) {
        return(e);
      }
    });
    Cookies.set("favid",JSON.stringify(newarrfavid));

    const newarrpokefav = pokefav.filter(e => {
      if (e.id != id) {
        return(e);
      }
    });

    setpokefav(prev => newarrpokefav);
  }

  //!

  return(
    <div className="App">
      {wait ? 
        <>
          <Search/>
          <div className="container">
            <div className="boxleft">
              <h1>{poke.name}</h1>
              <p>
                {pokefav.some(e => e.id == poke.id) ? 
                  <i onClick={() => favourite(poke.id)} className="fa-solid fa-heart"></i>
                  :
                  <i onClick={() => favourite(poke.id)} className="fa-regular fa-heart"></i>
                }
              </p>
              <img src={poke.sprites.other.dream_world.front_default} alt="" />
              <div className="btnprevandnext">
                <i onClick={() => prev()} className="fa-solid fa-chevron-left"></i>
                <i onClick={() => next()} className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
            <div className="boxright">
              <p>Favourite Pokemon</p>
              <div className="favcontainer">
                {pokefav.map((e,i) => (
                  <Favitem key={i} id={e.id} name={e.name} img={e.sprites.other.dream_world.front_default} unfavourite={unfavourite}/>
                ))}
              </div>
            </div>
          </div>
        </>
        :<Preload/>}
    </div>
  );
}

export default App;
