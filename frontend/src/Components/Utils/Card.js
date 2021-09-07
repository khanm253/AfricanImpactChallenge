import React from 'react'
import '../../Styles/Card.css'
import {Link} from 'react-router-dom'

function Card({imgSrc, title, description, linkPath, buttonText}) {
    return (
        <div className="card">
            <div className="card__image">
                <img src = {imgSrc} alt="ops"/>    
            </div>            
            <div className="card__text">
                <h2>{title}</h2>
                <p className="card__info">{description}</p>
            </div>            
            <div className="card__button">
                    <Link  
                        className="card__link" 
                        to={linkPath} 
                        style={{ textDecoration: 'none', color:'blue' }}
                    >
                        {buttonText}
                    </Link>
            </div>            
        </div>
    )
}

export default Card