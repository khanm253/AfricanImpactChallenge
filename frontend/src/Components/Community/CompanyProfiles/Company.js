import React from 'react'
import '../../../Styles/Company.css'
import EditIcon from '@material-ui/icons/Edit';
import DocumentList from './DocumentList';

// Company Info Box.
function Company({name, mission, creatorId, members, editCallback}) {
    return (
        <div className="company">

            <div className="company__content">
                <h1>{name}</h1>
            </div>

            <div className="company__content">
                <h2>Mission</h2>
                <i>{mission}</i>
            </div>

            <div className="companies_documents">
                <DocumentList creatorId={creatorId} members={members}/>
            </div>

            <div className="company__actions">
                <EditIcon onClick={() => editCallback(true)} className="company__editbtn" />
            </div>
        </div>
    )
}

export default Company
