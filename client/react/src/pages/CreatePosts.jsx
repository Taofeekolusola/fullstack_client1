import React, { useContext, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import './Createpost.css';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';

function CreatePosts() {
    const { authState } = useContext(AuthContext); // Access user data from context
    const navigate = useNavigate();

    const initialValues = {
        title: '',
        content: '',
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login'); // Redirect to login if no token found
        }
    }, [authState.status, navigate]);

    const onSubmit = (data) => {
        const postData = {
            ...data,
            username: authState.username, // Automatically include the logged-in user's username
        };

        // Send post data to backend with userId
        axios.post("https://fullstack-server-side.onrender.com/posts", postData, {
            headers: { token: localStorage.getItem("token") },
        }).then((res) => {
            navigate("/"); // Redirect to home after successful creation
        }).catch((err) => {
            console.error("Error creating post:", err);
        });
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        content: Yup.string().required('Content is required'),
    });

    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className='form'>
                    <ErrorMessage name="title" component="span" className="error" />
                    <label>Title: </label>
                    <Field
                        id="title"
                        name="title"
                        placeholder="(Ex. Title....)" 
                    />
                    
                    <ErrorMessage name="content" component="span" className="error" />
                    <label>Content: </label>
                    <Field
                        id="content"
                        name="content"
                        placeholder="(Ex. ....)" 
                    />
                    
                    <button className='submit' type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePosts;
