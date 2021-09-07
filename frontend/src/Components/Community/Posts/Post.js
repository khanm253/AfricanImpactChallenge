import React, {useState,useEffect} from 'react'
import '../../../Styles/Post.css'
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CommentList from './CommentList';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useFirebase } from "../../Utils/Firebase";

function Post({content, username, role, timestamp, media, postId, deleteCallBack, editCallBack}) {
    
    const firebase = useFirebase();
    const db = firebase.firestore();
    let user = JSON.parse(localStorage.user);


    // Used to render comments when user clicks the commnent icon.
    const [commentView, setcommentView] = useState(false);
    
    const [edit, setEdit] = useState(false);
    const [newContent, setNewContent] = useState(content)
    const [isLiked, setisLiked] = useState(false)
    const [likeCount, setlikeCount] = useState(-1)
    
    //Format date to meaningful string.
    let timeToString = '';
    if (timestamp !== null) {
        timeToString = new Date(timestamp.seconds * 1000).toDateString() + ' at ' + new Date(timestamp.seconds * 1000).toLocaleTimeString()
    }

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(newContent);
        editCallBack(newContent);
        setEdit(false);
    }

    const handleLikes = () =>{

        if(isLiked){
            
            //Removed like
            setlikeCount(likeCount-1)
            setisLiked(false)
            
            //Remove user from the list of likers in the post's db collection
            db.collection('posts').doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayRemove(user.userID)
            })
            // On success
            .then((val) => {
                console.log("Removed from LIKES", user.userID)
            })
            // On Error
            .catch((val) => {
                console.log("Could not remove FROM LIKES", user.userID)
            });
        }
        else{
            
            //Added Like
            setlikeCount(likeCount+1)
            setisLiked(true)

            //Add user to the list of likers in the post's db collection
            db.collection('posts').doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayUnion(user.userID)
            })
            // On success
            .then((val) => {
                console.log("Liked", postId);
            })
            // On Error
            .catch((val) => {
                console.log("Could not like", postId);
            });
        }
    }

    useEffect(() => {
        //Get the like count from firestore.
        db.collection('posts').doc(postId).get().then((doc) => {
            if (doc.exists) {
                //doc.data().likes.includes(user.userID) ? setisLiked(true) : null 
                let likers = doc.data().likes
                setlikeCount(likers.length)
                if(likers.includes(user.userID)){
                    setisLiked(true);
                }
                console.log('Like count:', likeCount,likers);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, [])

    return (
        <div className="post">
            
            {/* Part of post that contains caption and media */}
            <div className="post__top">
                <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>
                <h3>
                    {username}
                    <span className="post__timestamp">  { (timeToString === "" ? <></> : timeToString)}</span>
                </h3>
                
                {/* Only show the delete option to moderators and admins */}
                {
                    role != "inaccessible" ? 
                    <div className="post__adminbtns">
                        
                        <div className="post__editbtn" onClick={() => setEdit(!edit)}>
                            <EditIcon/>
                        </div>
                        
                        <div className="post__deletebtn" onClick={deleteCallBack}>
                            <DeleteIcon/>
                        </div>
                    </div> 
                    : 
                    <></> 
                }
                
            </div>

            <div className="post__content">
                <h1>{content}</h1>
            </div>
            
            {/* Only show edit box when edit button is clicked */}
            {edit ?
                <form onSubmit={handleEdit}>
                    <textarea className="post__edit"  name="comment" form="usrform" value={newContent} onChange={(e) => setNewContent(e.target.value)}>
                        
                    </textarea>
                    <input type="submit" value="Submit" />
                </form>
            :
                <></>
            }

            <div className="post__img">
                {media ? <img width="500px" height="350px" src={media}/>:<></>}
            </div>

            <div className="post__actions">
                <div className="post__likes">
                    <ThumbUpAltIcon onClick={handleLikes} className="post__likebtn" style={{color: isLiked? 'blue': null}}/> 
                    <span>{likeCount}</span>
                </div>
                <ChatBubbleIcon onClick={() => setcommentView(!commentView)} className="post__commentbtn"/>
            </div>

            <div className="post__comments">
              {commentView ? <CommentList postID={postId}/> : null}  
            </div>
        </div>
    )
}

export default Post
