import { useEffect,useRef,useState } from "react";
import "../style/Infomation.css";

export default function Infomation({infomation,isinfomation,poke}) {
    const [width,setwidth] = useState(null);
    const [ability,setability] = useState([]);
    const [type,settype] = useState([]);
    const infomationref = useRef(null);

    //!cal width responsive infomation and get data from poke

    useEffect(() => {
        if (infomationref.current) {
            const width = infomationref.current.offsetWidth;
            // infomationref.current.style.right = `-${width}px`
            setwidth(width);
        }

        const newabilityarray = poke.abilities.map((e) => e.ability.name);
        const newtypearray = poke.types.map((e) => e.type.name);
    
        setability(newabilityarray);
        settype(newtypearray);
    },[]);

    //!

    return(
        <div ref={infomationref} className="Infomation" style={isinfomation ? {transform:`translateX(-${width}px)`,right:`-${width}px`}:{right:`-${width}px`}}>
            <i onClick={() => infomation()} className="fa-solid fa-xmark"></i>
            <p>Name:<span>{poke.name}</span></p>
            <p>Weight:<span>{poke.weight}</span></p>
            <p>Height:<span>{poke.height}</span></p>
            <p>Abilities:<span>{ability.join(" , ")}</span></p>
            <p>Type:<span>{type.join(" , ")}</span></p>
            <h3>STATS</h3>
            <div className="boxstats">
                <div>
                {poke.stats.map((e,i) => (
                    <p key={i}>{e.stat.name}</p>
                ))}
                </div>
                <div>
                {poke.stats.map((e,i) => (
                    <p key={i}>{e.base_stat}</p>
                ))}
                </div>
            </div>
        </div>
    );
}