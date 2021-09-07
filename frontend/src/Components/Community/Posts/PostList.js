import React, {useState, useEffect} from 'react'
import { FormControl,Input,InputLabel } from '@material-ui/core'
import Post from './Post';
import '../../../Styles/PostList.css'
import { useFirebase } from "../../Utils/Firebase";
import { nanoid } from 'nanoid'
import { Avatar, Button} from "@material-ui/core";

function PostList() {
    
    const firebase = useFirebase();
    const db = firebase.firestore();

    let user = JSON.parse(localStorage.user);
    const [caption, setcaption] = useState('');
    const [image, setImage] = useState(null);
    
    // Need to call setPosts whenever someone deletes a post
    const [posts, setposts] = useState([]);
    const [newID, setnewID] = useState(nanoid())
    
    //Handles changes made to the media input textbox for posts.
    const handleChange = e => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    };

    //Handles changes made to the media input textbox for posts.
    const handleCaptionChange = e => {
        setcaption(e.target.value);
        setnewID(nanoid());
    }

    //Gets all post information whenever user enters the posts page.
    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
            setposts(snapshot.docs.map((doc) => doc.data()))
        ))
    }, [])

    // Async function to upload a file to firebase.
    async function uploadFile() {
        let fileId = nanoid();
        let fileRef = firebase.storage().ref().child(fileId);
        await fileRef.put(image);
        let Url = await fileRef.getDownloadURL();
        await firebase.firestore().collection('files').doc(fileId).set({
            fileId: fileId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploaderId: user.userID,
            url: Url,
            name: image.name,
            type: image.type
            // privacy: pri,
        });
        return [fileId,Url]; 
    }

    //Adds posts and it's corresponding information to the firestore database.
    async function addPost(event){

        event.preventDefault();

        // If there is no caption for the post, then we don't create it
        if (!caption) {
            console.log('There is no caption');
            return;
        }
        // In the case an image is attached, we first upload it to firebase.\
        let fileId = '';
        let url = '';
        if (image !== null) {
            [fileId, url] = await uploadFile(image);
            console.log('Uploaded image to firebase');
        }
        // Add the post to firebase
        db.collection('posts').doc(newID).set({
            content: caption,
            authorId: user.userID,
            authorName: user.username,
            likes: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            privacy: 'public',
            attachments:[],
            postId: newID,
            fileId: fileId,
            url: url
        })
        .then((docRef) => {
            console.log("added post to firestore!")
        })
        .catch((error) => {
            console.log("Error:",error)
        });
        setcaption('');
        setImage(null);
        
    }

    // Called when an admin or mod clicks delete post!
    function deletePost(postId, fileId) {
        // Each comment will have it's own callback function for deleting posts
        function deleteCallBack() {
            const fileID = fileId;
            console.log("Deleting", postId);

            // Call fire base to delete the post
            db.collection('posts').doc(postId).delete()
            .then(
                // on successful change
                (val) => {
                    console.log('Delete Post Succesful!', val);
                    setposts( posts.filter( (value) => {
                        return value.postId !== postId;
                    }));
                },
                // on non-sucessful change
                (err) => {
                    console.log('Error, Post could not delete!', err);
                }
            );

            // Delete fire base to delete the file for the post 
            if (fileID !== '') {
                db.collection('files').doc(fileID).delete()
                .then(
                    // on successful change
                    (val) => {
                        console.log('Delete File Succesful!', val);
                    },
                    // on non-sucessful change
                    (err) => {
                        console.log('Error, File could not delete!', err);
                    }
                );
            }

            // Delete all comments attached to posts
            db.collection("comments").where("postId", "==", postId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                
                    db.collection('comments').doc(doc.data().commentId).delete()
                    .then(
                        // on successful change
                        (val) => {
                            console.log('Delete Comment Succesful!', val);
                        },
                        // on non-sucessful change
                        (err) => {
                            console.log('Error, Comment could not delete!', err);
                        }
                    );
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        }
        return deleteCallBack;
    }

    function editPost(postId) {
        function editCallBack(content) {
            console.log("Editing", postId);
            // Call fire base to update the post
            db.collection('posts').doc(postId).update({
                content: content
            })
            .then(
                // on successful change
                (val) => {
                    console.log('Update Succesful!', val);
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
        <div className="postList">
            
            {/*Post Creation mechanism*/}
            <div className= "postList__creation">
                
                <div className="post__creation__avatar">
                    <Avatar className="avatar">{user.username.charAt(0).toUpperCase()}</Avatar>
                </div>
                
                <form>
                    <div className="postList__form">                    
                            <FormControl>
                                <InputLabel>Add a caption!</InputLabel>
                                <Input className="inputbox" value={caption} onChange={handleCaptionChange}></Input>
                            </FormControl>
                    </div>
                    
                    <div className="postList__media">
                        <input className="filebtn" type="file" onChange={handleChange} />
                    </div>

                    <div className="postList__btn">
                        <Button 
                            onClick={addPost} 
                            disabled={!caption} 
                            type='submit' 
                            variant="contained" 
                            color="primary"
                        >
                            Create Post
                        </Button>
                    </div>
                </form>

            </div>
            
            {/* List of all posts */}
            <div className="postList__posts">
                {posts.map(post => (
                    <Post
                        key={post.postId}
                        content={post.content}
                        username={post.authorName}
                        role={user.role}
                        timestamp={post.timestamp}
                        media={post.url}
                        postId={post.postId} 
                        editCallBack={editPost(post.postId)}
                        deleteCallBack={deletePost(post.postId, post.fileId)}
                    />
                ))}                
            </div>
            
        </div>
    )
}

export default PostList
