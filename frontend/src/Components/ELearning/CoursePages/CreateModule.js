import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));

    let [formData, setFormData] = useState({ title: '' });
    let [modItems, setModItems] = useState([]);
    let [allItems, setAllItems] = useState([]);

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [lessons, lessLoading, lessError] = useCollectionDataOnce(db.collection("lessons").where('courseId', '==', courseId));
    const [assigns, assLoading, assError] = useCollectionDataOnce(db.collection("assignments").where('courseId', '==', courseId));


    useEffect(() => {
        if (lessons && assigns) {
            let list = [];
            assigns.forEach((item) => {
                list.push({
                    id: item.assignmentId,
                    title: item.title,
                    type: 'assignment'
                })
            })
            lessons.forEach((item) => {
                list.push({
                    id: item.lessonId,
                    title: item.title,
                    type: 'lesson'
                })
            })
            setAllItems(old => list);
        }
    }, [lessons, assigns])

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }

    let handleSubmit = async (e) => {
        e.preventDefault();
        let modId = nanoid();
        await firebase.firestore().collection('modules').doc(modId).set({
            ...formData,
            moduleId: modId,
            courseId: courseId,
            creatorId: user.userID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: modItems
        });
        setFormData({ title: '' });
        setModItems([]);
    }

    function handleAdd(e) {
        let a = {
            id: e.currentTarget.getAttribute('id'),
            type: e.currentTarget.getAttribute('data-type'),
            title: e.currentTarget.getAttribute('data-title'),
        }
        setModItems(old => {
            return ([...old, a])
        });
    }

    function handleDelete(e) {
        let t = e.currentTarget.id;
        setModItems(old => {
            return modItems.filter(item => item.id !== t);
        })
    }

    return (
        <div className="column is-10 columns is-multiline is-centered">
            <h1 className="is-size-4 has-text-left has-text-weight-medium column is-full">Create A New Module</h1>
            <div className="column is-7">
                <form id="mod" onSubmit={handleSubmit}>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Title</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <p class="control">
                                    <input class="input" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter a Module Name" required />
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="column is-half">
                <table class="table  is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Course Items</th>
                            <th>Item Type</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.filter((item) => {
                            return (!(modItems.map(item => item.id).includes(item.id)))
                        }).map((item) => {
                            return (
                                <tr id={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <button class="button is-success is-outlined" id={item.id} data-title={item.title} data-type={item.type} onClick={handleAdd}>
                                            <span>Add</span>
                                            <span class="icon is-small">
                                                <i class="fas fa-plus"></i>
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className="column is-half">
                <table class="table  is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Module Item</th>
                            <th>Item Type</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {modItems.map((item) => {
                            return (
                                <tr id={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <button class="button is-danger is-outlined" id={item.id} data-title={item.title} data-type={item.type} onClick={handleDelete}>
                                            <span>Remove</span>
                                            <span class="icon is-small">
                                                <i class="fas fa-times"></i>
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <input type="submit" form="mod" class="button is-info" value="Create Module" />
        </div>
    )
}

export default CreateAssignment;
