import React from 'react'

export default function TreasureCard(props) {

    

    
    return (
        <div className="ProfileCard" >
            <h1>{props.name}</h1>
            <h3>Initiated by {props.profile}</h3>
            <img src={props.image}/>
            <p>{props.tagline}</p>
            <p>Treasure:{props.treasure} Dero</p>
            <b>Click to See More</b>
        </div>
    )
}