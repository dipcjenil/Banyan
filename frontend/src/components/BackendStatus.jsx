import { useState, useEffect } from 'react';
import { Box, Chip, Tooltip, Typography, Stack } from '@mui/material';
import axios from 'axios';
import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';

const BackendStatus = () => {
    const [status, setStatus] = useState('checking'); // 'online', 'offline', 'checking'
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        // Base URL usually ends in /api, but the health check is at the root /
        // Let's try to get the base domain from the URL
        const checkURL = baseURL.replace('/api', '') || 'http://localhost:5000';
        setApiUrl(checkURL);

        const checkConnection = async () => {
            try {
                const res = await axios.get(checkURL, { timeout: 5000 });
                if (res.data.status?.includes('Banyan API')) {
                    setStatus('online');
                } else {
                    setStatus('offline');
                }
            } catch (err) {
                console.warn('Backend connection check failed:', err.message);
                setStatus('offline');
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'online': return '#00e676';
            case 'offline': return '#ff5252';
            default: return '#ffa000';
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 9999,
                pointerEvents: 'auto',
            }}
        >
            <Tooltip 
                title={
                    <Box sx={{ p: 0.5 }}>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                            ENDPOINT: {apiUrl}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: getStatusColor() }}>
                            STATUS: {status.toUpperCase()}
                        </Typography>
                        {status === 'offline' && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#aaa' }}>
                                Check CORS settings and Render/Vercel ENV vars.
                            </Typography>
                        )}
                    </Box>
                }
                arrow
            >
                <Chip
                    icon={status === 'online' ? <SensorsIcon /> : <SensorsOffIcon />}
                    label={status === 'online' ? "SATELLITE SYNC" : "OFFLINE"}
                    variant="outlined"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(5, 10, 24, 0.8)',
                        backdropFilter: 'blur(8px)',
                        color: getStatusColor(),
                        borderColor: `${getStatusColor()}44`,
                        fontWeight: 900,
                        fontSize: '0.65rem',
                        letterSpacing: 1.5,
                        px: 1,
                        transition: 'all 0.3s',
                        '& .MuiChip-icon': { color: 'inherit', fontSize: '1rem' },
                        '&:hover': {
                            borderColor: getStatusColor(),
                            boxShadow: `0 0 15px ${getStatusColor()}33`,
                            transform: 'translateY(-2px)'
                        }
                    }}
                />
            </Tooltip>
        </Box>
    );
};

export default BackendStatus;
