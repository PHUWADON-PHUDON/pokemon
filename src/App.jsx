import "./App.css";
import { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Preload from "./components/Preload";
import Favitem from "./components/Favitem";
import Search from "./components/Search";
import Infomation from "./components/Infomation";

function App() {
  const [wait,setwait] = useState(false);
  const [poke,setpoke] = useState(null);
  const [pokefav,setpokefav] = useState([]);
  const [countid,setcountid] = useState(1);
  const [datasearch,setdatasearch] = useState([]);
  const [aftersearch,setaftersearch] = useState([]);
  const [isinfomation,setisinfomation] = useState(false);

  //! load data
  
  useEffect(() => {
    const abortcontroller = new AbortController();
    const abortcontroller2 = new AbortController();
    const abortcontroller3 = new AbortController();

    const loaddata = async () => {
      try{
        let id = parseInt(Cookies.get("id"));
        if (!id) {
          Cookies.set("id",1,{expires:30});
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

    const loadFav = async () => {
      const favid = Cookies.get("favid") ? JSON.parse(Cookies.get("favid")):[];
      
      if (favid != "") {
        let arr = [];

        try{
          for (let e of favid) {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${e}`,{signal:abortcontroller2.signal});
            if (response.status == 200) {
              arr.push(response.data);
            }
          }
        }
        catch{}

        setpokefav(arr);
      }
    }

    const loaddatasearch = async () => {
      try{
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`,{signal:abortcontroller3.signal});
        if (response.status == 200) {
          setdatasearch(response.data.results);
        }
      }
      catch{}
    }

    loaddata();
    loadFav();
    loaddatasearch();

    return () => {
      abortcontroller.abort();
      abortcontroller2.abort();
      abortcontroller3.abort();
    };
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
        Cookies.set("id",parseInt(id - 1),{expires:30});
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
        console.log(response.data)
        setwait(true);
        setpoke(response.data);
        Cookies.set("id",parseInt(id + 1),{expires:30});
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
        Cookies.set("favid",JSON.stringify(arrfavid),{expires:30});
        setpokefav(prev => [...pokefav,poke]);
      }
      else {
        const newarrfavid = arrfavid.filter(e => {
          if (e != id) {
            return(e);
          }
        });
        Cookies.set("favid",JSON.stringify(newarrfavid),{expires:30});

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
      Cookies.set("favid",JSON.stringify(favid),{expires:30});
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
    Cookies.set("favid",JSON.stringify(newarrfavid),{expires:30});

    const newarrpokefav = pokefav.filter(e => {
      if (e.id != id) {
        return(e);
      }
    });

    setpokefav(prev => newarrpokefav);
  }

  //!

  //! search

  const search = (text) => {
    if (text != "") {
      let arrsearch = datasearch.filter(e => {
        if (e.name.includes(text)) {
          return(e);
        }
      });
  
      setaftersearch(prev => arrsearch);
    }
    else {
      setaftersearch(prev => []);
    }
  }

  const selectSearch = async (value) => {
    const abortcontroller = new AbortController();

    try{
      setwait(false);
      const response = await axios.get(value.url,{signal:abortcontroller.signal});
      if (response.status == 200) {
        Cookies.set("id",response.data.id,{expires:30});
        setpoke(prev => response.data);
        setaftersearch(prev => []);
        setwait(true);
      }
    }
    catch{}

    return () => abortcontroller.abort();
  }

  //!

  //!infomation

  const infomation = () => {
    setisinfomation(!isinfomation);
  }

  //!

  return(
    <div className="App">
      {wait ? 
        <>
          <Search search={search} aftersearch={aftersearch} selectSearch={selectSearch}/>
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
              <img src={poke.sprites.other["official-artwork"].front_default} alt="" />
              <div className="btnprevandnext">
                <i onClick={() => prev()} className="fa-solid fa-chevron-left"></i>
                <i onClick={() => infomation()} className="fa-solid fa-circle-info"></i>
                <i onClick={() => next()} className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
            <div className="boxright">
              <p>Favourite Pokemon</p>
              <div className="favcontainer">
                {pokefav.map((e,i) => (
                  <Favitem key={i} id={e.id} name={e.name} img={e.sprites.other["official-artwork"].front_default} unfavourite={unfavourite}/>
                ))}
              </div>
            </div>
            <Infomation infomation={infomation} isinfomation={isinfomation} poke={poke}/>
          </div>
        </>
        :<Preload/>}
    </div>
  );
}

export default App;
