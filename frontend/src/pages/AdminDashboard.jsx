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
    Grid,
    Button,
    Avatar,
    Stack,
    CircularProgress,
    Fade,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip as MuiChip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStats, getRegistrations } from '../api/auth.api';
import toast from 'react-hot-toast';

const drawerWidth = 280;

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalRegistrations: 0 });
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, regsRes] = await Promise.all([
                getStats(),
                getRegistrations()
            ]);
            
            // Adjusting stats logic to match the table content
            // totalUsers includes all people (users + admin)
            // totalRegistrations is the count of Registration documents
            if (statsRes.success) setStats(statsRes.stats);
            if (regsRes.success) setRegistrations(regsRes.registrations);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load system data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/');
    };

    if (loading && !stats.totalUsers && registrations.length === 0) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#040b2a' }}>
            <CircularProgress color="primary" />
        </Box>
    );

    const statCards = [
        { title: 'Registered Accounts', value: stats.totalUsers, icon: <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />, color: 'primary' },
        { title: 'Identity Cards Issued', value: registrations.length, icon: <AppRegistrationIcon sx={{ fontSize: 40, color: '#28a745' }} />, color: 'success' },
        { title: 'Pending Profiles', value: Math.max(0, stats.totalUsers - registrations.length), icon: <PendingActionsIcon sx={{ fontSize: 40, color: '#ffb300' }} />, color: 'warning' },
    ];

    return (
        <Box sx={{ display: 'flex', bgcolor: '#040b2a', minHeight: '100vh' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1, 
                    background: 'rgba(10, 25, 47, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <Toolbar>
                    <Box component="img" src="/banyan.png" sx={{ height: 40, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, flexGrow: 1, letterSpacing: 1 }}>
                        BANYAN ADMIN
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.email}</Typography>
                            <MuiChip label="SYSTEM ADMIN" size="small" sx={{ height: 16, fontSize: '8px', bgcolor: 'rgba(40,167,69,0.2)', color: '#28a745' }} />
                        </Box>
                        <Avatar sx={{ bgcolor: 'primary.dark', border: '1px solid #28a745' }}>
                            <AdminPanelSettingsIcon fontSize="small" />
                        </Avatar>
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
                        background: '#071026',
                        borderRight: '1px solid rgba(255,255,255,0.05)'
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', p: 2 }}>
                    <List sx={{ mt: 2 }}>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton selected sx={{ borderRadius: 3, bgcolor: 'rgba(40, 167, 69, 0.1) !important' }}>
                                <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Admin Overview" primaryTypographyProps={{ fontWeight: 700 }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 3 }}>
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="User Registry" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider sx={{ my: 3, opacity: 0.1 }} />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, color: 'error.main' }}>
                                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                <ListItemText primary="Exit System" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, mt: 10 }}>
                <Fade in={true} timeout={800}>
                    <Container maxWidth="xl">
                        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>System Registry</Typography>
                                <Typography variant="h6" color="text.secondary">Real-time member activity and registration monitoring.</Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                startIcon={<RefreshIcon />} 
                                onClick={fetchData}
                                sx={{ borderRadius: 3, px: 3 }}
                                disabled={loading}
                            >
                                {loading ? 'Syncing...' : 'Sync Data'}
                            </Button>
                        </Box>

                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            {statCards.map((card, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 4, 
                                            borderRadius: 6, 
                                            textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.5) 0%, rgba(10, 25, 47, 0.8) 100%)',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': { transform: 'translateY(-10px)', border: '1px solid rgba(40, 167, 69, 0.3)' }
                                        }}
                                    >
                                        <Box sx={{ mb: 2 }}>{card.icon}</Box>
                                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>{card.value}</Typography>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                                            {card.title}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Paper sx={{ p: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: '#0a192f' }}>
                            <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Recent Registrations</Typography>
                                <MuiChip label={`${registrations.length} Total`} size="small" />
                            </Box>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>MEMBER NAME</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>REG ID</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>EMAIL ADDRESS</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>LOCATION</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>INCOME (₹)</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>ACTION</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {registrations.length > 0 ? registrations.map((row) => (
                                            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                                                <TableCell sx={{ fontWeight: 600, color: '#fff' }}>{row.fullName}</TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', color: '#28a745', fontWeight: 700 }}>{row.registrationNumber}</TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.user?.email || 'N/A'}</TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.landInfo?.address}</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: '#fff' }}>{row.financialDetails?.annualIncome?.toLocaleString() || '0'}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" sx={{ color: '#28a745' }}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 10, opacity: 0.5 }}>
                                                    <AppRegistrationIcon sx={{ fontSize: 60, mb: 2, display: 'block', mx: 'auto' }} />
                                                    <Typography sx={{ color: '#fff' }}>No active registrations found in the system.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Container>
                </Fade>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
