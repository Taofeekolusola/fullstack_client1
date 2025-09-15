import {React, useState} from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios"
import './Signup.css'
import {useNavigate} from'react-router-dom'


function Signup() {
    const [posts, setPosts] = useState([])
    let navigate = useNavigate()

    const initialValues = {
        username: '',
        password: ''
    }
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required('Name is required'),
        password: Yup.string().min(4).max(20).required('password is required'),
    });
    const onSubmit = (data) => {
        axios.post("https://fullstack-server-side.onrender.com/users/signup", data).then((res) => { 
            setPosts(res.data);
          })
    }
  return (
      <div className="page-container">
          <div className="auth-container">
              <div className="auth-card">
                  <div className="auth-header">
                      <h1>Create Account</h1>
                      <p>Join our community and start sharing your thoughts</p>
                  </div>
                  <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>  
                      <Form className="auth-form">
                          <div className="form-group">
                              <label htmlFor="username">Username</label>
                              <Field
                                  id="username"
                                  name="username"
                                  placeholder="Choose a username"
                              />
                              <ErrorMessage name="username" component="span" className="error" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="password">Password</label>
                              <Field
                                  id="password"
                                  name="password"
                                  type="password"
                                  placeholder="Create a secure password"
                              />
                              <ErrorMessage name="password" component="span" className="error" />
                          </div>
                          <button onClick={() => navigate("/login")} type="submit" className="auth-button">
                              Create Account
                          </button>
                      </Form>
                  </Formik>
                  <div className="auth-footer">
                      <p>Already have an account? <a href="/login">Sign in</a></p>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Signup