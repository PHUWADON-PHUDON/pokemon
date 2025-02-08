import "../style/Search.css";

export default function Search({search,aftersearch,selectSearch}) {
    return(
        <div className="Search">
            <div>
                <input onChange={e => search(e.target.value)} type="text" placeholder="Search" />
            </div>
            {aftersearch.length > 0 ? 
                <div className="listsearch">
                    {aftersearch.map((e,i) => (
                        <p key={i} onClick={() => selectSearch(e)}>{e.name}</p>
                    ))}
                </div>:""
            }
        </div>
    );
}