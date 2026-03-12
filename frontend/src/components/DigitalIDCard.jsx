import React, { useState } from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const DigitalIDCard = ({ registration }) => {
    const [flipped, setFlipped] = useState(false);

    const cardStyles = {
        width: '450px',
        height: '280px',
        perspective: '1500px',
        cursor: 'pointer',
        margin: '20px auto',
        '&:hover .hologram-glow': {
            opacity: 0.8,
            transform: 'translateX(100%) skewX(-15deg)',
        }
    };

    const innerStyles = {
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    };

    const commonSideStyles = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0a192f 0%, #020617 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
    };

    const FrontSide = () => (
        <Box sx={commonSideStyles}>
            {/* Top Bar: Logo and Company Name */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box component="img" src="/banyan.png" sx={{ height: 45 }} />
                <Typography sx={{ 
                    fontWeight: 900, 
                    color: '#fff', 
                    fontSize: '22px', 
                    letterSpacing: 4, 
                    fontFamily: "'Outfit', sans-serif" 
                }}>
                    BANYAN
                </Typography>
            </Box>

            {/* Middle Section: Member Name (Added for completeness) */}
            <Box sx={{ px: 3, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ 
                    fontSize: '28px', 
                    fontWeight: 800, 
                    color: '#fff', 
                    letterSpacing: -0.5,
                    textAlign: 'center'
                }}>
                    {registration?.fullName?.toUpperCase()}
                </Typography>
            </Box>

            {/* Bottom Section: Photo, ID, QR */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                {/* Photo (Bottom Left) */}
                <Box sx={{ 
                    width: 90, 
                    height: 110, 
                    borderRadius: '10px', 
                    overflow: 'hidden',
                    border: '2px solid rgba(40,167,69,0.5)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {registration?.photo ? (
                        <Box component="img" src={registration.photo} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Typography sx={{ fontSize: 40, fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>{registration?.fullName?.[0]}</Typography>
                    )}
                </Box>

                {/* Registration Number (Bottom Center) */}
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography sx={{ fontSize: '9px', color: '#28a745', fontWeight: 900, letterSpacing: 2, mb: 0.5 }}>REGISTRATION ID</Typography>
                    <Typography sx={{ fontSize: '18px', color: '#fff', fontWeight: 700, fontFamily: 'monospace', bgcolor: 'rgba(0,0,0,0.3)', px: 2, py: 0.5, borderRadius: '4px' }}>
                        {registration?.registrationNumber}
                    </Typography>
                </Box>

                {/* QR Code (Bottom Right) */}
                <Box sx={{ bgcolor: '#fff', p: 0.5, borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                    <QrCode2Icon sx={{ color: '#000', fontSize: 50 }} />
                </Box>
            </Box>

            {/* Hologram Overlay */}
            <Box className="hologram-glow" sx={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                transform: 'skewX(-15deg)',
                transition: 'all 0.6s ease',
                pointerEvents: 'none'
            }} />
        </Box>
    );

    const BackSide = () => (
        <Box sx={{
            ...commonSideStyles,
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(225deg, #020617 0%, #0a192f 100%)',
        }}>
            {/* Top Bar: Logo and Company Name */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Box component="img" src="/banyan.png" sx={{ height: 40, filter: 'grayscale(1) brightness(2)' }} />
                <Typography sx={{ 
                    fontWeight: 800, 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: '18px', 
                    letterSpacing: 3, 
                }}>
                    BANYAN
                </Typography>
            </Box>

            {/* Center Section: Address & Contact */}
            <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography sx={{ fontSize: '10px', color: '#28a745', fontWeight: 900, letterSpacing: 2, mb: 1 }}>RESIDENTIAL ADDRESS</Typography>
                        <Typography sx={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6, fontWeight: 500, maxWidth: '300px' }}>
                            {registration?.landInfo?.address || 'Official Registry District, 4th Sector, Digital City'}<br/>
                            {registration?.landInfo?.location || 'Banyan State Headquarters'}
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', width: '60%', mx: 'auto' }} />

                    <Box>
                        <Typography sx={{ fontSize: '10px', color: '#28a745', fontWeight: 900, letterSpacing: 2, mb: 0.5 }}>CONTACT CHANNELS</Typography>
                        <Typography sx={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>support@banyan-registry.co</Typography>
                        <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>www.bn-registry.gov/verify</Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Bottom Footer */}
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedUserIcon sx={{ color: '#28a745', fontSize: 14 }} />
                    <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1 }}>OFFICIAL BANYAN ISSUED DOCUMENT</Typography>
                </Stack>
            </Box>
        </Box>
    );

    return (
        <Box sx={cardStyles} onClick={() => setFlipped(!flipped)}>
            <Box sx={innerStyles}>
                <FrontSide />
                <BackSide />
            </Box>
            <Typography sx={{ mt: 3, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '12px', letterSpacing: 1 }}>
                SECURE INTERACTIVE IDENTITY • CLICK TO ROTATE
            </Typography>
        </Box>
    );
};

export default DigitalIDCard;
