import React, { useContext, useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import './Createpost.css';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';
import PostPreview from '../components/PostPreview';

function CreatePosts() {
    const { authState } = useContext(AuthContext); // Access user data from context
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const initialValues = {
        title: '',
        content: '',
        status: 'published',
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

    const handlePreview = (values) => {
        setPreviewData({
            ...values,
            username: authState.username,
        });
        setShowPreview(true);
    };

    const handlePublish = (postData) => {
        setShowPreview(false);
        onSubmit(postData);
    };

    const handleSaveDraft = (postData) => {
        const draftData = {
            ...postData,
            status: 'draft',
        };
        setShowPreview(false);
        onSubmit(draftData);
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
                        {({ values }) => (
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
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => handlePreview(values)}
                                >
                                    Preview
                                </button>
                                <button className="create-post-button" type="submit">
                                    Publish Post
                                </button>
                            </div>
                        </Form>
                        )}
                    </Formik>
                </div>
            </div>
            
            {showPreview && previewData && (
                <PostPreview
                    post={previewData}
                    onClose={() => setShowPreview(false)}
                    onPublish={handlePublish}
                    onSaveDraft={handleSaveDraft}
                />
            )}
        </div>
    );
}

export default CreatePosts;
