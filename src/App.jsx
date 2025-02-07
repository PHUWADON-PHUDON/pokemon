import { useState,useEffect } from "react";
import axios from "axios";
import Preload from "./components/Preload";

function App() {
  const [poke,setpoke] = useState(null);

  //! load data
  
  useEffect(() => {
    const abortcontroller = new AbortController();

    const loaddata = async () => {
      try{
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/1",{signal:abortcontroller.signal});
        if (response.status == 200) {
          setpoke(response.data);
        }
      }
      catch{}
    }

    loaddata();

    return () => abortcontroller.abort();
  },[]);

  //!

  return(
    <div>
      
    </div>
  );
}

export default App;
