import { useState } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Link, 
    Grid, 
    Paper, 
    InputAdornment, 
    IconButton,
    CircularProgress,
    Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginInit } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginInit(email, password);
            if (data.success) {
                toast.success('Welcome back!');
                login(data.user);
                navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
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
                background: 'linear-gradient(135deg, #040b2a 0%, #0a192f 100%)' 
            }}
        >
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 6,
                            background: 'linear-gradient(145deg, #0a192f 0%, #040b2a 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
                            <Box component="img" src="/banyan.png" sx={{ height: 60, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 2 }}>
                                WELCOME
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Official Registry Access Portal
                            </Typography>
                        </Stack>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Corporate Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Security Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    background: 'linear-gradient(90deg, #28a745 0%, #1e7e34 100%)',
                                    '&:hover': {
                                        boxShadow: '0 0 20px rgba(40, 167, 69, 0.4)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'SECURE SIGN IN'}
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Typography variant="body2">
                                        New to Banyan?{' '}
                                        <Link 
                                            component={RouterLink} 
                                            to="/signup" 
                                            sx={{ 
                                                color: '#28a745', 
                                                fontWeight: 700, 
                                                textDecoration: 'none', 
                                                '&:hover': { textDecoration: 'underline' } 
                                            }}
                                        >
                                            Establish Identity
                                        </Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
