import { useState, useEffect, useCallback } from 'react';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    Container, Paper, Button, Avatar, Stack, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Chip, Tooltip, Badge, LinearProgress,
    TextField, MenuItem
} from '@mui/material';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RefreshIcon from '@mui/icons-material/Refresh';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStats, getRegistrations, adminRegisterUser } from '../api/auth.api';
import toast from 'react-hot-toast';

const drawerWidth = 260;

const COLORS = ['#00e676', '#2979ff', '#ff6d00', '#d500f9'];

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${color}22`,
            background: `linear-gradient(135deg, ${color}0a 0%, #0a0f2400 100%)`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-4px)', border: `1px solid ${color}55`, boxShadow: `0 16px 40px ${color}15` }
        }}
    >
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.06, fontSize: 120 }}>
            {icon}
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    {title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mt: 0.5, lineHeight: 1 }}>
                    {value ?? '—'}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, background: `${color}22`, border: `1px solid ${color}33` }}>
                <Box sx={{ color, fontSize: 28, display: 'flex' }}>{icon}</Box>
            </Box>
        </Stack>
        {trend !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2 }}>
                {trend >= 0
                    ? <TrendingUpIcon sx={{ fontSize: 16, color: '#00e676' }} />
                    : <TrendingDownIcon sx={{ fontSize: 16, color: '#ff5252' }} />
                }
                <Typography variant="caption" sx={{ color: trend >= 0 ? '#00e676' : '#ff5252', fontWeight: 600 }}>
                    {trend >= 0 ? '+' : ''}{trend}% from last week
                </Typography>
            </Stack>
        )}
    </Paper>
);

