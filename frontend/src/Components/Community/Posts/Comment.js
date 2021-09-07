import React, { useState, useEffect} from 'react'
import Avatar from '@material-ui/core/Avatar';
import '../../../Styles/Comment.css'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

function Comment({content, username, timestamp, role, deleteCallback, editCallBack}) {

    const [edit, setEdit] = useState(false);
    const [newContent, setNewContent] = useState(content)

    useEffect( ()=> {
        setNewContent(content);
    }, [content])

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(newContent);
        editCallBack(newContent);
        setEdit(false);
    }
    return (
        <div className="comment">

            <div className="comment__main">

                <div className="comment__top">
                    <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>  
                    <h3>{content}</h3>
                </div>
            
                {
                    role !== "inaccessible" ? 
                    <div className="comment__btns">
                        <div className="comment__editbtn" onClick={() => setEdit(!edit)}>
                            <EditIcon/>
                        </div>    
                        <div className="comment__deletebtn" onClick={deleteCallback}>
                            <DeleteIcon/>
                        </div>            
                    </div>
                    :
                    <></>
                }
            </div>

            {/* Only show edit box when edit button is clicked */}
            {edit ?
                <form onSubmit={handleEdit}>
                    <textarea className="comment__editform"  name="comment" form="usrform" value={newContent} onChange={(e) => setNewContent(e.target.value)}>
                    </textarea>
                    <br></br>
                    <input type="submit" value="Submit" />
                </form>
                :
                <></>
            }


        </div>
    )
}

export default Comment
