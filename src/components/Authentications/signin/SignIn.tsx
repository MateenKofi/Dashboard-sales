import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SignInData } from '../../data/data';
import image from '../../../assets/signin.jpeg';
import logo from '../../../assets/dummy logo.png';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../loaders/Loading';
import ForgetPassword from '../forgetpassword/ForgetPassword';
import ResetPassword from '../forgetpassword/ResetPassword';
import useAuthStore from '../../../store/useAuthStore';
import { UserData } from '../../../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

interface FormValues {
  username: string;
  password: string;
}

const validationSchema: Yup.Schema<FormValues> = Yup.object().shape({
  username: Yup.string().required('username is required'),
  password: Yup.string().required('Password is required'),
});

const SignIn: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  // const logout = useAuthStore((state)=>{state.logout})
  const navigate = useNavigate();
  const [showForgetpassword, setShowForgetPassword] = useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);

  const handleForgetPassword = () => {
    setShowForgetPassword(true);
  };

 const handleSubmit = async (
  values: FormValues,
  { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
) => {
  const userData: UserData = {
    username: values.username,
    password: values.password,
  };
  try {
    setSubmitting(true); // Start submitting
    const user = await login(userData); // Calling login function directly
    console.log('User logged in:', user);
    const token = user.token; // Convert token to string
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    
    // Redirect or perform any necessary actions upon successful login
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    // Display error message to the user
    toast.error('Login failed. Please check your credentials.');
  } finally {
    setSubmitting(false); // End submitting
  }
};

  return (
    <div className="w-full h-screen grid md:grid-cols-2 lg:grid-cols-[2fr,3fr]">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {showForgetpassword && (
        <ForgetPassword
          setShowForgetPassword={setShowForgetPassword}
          setShowResetPassword={setShowResetPassword}
        />
      )}

      {showResetPassword && (
        <ResetPassword setShowResetPassword={setShowResetPassword} />
      )}
      <div className="w-full bg-slate-50 grid items-center p-8">
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="w-full bg-white flex flex-col gap-4 justify-center border-2 p-8 rounded-lg">
              <div className="w-full flex gap-10 justify-start items-center">
                <div>
                  <img
                    src={logo}
                    alt="logo"
                  />
                </div>
                <span className="text-4xl font-medium ">
                  <h1 className="mb-2">Sign In</h1>
                  <div className="w-5/6 bg-blue-600 h-1 rounded-lg"></div>
                </span>
              </div>
              {Object.keys(SignInData).map((key) => (
                <div
                  key={key}
                  className="w-full flex flex-col gap-1">
                  <label
                    htmlFor={key}
                    className="tracking-wider text-lg font-sans font-bold">
                    {SignInData[key as keyof typeof SignInData].label}
                  </label>
                  <Field
                    type={SignInData[key as keyof typeof SignInData].type}
                    id={key}
                    name={key}
                    className="p-2 rounded-lg border-2"
                  />
                  <ErrorMessage
                    name={key}
                    component="div"
                    className="text-red-600"
                  />
                </div>
              ))}
              <button
                className="btn w-full bg-blue-600 text-white text-xl hover:bg-blue-500"
                type="submit"
                disabled={isSubmitting}>
                {isSubmitting ? <Loading /> : 'Sign In'}
              </button>
              <p>
                Don't have an account?{' '}
                <Link
                  to={'signup'}
                  className="text-blue-600">
                  Sign Up
                </Link>
              </p>
              <p>
                <div onClick={handleForgetPassword}>
                  <div className="text-blue-600 cursor-pointer">
                    Forget Password?
                  </div>
                </div>
              </p>
            </Form>
          )}
        </Formik>
      </div>
      <div className="w-full hidden md:grid lg:grid place-items-center ">
        <div>
          <img
            src={image}
            alt="sign image"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