const CustomTooltipArea = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <Paper sx={{ p: 1.5, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 0.5 }}>{label}</Typography>
                {payload.map((p, i) => (
                    <Typography key={i} variant="caption" sx={{ color: p.color, display: 'block', fontWeight: 700 }}>
                        {p.name}: {p.value}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [lastSync, setLastSync] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'admin') { navigate('/dashboard'); return; }
        fetchData();
    }, [user]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, regsRes] = await Promise.all([getStats(), getRegistrations()]);
            if (statsRes.success) setStats(statsRes.stats);
            if (regsRes.success) setRegistrations(regsRes.registrations);
            setLastSync(new Date());
        } catch (err) {
            console.error(err);
            toast.error('Failed to load system data');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/');
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: <DashboardIcon fontSize="small" /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChartIcon fontSize="small" /> },
        { id: 'register', label: 'Register User', icon: <AppRegistrationIcon fontSize="small" /> },
        { id: 'registrations', label: 'Registrations', icon: <TableChartIcon fontSize="small" /> },
    ];

    const chartData = stats?.chartData || [];

    // Pie data: registered vs pending
    const pieData = [
        { name: 'Registered', value: stats?.totalRegistrations || 0 },
        { name: 'Pending', value: stats?.pendingRegistrations || 0 },
        { name: 'Unverified', value: (stats?.totalUsers || 0) - (stats?.verifiedUsers || 0) },
    ].filter(d => d.value > 0);

    if (loading && !stats) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#050a18', gap: 2 }}>
            <Box component="img" src="/banyan.png" sx={{ height: 80, opacity: 0.8 }} />
            <CircularProgress size={32} sx={{ color: '#00e676' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>Loading system data…</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: '#050a18', minHeight: '100vh' }}>
            {/* Top AppBar */}
            <AppBar position="fixed" elevation={0} sx={{
                zIndex: t => t.zIndex.drawer + 1,
                background: 'rgba(5,10,24,0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Toolbar sx={{ px: { md: 3 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
                        <Box component="img" src="/banyan.png" sx={{ height: 34 }} />
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 2, color: '#fff', lineHeight: 1 }}>
                                BANYAN
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#00e676', letterSpacing: 3, fontSize: '0.6rem' }}>
                                ADMIN CONTROL
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        {lastSync && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: { xs: 'none', md: 'block' } }}>
                                Synced: {lastSync.toLocaleTimeString()}
                            </Typography>
                        )}
                        <Tooltip title="Refresh Data">
                            <IconButton onClick={fetchData} disabled={loading} size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            <Badge badgeContent={registrations.length} color="success" max={99}>
                                <NotificationsNoneIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1.5 }} />
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 34, height: 34, bgcolor: '#00e676', color: '#050a18', fontWeight: 900, fontSize: '0.85rem' }}>
                                {user?.email?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                                    {user?.email?.split('@')[0]}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#00e676', fontSize: '0.6rem', fontWeight: 700 }}>
                                    SYSTEM ADMIN
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Toolbar>
                {loading && <LinearProgress sx={{ height: 2, bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: '#00e676' } }} />}
            </AppBar>

            {/* Sidebar */}
            <Drawer variant="permanent" sx={{
                width: drawerWidth, flexShrink: 0,
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', background: '#070d1f', borderRight: '1px solid rgba(255,255,255,0.05)' }
            }}>
                <Toolbar />
                <Box sx={{ p: 2, mt: 1 }}>
                    {/* Nav Items */}
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontWeight: 700, letterSpacing: 2, px: 1.5, mb: 1, display: 'block' }}>
                        NAVIGATION
                    </Typography>
                    <List disablePadding>
                        {navItems.map(item => (
                            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    selected={activeTab === item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.2,
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(0,230,118,0.1)',
                                            border: '1px solid rgba(0,230,118,0.2)',
                                            color: '#00e676',
                                            '& .MuiListItemIcon-root': { color: '#00e676' }
                                        },
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                                        '& .MuiListItemIcon-root': { color: 'rgba(255,255,255,0.3)', minWidth: 36 },
                                        color: activeTab === item.id ? '#00e676' : 'rgba(255,255,255,0.5)'
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

                    {/* Quick Stats mini */}
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontWeight: 700, letterSpacing: 2, px: 1.5, mb: 1, display: 'block' }}>
                        LIVE STATS
                    </Typography>
                    <Box sx={{ px: 1 }}>
                        {[
                            { label: 'Total Members', val: stats?.totalUsers ?? '—', color: '#2979ff' },
                            { label: 'Verified', val: stats?.verifiedUsers ?? '—', color: '#00e676' },
                            { label: 'ID Cards', val: stats?.totalRegistrations ?? '—', color: '#ff6d00' },
                            { label: 'Pending', val: stats?.pendingRegistrations ?? '—', color: '#ffea00' },
                        ].map(s => (
                            <Stack key={s.label} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{s.label}</Typography>
                                <Typography variant="caption" sx={{ color: s.color, fontWeight: 900, fontFamily: 'monospace', fontSize: '0.875rem' }}>{s.val}</Typography>
                            </Stack>
                        ))}
                    </Box>

                    {/* Logout at bottom */}
                    <Box sx={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
                        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, bgcolor: 'rgba(255,82,82,0.06)', border: '1px solid rgba(255,82,82,0.15)', color: '#ff5252', '&:hover': { bgcolor: 'rgba(255,82,82,0.12)' } }}>
                            <ListItemIcon sx={{ minWidth: 36, color: '#ff5252' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }} />
                        </ListItemButton>
                    </Box>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, mt: '64px', p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 64px)' }}>
                <Container maxWidth="xl" disableGutters>

                    {/* ─── OVERVIEW TAB ─── */}
                    {activeTab === 'overview' && (
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>System Overview</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>
                                    Real-time registry activity monitoring · Banyan Digital Identity Platform
                                </Typography>
                            </Box>

                            {/* Stat Cards */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4,1fr)' }, gap: 3, mb: 4 }}>
                                <StatCard title="Total Members" value={stats?.totalUsers} icon={<PeopleIcon />} color="#2979ff" subtitle="All registered accounts" trend={5} />
                                <StatCard title="Verified Users" value={stats?.verifiedUsers} icon={<VerifiedUserIcon />} color="#00e676" subtitle="Email verified accounts" trend={8} />
                                <StatCard title="ID Cards Issued" value={stats?.totalRegistrations} icon={<AppRegistrationIcon />} color="#ff6d00" subtitle="Active digital identities" trend={3} />
                                <StatCard title="Pending Profiles" value={stats?.pendingRegistrations} icon={<PendingActionsIcon />} color="#ffea00" subtitle="Awaiting form completion" trend={-2} />
                            </Box>

                            {/* Charts Row */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
                                {/* Area Chart */}
                                <Paper sx={{ p: 3, borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>Registration Activity</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>Last 7 days signups & ID issuances</Typography>
                                        </Box>
                                        <Chip label="LIVE" size="small" sx={{ bgcolor: 'rgba(0,230,118,0.15)', color: '#00e676', fontWeight: 700, fontSize: '0.6rem', border: '1px solid rgba(0,230,118,0.3)' }} />
                                    </Stack>
                                    <ResponsiveContainer width="100%" height={240}>
                                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradSignups" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2979ff" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#2979ff" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradRegs" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00e676" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <RTooltip content={<CustomTooltipArea />} />
                                            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                                            <Area type="monotone" dataKey="signups" name="Signups" stroke="#2979ff" fill="url(#gradSignups)" strokeWidth={2} dot={{ r: 3, fill: '#2979ff' }} />
                                            <Area type="monotone" dataKey="registrations" name="ID Cards" stroke="#00e676" fill="url(#gradRegs)" strokeWidth={2} dot={{ r: 3, fill: '#00e676' }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Paper>

                                {/* Pie Chart */}
                                <Paper sx={{ p: 3, borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>Member Status</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>Distribution breakdown</Typography>
                                    </Box>
                                    <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                                {pieData.map((_entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RTooltip content={<CustomTooltipArea />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ mt: 1 }}>
                                        {pieData.map((entry, index) => (
                                            <Stack key={entry.name} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.8, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{entry.name}</Typography>
                                                </Stack>
                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800 }}>{entry.value}</Typography>
                                            </Stack>
                                        ))}
                                    </Box>
                                </Paper>
                            </Box>

                            {/* Recent Registrations mini table */}
                            <Paper sx={{ borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>Recent Registrations</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>Latest 5 ID card issuances</Typography>
                                    </Box>
                                    <Button size="small" variant="outlined" onClick={() => setActiveTab('registrations')} sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 2, fontSize: '0.75rem' }}>
                                        View All
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ '& th': { bgcolor: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.35)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' } }}>
                                                <TableCell>MEMBER NAME</TableCell>
                                                <TableCell>REG ID</TableCell>
                                                <TableCell>EMAIL</TableCell>
                                                <TableCell>ANNUAL INCOME</TableCell>
                                                <TableCell>STATUS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {registrations.slice(0, 5).map(row => (
                                                <TableRow key={row._id} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                                    <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{row.fullName}</TableCell>
                                                    <TableCell sx={{ fontFamily: 'monospace', color: '#00e676', fontWeight: 700 }}>{row.registrationNumber}</TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{row.user?.email || '—'}</TableCell>
                                                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>₹{(row.financialDetails?.annualIncome || 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell>
                                                        <Chip label="ACTIVE" size="small" sx={{ bgcolor: 'rgba(0,230,118,0.12)', color: '#00e676', fontWeight: 700, fontSize: '0.6rem', border: '1px solid rgba(0,230,118,0.25)' }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {registrations.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'rgba(255,255,255,0.2)', borderBottom: 'none' }}>
                                                        No registrations yet
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    )}

                    {/* ─── ANALYTICS TAB ─── */}
                    {activeTab === 'analytics' && (
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>Analytics</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>Deep dive into registration trends</Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                                {/* Bar Chart */}
                                <Paper sx={{ p: 3, borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>Daily Signups (Bar)</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>New accounts created per day</Typography>
                                    <ResponsiveContainer width="100%" height={240} style={{ marginTop: 16 }}>
                                        <BarChart data={chartData} margin={{ left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <RTooltip content={<CustomTooltipArea />} />
                                            <Bar dataKey="signups" name="Signups" fill="#2979ff" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>

                                {/* Line Chart */}
                                <Paper sx={{ p: 3, borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>ID Issuance Trend (Line)</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>Registration completions per day</Typography>
                                    <ResponsiveContainer width="100%" height={240} style={{ marginTop: 16 }}>
                                        <LineChart data={chartData} margin={{ left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <RTooltip content={<CustomTooltipArea />} />
                                            <Line type="monotone" dataKey="registrations" name="ID Cards" stroke="#00e676" strokeWidth={2.5} dot={{ r: 4, fill: '#00e676', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>

                                {/* Stacked Bar */}
                                <Paper sx={{ p: 3, borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)', gridColumn: { lg: '1 / -1' } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>Stacked Activity Overview</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>Signups vs ID Issuances — last 7 days</Typography>
                                    <ResponsiveContainer width="100%" height={240} style={{ marginTop: 16 }}>
                                        <BarChart data={chartData} margin={{ left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <RTooltip content={<CustomTooltipArea />} />
                                            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                                            <Bar dataKey="signups" name="Signups" stackId="a" fill="#2979ff" />
                                            <Bar dataKey="registrations" name="ID Cards" stackId="a" fill="#00e676" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Box>
                        </Box>
                    )}

                    {/* ─── REGISTRATIONS TAB ─── */}
                    {activeTab === 'registrations' && (
                        <Box>
                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>All Registrations</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>{registrations.length} records in system</Typography>
                                </Box>
                                <Button startIcon={<RefreshIcon />} onClick={fetchData} disabled={loading} variant="outlined"
                                    sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', borderRadius: 2, '&:hover': { borderColor: '#00e676', color: '#00e676' } }}>
                                    Sync
                                </Button>
                            </Box>

                            <Paper sx={{ borderRadius: 3, background: '#080e20', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ '& th': { bgcolor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                                                <TableCell>#</TableCell>
                                                <TableCell>MEMBER NAME</TableCell>
                                                <TableCell>REG ID</TableCell>
                                                <TableCell><Stack direction="row" spacing={0.5} alignItems="center"><EmailIcon sx={{ fontSize: 12 }} /><span>EMAIL</span></Stack></TableCell>
                                                <TableCell><Stack direction="row" spacing={0.5} alignItems="center"><LocationOnIcon sx={{ fontSize: 12 }} /><span>ADDRESS</span></Stack></TableCell>
                                                <TableCell><Stack direction="row" spacing={0.5} alignItems="center"><AccountBalanceIcon sx={{ fontSize: 12 }} /><span>INCOME (₹)</span></Stack></TableCell>
                                                <TableCell>FAMILY</TableCell>
                                                <TableCell>STATUS</TableCell>
                                                <TableCell>DATE</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {registrations.map((row, idx) => (
                                                <TableRow key={row._id} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#2979ff22', color: '#2979ff', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #2979ff33' }}>
                                                                {row.fullName?.[0]?.toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1 }}>{row.fullName}</Typography>
                                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>S/o {row.fatherName}</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ fontFamily: 'monospace', color: '#00e676', fontWeight: 800, fontSize: '0.85rem' }}>{row.registrationNumber}</TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>{row.user?.email || '—'}</TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.landInfo?.address}>{row.landInfo?.address || '—'}</TableCell>
                                                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>₹{(row.financialDetails?.annualIncome || 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)' }}>{row.familyDetails?.length || 0} members</TableCell>
                                                    <TableCell>
                                                        <Chip label="ACTIVE" size="small" sx={{ bgcolor: 'rgba(0,230,118,0.1)', color: '#00e676', fontWeight: 700, fontSize: '0.6rem', border: '1px solid rgba(0,230,118,0.2)' }} />
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                                        {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {registrations.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={9} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                                                        <AppRegistrationIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.08)', mb: 2, display: 'block', mx: 'auto' }} />
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.2)' }}>No registrations in the system yet</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    )}

                    {/* ─── REGISTER USER TAB ─── */}
                    {activeTab === 'register' && <AdminRegisterForm onComplete={fetchData} />}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;

// ─── Admin Registration Form Component ─────────────────────────────────────────
const AdminRegisterForm = ({ onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        fatherName: '',
        motherName: '',
        photo: '',
        familyDetails: [],
        landInfo: { area: '', landType: '', address: '', location: '' },
        financialDetails: { loan: 0, balance: 0, annualIncome: 0, predictedIncome: 0 }
    });
    const [member, setMember] = useState({ name: '', age: '', relation: 'Son' });

    const steps = ['User Info', 'Identity', 'Assets', 'Financials'];

    const addFamilyMember = () => {
        if (!member.name || !member.age) return toast.error('Enter member name and age');
        setFormData({ ...formData, familyDetails: [...formData.familyDetails, member] });
        setMember({ name: '', age: '', relation: 'Son' });
    };

    const removeFamilyMember = (idx) => {
        setFormData({ ...formData, familyDetails: formData.familyDetails.filter((_, i) => i !== idx) });
    };

    const handleSubmit = async () => {
        if (!formData.email) return toast.error('User email is required');
        if (!formData.fullName) return toast.error('Full name is required');
        setLoading(true);
        try {
            const res = await adminRegisterUser(formData);
            if (res.success) {
                toast.success(res.message || 'User registered successfully!');
                setFormData({ email: '', fullName: '', fatherName: '', motherName: '', photo: '', familyDetails: [], landInfo: { area: '', landType: '', address: '', location: '' }, financialDetails: { loan: 0, balance: 0, annualIncome: 0, predictedIncome: 0 } });
                setActiveStep(0);
                if (onComplete) onComplete();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.02)' },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0: // User Info + Email
                return (
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>User Account</Typography>
                            <Typography variant="body2" color="text.secondary">Enter the user's email. A new account will be created if they don't have one.</Typography>
                        </Box>
                        <TextField fullWidth label="User Email *" type="email" value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={inputSx}
                            InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1, color: 'rgba(255,255,255,0.3)' }}><EmailIcon fontSize="small" /></Box> }}
                        />
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <input accept="image/*" style={{ display: 'none' }} id="admin-photo-upload" type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setFormData({ ...formData, photo: reader.result });
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <label htmlFor="admin-photo-upload">
                                <Box sx={{
                                    width: 140, height: 160, borderRadius: 4, border: '2px dashed rgba(255,255,255,0.1)',
                                    bgcolor: 'rgba(255,255,255,0.02)', margin: '0 auto', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden', '&:hover': { border: '2px dashed #28a745', bgcolor: 'rgba(40,167,69,0.05)' }
                                }}>
                                    {formData.photo
                                        ? <Box component="img" src={formData.photo} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>UPLOAD PHOTO</Typography></>
                                    }
                                </Box>
                            </label>
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.5 }}>Member Portrait (optional)</Typography>
                        </Box>
                    </Stack>
                );
            case 1: // Identity
                return (
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>Primary Identity</Typography>
                            <Typography variant="body2" color="text.secondary">Full name and parentage details.</Typography>
                        </Box>
                        <TextField fullWidth label="Full Name *" value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} sx={inputSx} />
                        <TextField fullWidth label="Father's Name" value={formData.fatherName}
                            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} sx={inputSx} />
                        <TextField fullWidth label="Mother's Name" value={formData.motherName}
                            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} sx={inputSx} />
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>Family Members</Typography>
                        <Stack direction="row" spacing={1} alignItems="flex-end">
                            <TextField label="Name" value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} sx={inputSx} size="small" />
                            <TextField label="Age" type="number" value={member.age} onChange={(e) => setMember({ ...member, age: e.target.value })} sx={inputSx} size="small" style={{ width: 80 }} />
                            <TextField select label="Relation" value={member.relation} onChange={(e) => setMember({ ...member, relation: e.target.value })} sx={inputSx} size="small" style={{ width: 120 }}>
                                <MenuItem value="Son">Son</MenuItem>
                                <MenuItem value="Daughter">Daughter</MenuItem>
                                <MenuItem value="Spouse">Spouse</MenuItem>
                            </TextField>
                            <Button variant="outlined" onClick={addFamilyMember} sx={{ minWidth: 40, borderColor: '#28a745', color: '#28a745' }}>+</Button>
                        </Stack>
                        {formData.familyDetails.map((m, i) => (
                            <Paper key={i} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#fff' }}>{m.name} — {m.relation}, Age: {m.age}</Typography>
                                <Button size="small" color="error" onClick={() => removeFamilyMember(i)}>✕</Button>
                            </Paper>
                        ))}
                    </Stack>
                );
            case 2: // Assets
                return (
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>Asset Details</Typography>
                            <Typography variant="body2" color="text.secondary">Land holdings information.</Typography>
                        </Box>
                        <TextField fullWidth label="Total Area (Acres)" value={formData.landInfo.area}
                            onChange={(e) => setFormData({ ...formData, landInfo: { ...formData.landInfo, area: e.target.value } })} sx={inputSx} />
                        <TextField fullWidth label="Land Classification" value={formData.landInfo.landType}
                            onChange={(e) => setFormData({ ...formData, landInfo: { ...formData.landInfo, landType: e.target.value } })} sx={inputSx} />
                        <TextField fullWidth multiline rows={2} label="Address" value={formData.landInfo.address}
                            onChange={(e) => setFormData({ ...formData, landInfo: { ...formData.landInfo, address: e.target.value } })} sx={inputSx} />
                        <TextField fullWidth label="Location" value={formData.landInfo.location}
                            onChange={(e) => setFormData({ ...formData, landInfo: { ...formData.landInfo, location: e.target.value } })} sx={inputSx} />
                    </Stack>
                );
            case 3: // Financials
                return (
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>Financial Profile</Typography>
                            <Typography variant="body2" color="text.secondary">Financial information for the member.</Typography>
                        </Box>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField fullWidth type="number" label="Loan Balance (₹)" value={formData.financialDetails.loan}
                                onChange={(e) => setFormData({ ...formData, financialDetails: { ...formData.financialDetails, loan: e.target.value } })} sx={inputSx} />
                            <TextField fullWidth type="number" label="Balance (₹)" value={formData.financialDetails.balance}
                                onChange={(e) => setFormData({ ...formData, financialDetails: { ...formData.financialDetails, balance: e.target.value } })} sx={inputSx} />
                        </Stack>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField fullWidth type="number" label="Annual Income (₹)" value={formData.financialDetails.annualIncome}
                                onChange={(e) => setFormData({ ...formData, financialDetails: { ...formData.financialDetails, annualIncome: e.target.value } })} sx={inputSx} />
                            <TextField fullWidth type="number" label="Predicted Income (₹)" value={formData.financialDetails.predictedIncome}
                                onChange={(e) => setFormData({ ...formData, financialDetails: { ...formData.financialDetails, predictedIncome: e.target.value } })} sx={inputSx} />
                        </Stack>
                    </Stack>
                );
            default: return null;
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>Register New User</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>Fill in the details below. The user will receive their ID card via email.</Typography>
            </Box>
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'linear-gradient(145deg, #0a192f 0%, #040b2a 100%)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: 700, mx: 'auto' }}>
                {/* Stepper */}
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
                    {steps.map((label, idx) => (
                        <Chip key={label} label={label} size="small" clickable onClick={() => setActiveStep(idx)}
                            sx={{
                                fontWeight: 700, fontSize: '0.7rem', letterSpacing: 0.5,
                                bgcolor: activeStep === idx ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.04)',
                                color: activeStep === idx ? '#00e676' : 'rgba(255,255,255,0.4)',
                                border: activeStep === idx ? '1px solid rgba(0,230,118,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            }}
                        />
                    ))}
                </Stack>

                {renderStep()}

                {/* Navigation */}
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)}
                        sx={{ borderRadius: 2, px: 3, color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }}>Back</Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 800, background: 'linear-gradient(90deg, #28a745 0%, #1e7e34 100%)', boxShadow: '0 10px 20px rgba(40,167,69,0.3)' }}>
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Register & Send Email'}
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={() => setActiveStep(p => p + 1)}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 700, bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#eee' } }}>Next</Button>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};
