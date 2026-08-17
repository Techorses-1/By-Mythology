import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AuthPage.scss";

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password States
    const [showForgotModel, setShowForgotModel] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotOtp, setForgotOtp] = useState("");
    const [forgotPassword, setForgotPassword] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Login Validation Schema
    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    // Register Validation Schema
    const registerSchema = Yup.object({
        name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        mobile: Yup.string()
            .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
            .required("Mobile number is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    // Login Handler
    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email: values.email,
                password: values.password,
            });

            toast.success("Login Successful! 🎉", { position: "top-right", autoClose: 2000 });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed", { position: "top-right", autoClose: 4000 });
        } finally {
            setIsLoading(false);
        }
    };

    // Register Handler
    const handleRegister = async (values, { resetForm, setSubmitting }) => {
        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
                name: values.name,
                email: values.email,
                password: values.password,
                mobile: values.mobile,
            });

            toast.success("Registration Successful! 🎉 Please login", { position: "top-right", autoClose: 3000 });
            resetForm();
            setTimeout(() => setIsLogin(true), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong", { position: "top-right", autoClose: 4000 });
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    // FORGOT PASSWORD HANDLERS
    const handleSendOtp = async () => {
        if (!forgotEmail.trim()) {
            toast.error("Please enter your email", { position: "top-right" });
            return;
        }
        setOtpLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, { email: forgotEmail });
            if (res.data.success) {
                setForgotStep(2);
                toast.success("OTP sent to your email", { position: "top-right" });
                setResendTimer(60);
                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) { clearInterval(timer); return 0; }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP", { position: "top-right" });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!forgotOtp.trim() || forgotOtp.length !== 4) {
            toast.error("Please enter valid 4-digit OTP", { position: "top-right" });
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify-otp`, { email: forgotEmail, otp: forgotOtp });
            if (res.data.success) {
                setForgotStep(3);
                toast.success("OTP verified", { position: "top-right" });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP", { position: "top-right" });
        }
    };

    const handleResetPassword = async () => {
        if (!forgotPassword.trim() || forgotPassword.length < 6) {
            toast.error("Password must be at least 6 characters", { position: "top-right" });
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/reset-password`, { email: forgotEmail, newPassword: forgotPassword });
            if (res.data.success) {
                toast.success("Password reset successful! Please login", { position: "top-right", autoClose: 3000 });
                setTimeout(() => {
                    setShowForgotModel(false);
                    resetForgotFlow();
                }, 2000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password", { position: "top-right" });
        }
    };

    const resetForgotFlow = () => {
        setForgotStep(1);
        setForgotEmail("");
        setForgotOtp("");
        setForgotPassword("");
        setResendTimer(0);
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />

            <div className="auth-page">
                <div className="auth-container">

                    {/* LEFT SIDE - IMAGE (Desktop only) */}
                    <div className="auth-image">
                        <div className="auth-image-wrapper">
                            <img
                                src="https://images.pexels.com/photos/2609105/pexels-photo-2609105.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Luxury Candle"
                                className="auth-image-img"
                            />
                            <div className="auth-image-overlay">
                                <div className="auth-image-content">
                                    <h2 className="auth-image-title">The Ramayana</h2>
                                    <p className="auth-image-subtitle">Scented Candles</p>
                                    <div className="auth-image-divider"></div>
                                    <p className="auth-image-text">
                                        Illuminate your space with divine essence<br />
                                        Each candle tells a story of devotion,<br />
                                        courage, love and dharma.
                                    </p>
                                    <div className="auth-image-quote">
                                        "Light a candle. Begin your sacred journey."
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - FORM */}
                    <div className="auth-form">
                        <div className="auth-form-container">

                            {/* Toggle Buttons */}
                            <div className="auth-toggle">
                                <button
                                    className={`auth-toggle-btn ${isLogin ? "active" : ""}`}
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login
                                </button>
                                <button
                                    className={`auth-toggle-btn ${!isLogin ? "active" : ""}`}
                                    onClick={() => setIsLogin(false)}
                                >
                                    Register
                                </button>
                            </div>

                            {/* LOGIN FORM */}
                            {isLogin ? (
                                <>
                                    <div className="auth-header">
                                        <h1 className="auth-title">Welcome Back</h1>
                                        <p className="auth-subtitle">Sign in to your account</p>
                                    </div>

                                    <Formik
                                        initialValues={{ email: "", password: "" }}
                                        validationSchema={loginSchema}
                                        onSubmit={handleLogin}
                                    >
                                        {({ errors, touched }) => (
                                            <Form className="auth-form-fields">
                                                <div className="auth-form-group">
                                                    <div className="auth-input-wrapper">
                                                        <FiMail className="auth-input-icon" />
                                                        <Field
                                                            name="email"
                                                            type="email"
                                                            placeholder="Email Address"
                                                            className={`auth-input ${errors.email && touched.email ? "auth-input--error" : ""}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="email" component="div" className="auth-error" />
                                                </div>

                                                <div className="auth-form-group">
                                                    <div className="auth-input-wrapper">
                                                        <FiLock className="auth-input-icon" />
                                                        <Field
                                                            name="password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Password"
                                                            className={`auth-input ${errors.password && touched.password ? "auth-input--error" : ""}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="auth-password-toggle"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessage name="password" component="div" className="auth-error" />
                                                </div>

                                                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                                                    {isLoading ? "Signing In..." : "Login"}
                                                </button>

                                                <div className="auth-footer">
                                                    <button
                                                        type="button"
                                                        className="auth-forgot-link"
                                                        onClick={() => setShowForgotModel(true)}
                                                    >
                                                        Forgot Password?
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            ) : (
                                <>
                                    <div className="auth-header">
                                        <h1 className="auth-title">Create Account</h1>
                                        <p className="auth-subtitle">Join our divine candle community</p>
                                    </div>

                                    <Formik
                                        initialValues={{ name: "", email: "", mobile: "", password: "" }}
                                        validationSchema={registerSchema}
                                        onSubmit={handleRegister}
                                    >
                                        {({ errors, touched, isSubmitting }) => (
                                            <Form className="auth-form-fields">
                                                <div className="auth-form-group">
                                                    <div className="auth-input-wrapper">
                                                        <FiUser className="auth-input-icon" />
                                                        <Field
                                                            name="name"
                                                            type="text"
                                                            placeholder="Full Name"
                                                            className={`auth-input ${errors.name && touched.name ? "auth-input--error" : ""}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="name" component="div" className="auth-error" />
                                                </div>

                                                <div className="auth-form-group">
                                                    <div className="auth-input-wrapper">
                                                        <FiMail className="auth-input-icon" />
                                                        <Field
                                                            name="email"
                                                            type="email"
                                                            placeholder="Email Address"
                                                            className={`auth-input ${errors.email && touched.email ? "auth-input--error" : ""}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="email" component="div" className="auth-error" />
                                                </div>

                                                <div className="auth-form-group">
                                                    <div className="auth-input-wrapper">
                                                        <FiPhone className="auth-input-icon" />
                                                        <Field
                                                            name="mobile"
                                                            type="text"
                                                            placeholder="Mobile Number"
                                                            className={`auth-input ${errors.mobile && touched.mobile ? "auth-input--error" : ""}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="mobile" component="div" className="auth-error" />
                                                </div>

                                                <div className="auth-form-group">
                                                    <div className="auth-input-wrapper">
                                                        <FiLock className="auth-input-icon" />
                                                        <Field
                                                            name="password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Password"
                                                            className={`auth-input ${errors.password && touched.password ? "auth-input--error" : ""}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="auth-password-toggle"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessage name="password" component="div" className="auth-error" />
                                                </div>

                                                <button type="submit" className="auth-submit-btn" disabled={isLoading || isSubmitting}>
                                                    {isLoading ? "Creating Account..." : "Register"}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FORGOT PASSWORD MODAL */}
            {showForgotModel && (
                <div className="auth-modal">
                    <div className="auth-modal-overlay" onClick={() => { setShowForgotModel(false); resetForgotFlow(); }} />
                    <div className="auth-modal-content">
                        <button className="auth-modal-close" onClick={() => { setShowForgotModel(false); resetForgotFlow(); }}>
                            <FiX />
                        </button>
                        <h2 className="auth-modal-title">Reset Password</h2>

                        {forgotStep === 1 && (
                            <div className="auth-modal-step">
                                <p className="auth-modal-desc">Enter your email address to receive a reset OTP</p>
                                <div className="auth-modal-input-group">
                                    <FiMail className="auth-modal-input-icon" />
                                    <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="auth-modal-input" />
                                </div>
                                <button onClick={handleSendOtp} disabled={otpLoading} className="auth-modal-btn">
                                    {otpLoading ? "Sending..." : "Send OTP"}
                                </button>
                            </div>
                        )}

                        {forgotStep === 2 && (
                            <div className="auth-modal-step">
                                <p className="auth-modal-desc">Enter the 4-digit OTP sent to <strong>{forgotEmail}</strong></p>
                                <div className="auth-modal-input-group">
                                    <input type="text" placeholder="Enter OTP" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 4))} className="auth-modal-input auth-modal-input-otp" maxLength={4} />
                                </div>
                                <div className="auth-modal-otp-actions">
                                    {resendTimer > 0 ? (
                                        <span className="auth-modal-timer">Resend OTP in {resendTimer}s</span>
                                    ) : (
                                        <button onClick={handleSendOtp} className="auth-modal-resend">Resend OTP</button>
                                    )}
                                </div>
                                <button onClick={handleVerifyOtp} className="auth-modal-btn">Verify OTP</button>
                                <button onClick={() => { setForgotStep(1); setForgotOtp(""); }} className="auth-modal-back">Change Email</button>
                            </div>
                        )}

                        {forgotStep === 3 && (
                            <div className="auth-modal-step">
                                <p className="auth-modal-desc">Enter your new password</p>
                                <div className="auth-modal-input-group">
                                    <FiLock className="auth-modal-input-icon" />
                                    <input type="password" placeholder="New password (min 6 characters)" value={forgotPassword} onChange={(e) => setForgotPassword(e.target.value)} className="auth-modal-input" />
                                </div>
                                <button onClick={handleResetPassword} className="auth-modal-btn">Reset Password</button>
                                <button onClick={() => setForgotStep(2)} className="auth-modal-back">Back to OTP</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthPage;