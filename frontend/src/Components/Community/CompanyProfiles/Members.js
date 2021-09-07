import React from 'react'
import { Avatar, Button} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import '../../../Styles/Member.css'

function Members({uid, firstname, lastname, username, creatorId, companyId, handleRemoval}) {
    
    //Current user.
    let user = JSON.parse(localStorage.user);

    return (
        <div className="member">
            <div className="member_info">
                <div className="post__creation__avatar">
                    <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>
                </div>
                <h3>{firstname} {lastname} ({username})</h3>
            </div>
            <div className="member_remove">
                {user.userID == creatorId && user.userID !=uid ? <DeleteIcon onClick={() => handleRemoval(uid)} className="removal_btn"></DeleteIcon>: null}
            </div>
        </div>
    )
}

export default Members
