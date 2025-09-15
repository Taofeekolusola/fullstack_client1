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
        <div className="page-container">
            <div className="create-post-container">
                <div className="create-post-card">
                    <div className="create-post-header">
                        <h1>Create New Post</h1>
                        <p>Share your thoughts with the community</p>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        <Form className="create-post-form">
                            <div className="form-group">
                                <label htmlFor="title">Post Title</label>
                                <Field
                                    id="title"
                                    name="title"
                                    placeholder="What's your post about?"
                                />
                                <ErrorMessage name="title" component="span" className="error" />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <Field
                                    as="textarea"
                                    id="content"
                                    name="content"
                                    placeholder="Share your thoughts, ideas, or experiences..."
                                    rows="6"
                                />
                                <ErrorMessage name="content" component="span" className="error" />
                            </div>
                            
                            <div className="form-actions">
                                <button className="create-post-button" type="submit">
                                    Publish Post
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default CreatePosts;
