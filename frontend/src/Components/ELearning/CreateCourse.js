import React, { useState } from "react";
import { nanoid } from 'nanoid'
import { useHistory } from "react-router";
import { useFirebase } from '../Utils/Firebase';

function CreateCourse(props) {
    let [formData, setFormData] = useState({ title: '', description: '' });
    let history = useHistory();
    let firebase = useFirebase();
    let db = firebase.firestore();

    let handleSubmit = (e) => {
        e.preventDefault();

        let courseId = nanoid();
        db.collection('courses').doc(courseId).set({
            ...formData,
            courseId: courseId
        })
            .then((docRef) => {
                history.push('/home/e-learning');
            })
            .catch((error) => {
                console.log("Error:", error)
            });

        setFormData({ title: '', description: '' });
    }

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }


    return (
        <div className="column is-8 is-offset-1">
            <h1 className="is-size-4 has-text-left has-text-weight-medium">Create A New Course</h1>
            <form onSubmit={handleSubmit}>

                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Title</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input type="text" class="input" name="title" value={formData.title} onChange={handleChange} placeholder="ex. Pre-Incubation" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Question</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <textarea class="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="This course is about ..." required />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="control">
                    <button class="button is-primary">Create</button>
                </div>

            </form>

        </div>
    )
}

export default CreateCourse;
