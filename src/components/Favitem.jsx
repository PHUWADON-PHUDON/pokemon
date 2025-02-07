import "../style/Favitem.css";

export default function Favitem({id,name,img,unfavourite}) {
    return(
        <div className="Favitem">
            <div>
                <p>{name}</p>
                <img src={img} alt="" />
                <i onClick={() => unfavourite(id)} className="fa-solid fa-heart"></i>
            </div>
        </div>
    );
}