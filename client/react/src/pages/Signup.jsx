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
      <div className="container2">
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>  
              <Form className='form2'>
                    <ErrorMessage name="username" component="span" className="error" />
                    <label>Username: </label>
                    <Field
                        id="username"
                        name="username"
                        placeholder="(Ex. Taofeek....)" />
                  <ErrorMessage name="password" component="span" className="error" />
                    <label>Password: </label>
                    <Field
                        className="input"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="(password...)" />
                    <button onClick={() => navigate("/login")} type="submit" className="register">Register</button>
                </Form>
            </Formik>
    </div>
  )
}

export default Signup