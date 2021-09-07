import React, {useState, useEffect} from 'react'
import { FormControl,Input,InputLabel } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import { nanoid } from 'nanoid'
import Avatar from '@material-ui/core/Avatar';
import { useFirebase } from "../../Utils/Firebase";
import '../../../Styles/CommentList.css'
import Comment from './Comment';


function CommentList({postID}) {
    
    //All firebase variables and logged in user.
    const firebase = useFirebase();
    const db = firebase.firestore();
    let user = JSON.parse(localStorage.user);

    //States
    const [comments, setcomments] = useState([]);
    const [content, setcontent] = useState('');
    const [newID, setnewID] = useState(nanoid())

    //Handles changes made to the comment input box.
    const handleContentChange = e => {
        setcontent(e.target.value);
        setnewID(nanoid());
    }
    //Gets all comments attached to a specific post from the database.
    useEffect(() => {
        const tempArray = [];
        db.collection("comments").where("postId", "==", postID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tempArray.push(doc.data())
            });
            tempArray.sort( (a,b) => {
                if (a.timestamp < b.timestamp) {
                    return -1;
                }
                else if (a.timestamp == b.timestamp) {
                    return 0;
                }
                else {
                    return 1;
                }
            })
            setcomments(tempArray);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [])

    //Adds comments to the database and state to temporarily show
    //comments under pages.
    function addComment(event){
        event.preventDefault();
        if (content === '') {
            return;
        }
        const temp = {
            content: content,
            authorId: user.userID,
            authorName: user.username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postId: postID,
            commentId: newID,
        }

        db.collection('comments').doc(newID).set({
            content: content,
            authorId: user.userID,
            authorName: user.username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postId: postID,
            commentId: newID,
        })
        .then((docRef) => {
            console.log("added comment to firestore!")
            setcomments([...comments,temp])
        })
        .catch((error) => {
            console.log("Error:",error)
        });

        setcontent('');
    }

    function deleteComment(commentId) {
        function deleteCallBack() {
            console.log("Deleting", commentId);
            // Call fire base to delete the post
            db.collection('comments').doc(commentId).delete()
            .then(
                // on successful change
                (val) => {
                    console.log('Delete Succesful!', val);
                    setcomments( comments.filter( value => 
                        value.commentId !== commentId
                    ));
                },
                // on non-sucessful change
                (err) => {
                    console.log('Error, could not delete!', err);
                }
            );
        }
        return deleteCallBack;
    }


    function editComment(commentId) {
        function editCallBack(content) {
            console.log("Editing", commentId);
            // Call fire base to update the post
            db.collection('comments').doc(commentId).update({
                content: content
            })
            .then(
                // on successful change
                (val) => {
                    console.log('Update Succesful!', val);
                    setcomments(comments.map( comment => {
                        if (comment.commentId === commentId) {
                            comment.content = content;
                        }
                        return comment  
                    }));
                },
                // on non-sucessful change
                (err) => {
                    console.log('Error, could not update!', err);
                }
            );
        }
        return editCallBack;
    }

    
    return (
        <div className="commentList">

            {/*Comemnts creation mechanism */}
            <div className="comment__creation">
                <form>
                    <div className="commentList__form"> 
                            <Avatar className="avatar">{user.username.charAt(0).toUpperCase()}</Avatar>                   
                            <FormControl>
                                <InputLabel>Add a comment!</InputLabel>
                                <Input className="comment__inputbox" value={content} onChange={handleContentChange}></Input>
                            </FormControl>
                    </div>
                    
                    <div className="commentList__btn">
                        <Button 
                            onClick={addComment} 
                            style={{visibility:"hidden"}} 
                            type='submit' variant="contained" 
                            color="primary"
                        >
                            Create Post
                        </Button>
                    </div>
                </form>
            </div>

            {/*List of comments */}
            <div className="comments">
                {comments.map(comment => (
                        <Comment
                            content={comment.content}
                            username={comment.authorName}
                            timestamp={comment.timestamp}
                            role={user.role}
                            deleteCallback={deleteComment(comment.commentId)}
                            editCallBack={editComment(comment.commentId)}
                        />
                    ))}   
            </div>

        </div>
    )
}

export default CommentList
