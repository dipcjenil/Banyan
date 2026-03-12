import { useState, useEffect } from 'react';
import { 
    Box, 
    Drawer, 
    AppBar, 
    Toolbar, 
    List, 
    Typography, 
    Divider, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText,
    Container,
    Paper,
    Avatar,
    Stack,
    Fade,
    useTheme,
    IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyRegistration } from '../api/registration.api';
import RegistrationForm from '../components/RegistrationForm';
import DigitalIDCard from '../components/DigitalIDCard';
import toast from 'react-hot-toast';

const drawerWidth = 280;

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (user && user.isRegistered) {
            fetchRegistration();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchRegistration = async () => {
        try {
            const data = await getMyRegistration();
            if (data.success) setRegistration(data.registration);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('Session terminated');
        navigate('/');
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2, bgcolor: '#040b2a' }}>
            <Box component="img" src="/banyan.png" sx={{ height: 100, animation: 'pulse 2s infinite' }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Synchronizing Registry Data...</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: '#020617', minHeight: '100vh' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1, 
                    background: 'rgba(2, 6, 23, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: 'none'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { md: 4 } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box component="img" src="/banyan.png" sx={{ height: 35 }} />
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 2, color: '#fff', fontSize: '1.2rem' }}>
                            BANYAN <span style={{ color: '#28a745', fontWeight: 400, opacity: 0.6 }}>REGISTRY</span>
                        </Typography>
                    </Stack>
                    
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><NotificationsNoneIcon /></IconButton>
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><SettingsIcon /></IconButton>
                        </Stack>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 24, my: 'auto' }} />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>{user?.email?.split('@')[0]}</Typography>
                                <Typography variant="caption" sx={{ color: '#28a745', fontWeight: 800 }}>MEMBER ID: {registration?.registrationNumber || 'NOT REGISTERED'}</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#28a745', width: 40, height: 40, border: '2px solid rgba(255,255,255,0.1)', fontWeight: 800 }}>
                                {user?.email?.[0]?.toUpperCase()}
                            </Avatar>
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { 
                        width: drawerWidth, 
                        boxSizing: 'border-box',
                        background: '#040b2a',
                        borderRight: '1px solid rgba(255,255,255,0.05)'
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', p: 3 }}>
                    <List spacing={1}>
                        <ListItem disablePadding sx={{ mb: 1.5 }}>
                            <ListItemButton 
                                selected 
                                sx={{ 
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(40, 167, 69, 0.08) !important',
                                    '&.Mui-selected': { color: '#28a745', border: '1px solid rgba(40, 167, 69, 0.2)' }
                                }}
                            >
                                <ListItemIcon><DashboardIcon sx={{ color: '#28a745' }} /></ListItemIcon>
                                <ListItemText primary="Main Dashboard" primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1.5 }}>
                            <ListItemButton sx={{ borderRadius: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                <ListItemIcon><PersonIcon sx={{ color: 'rgba(255,255,255,0.3)' }} /></ListItemIcon>
                                <ListItemText primary="Identity Verification" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    
                    <Box sx={{ position: 'absolute', bottom: 30, left: 24, right: 24 }}>
                        <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.05)' }} />
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: '#ff4d4d', bgcolor: 'rgba(255, 77, 77, 0.05)' }}>
                                <ListItemIcon><LogoutIcon sx={{ color: '#ff4d4d' }} /></ListItemIcon>
                                <ListItemText primary="Terminate Session" primaryTypographyProps={{ fontWeight: 700 }} />
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 6 }, mt: 10, width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Fade in={true} timeout={1000}>
                    <Container maxWidth="md" sx={{ py: 4 }}>
                        {!user?.isRegistered ? (
                            <Box sx={{ mt: 4 }}>
                                <Paper 
                                    sx={{ 
                                        p: 4, 
                                        borderRadius: 6,
                                        background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 165, 0, 0.02) 100%)',
                                        border: '1px solid rgba(255, 165, 0, 0.2)',
                                        mb: 5
                                    }}
                                >
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <Avatar sx={{ bgcolor: 'rgba(255, 165, 0, 0.2)', color: 'orange', width: 60, height: 60, border: '1px solid orange' }}>
                                            <InfoIcon fontSize="large" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: 'orange' }}>Registration Required</Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.8 }}>Complete your official profile to activate your digital member identity.</Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                                <RegistrationForm onComplete={fetchRegistration} />
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', textAlign: 'center', letterSpacing: -1 }}>Your Official Identity</Typography>
                                <DigitalIDCard registration={registration} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 600 }}>
                                    Your high-security digital member ID is active. Use this for all official Banyan registry interactions. Click the card to flip and view verification details.
                                </Typography>
                            </Box>
                        )}
                    </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default DashboardPage;
