import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Link, 
    Paper, 
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signupInit, verifyOTP } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [loading, setLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSignupInit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            const data = await signupInit(email, password);
            if (data.success) {
                toast.success('Verification code sent to your email!');
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await verifyOTP(email, code);
            if (data.success) {
                toast.success('Account verified and created!');
                login(data.user);
                navigate('/dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #040b2a 0%, #0a192f 100%)'
            }}
        >
            <Container maxWidth="xs">
                <Paper 
                    elevation={12} 
                    sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        borderRadius: 4,
                        border: '1px solid rgba(40, 167, 69, 0.2)'
                    }}
                >
                    <Box 
                        component="img" 
                        src="/banyan.png" 
                        alt="Banyan Logo" 
                        sx={{ height: 100, mb: 2 }} 
                    />
                    
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {step === 1 ? 'Create Account' : 'Verify Email'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                        {step === 1 
                            ? 'Join Banyan and get your digital ID card' 
                            : `A verification code was sent to ${email}`}
                    </Typography>

                    {step === 1 ? (
                        <Box component="form" onSubmit={handleSignupInit} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleVerify} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Verification Code"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                inputProps={{ maxLength: 6, style: { fontSize: '24px', textAlign: 'center', letterSpacing: '8px' } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Continue'}
                            </Button>
                            <Button 
                                fullWidth 
                                variant="text" 
                                color="inherit" 
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Back to Details
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/" sx={{ fontWeight: 600 }}>
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignupPage;
