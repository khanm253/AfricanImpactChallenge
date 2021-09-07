import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let date = new Date();
    let user = JSON.parse(localStorage.getItem("user"));
    const [files, setFiles] = useState([]);
    let [formData, setFormData] = useState({ title: '', description: '', duedate: date.toISOString().slice(0, -1), expiry: date.toISOString().slice(0, -1) });
    const fileInput = useRef();

    let firebase = useFirebase();
    let db = firebase.firestore();

    useEffect(() => {
        fileInput.current.value = '';
    }, [files]);

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }

    async function uploadFile(fileObj) {
        let fileId = nanoid();
        let fileRef = firebase.storage().ref().child(fileId);
        await fileRef.put(fileObj);
        let Url = await fileRef.getDownloadURL();
        await firebase.firestore().collection('files').doc(fileId).set({
            fileId: fileId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploaderId: user.userID,
            url: Url,
            name: fileObj.name,
            type: fileObj.type
            // privacy: pri,
        });
        return fileId;
    }

    let handleSubmit = async (e) => {
        e.preventDefault();
        // first we deal with the files, list of promises that will resolve to list of fileIds
        let fileIds = await Promise.all(files.map(file => uploadFile(file)));
        // then we add the assignment with the file ids
        let assId = nanoid();
        await firebase.firestore().collection('assignments').doc(assId).set({
            ...formData,
            assignmentId: assId,
            courseId: courseId,
            creatorId: user.userID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            files: fileIds
        });

        setFiles([]);
        setFormData({ title: '', description: '', duedate: date.toISOString().slice(0, -1), expiry: date.toISOString().slice(0, -1) });
    }

    function fileChange(e) {
        setFiles(old => {
            return ([...old, e.target.files[0]])
        });
    }

    function fileDelete(e) {
        setFiles(old => {
            return Array.from(old).filter(fileObj => fileObj.name !== e.target.id);
        })
    }

    return (
        <div className="column is-8 is-offset-1">
            <h1 className="is-size-4 has-text-left has-text-weight-medium">Create A New Assignment</h1>
            <form onSubmit={handleSubmit}>

                <div class="field is-horizontal has-text-left">
                    <div class="field-body">
                        <div class="field">
                            <label class="label">Title</label>
                            <div class="control">
                                <input class="input" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="ex A2 - Microservices" required />
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Description</label>
                            <div class="control">
                                <textarea class="textarea" type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Assignment body" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal has-text-left">
                    <div class="field-body">
                        <div class="field">
                            <label class="label">Due Date</label>
                            <div class="control has-icons-left">
                                <input class="input" type="datetime-local" name="duedate" value={formData.duedate} onChange={handleChange} />
                                <span class="icon is-small is-left">
                                    <i class="fas fa-calendar-check" />
                                </span>
                            </div>
                            <p class="help">Initial Due Date</p>
                        </div>
                        <div class="field">
                            <label class="label">Expiry Date</label>
                            <div class="control has-icons-left">
                                <input class="input" type="datetime-local" name="expiry" value={formData.expiry} onChange={handleChange} />
                                <span class="icon is-small is-left">
                                    <i class="fas fa-calendar-times" />
                                </span>
                            </div>
                            <p class="help">Late Submissions Acceptance Date</p>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <h1 className="is-size-6 column is-2 has-text-left has-text-weight-medium">Attached Files</h1>
                    <div class="column is-10 level">
                        {Array.from(files).map(file => {
                            return (
                                <span class="tag is-medium m-1" id={file.name}>
                                    {file.name}
                                    <button class="delete is-small" onClick={fileDelete} id={file.name}></button>
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div class="file">
                    <label class="file-label">
                        <input ref={fileInput} class="file-input" onChange={fileChange} name="attachments" type="file" />
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload" />
                            </span>
                            <span class="file-label">
                                Add files…
                            </span>
                        </span>
                    </label>
                </div>
                <div class="control">
                    <button class="button is-primary">Create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateAssignment;
