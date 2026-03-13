import { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Stepper, 
    Step, 
    StepLabel, 
    Grid, 
    MenuItem, 
    IconButton, 
    Divider,
    CircularProgress,
    Stack,
    InputAdornment,
    Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import LandscapeIcon from '@mui/icons-material/Landscape';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { submitRegistration } from '../api/registration.api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegistrationForm = ({ onComplete }) => {
    const { refreshUser } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        fatherName: '',
        motherName: '',
        familyDetails: [],
        landInfo: { area: '', landType: '', address: '', location: '' },
        financialDetails: { loan: 0, balance: 0, annualIncome: 0, predictedIncome: 0 }
    });

    const [member, setMember] = useState({ name: '', age: '', relation: 'Son' });

    const steps = [
        { label: 'Identity', icon: <PersonIcon /> },
        { label: 'Assets', icon: <LandscapeIcon /> },
        { label: 'Financials', icon: <AccountBalanceWalletIcon /> }
    ];

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const addFamilyMember = () => {
        if (!member.name || !member.age) return toast.error('Enter member name and age');
        setFormData({ ...formData, familyDetails: [...formData.familyDetails, member] });
        setMember({ name: '', age: '', relation: 'Son' });
    };

    const removeFamilyMember = (index) => {
        const updated = formData.familyDetails.filter((_, i) => i !== index);
        setFormData({ ...formData, familyDetails: updated });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await submitRegistration(formData);
            if (res.success) {
                toast.success('Registry record created successfully');
                await refreshUser();
                if (onComplete) onComplete();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: 'rgba(255,255,255,0.02)',
            '&:hover bgcolor': 'rgba(255,255,255,0.04)',
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={4}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>Primary Identity</Typography>
                            <Typography variant="body2" color="text.secondary">Enter your full legal name and parentage as per official documents.</Typography>
                        </Box>
                        
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="photo-upload"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, photo: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="photo-upload">
                                        <Box sx={{ 
                                            width: 140, 
                                            height: 160, 
                                            borderRadius: 4, 
                                            border: '2px dashed rgba(255,255,255,0.1)',
                                            bgcolor: 'rgba(255,255,255,0.02)',
                                            margin: '0 auto',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            '&:hover': { border: '2px dashed #28a745', bgcolor: 'rgba(40,167,69,0.05)' }
                                        }}>
                                            {formData.photo ? (
                                                <Box component="img" src={formData.photo} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <>
                                                    <AddCircleIcon sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 40, mb: 1 }} />
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>UPLOAD PHOTO</Typography>
                                                </>
                                            )}
                                        </Box>
                                    </label>
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.5 }}>Official Member Portrait</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2}>
                                    <TextField 
                                        fullWidth label="Full Name" 
                                        value={formData.fullName} 
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                                        sx={inputStyles}
                                    />
                                    <TextField 
                                        fullWidth label="Father's Name" 
                                        value={formData.fatherName} 
                                        onChange={(e) => setFormData({...formData, fatherName: e.target.value})} 
                                        sx={inputStyles}
                                    />
                                    <TextField 
                                        fullWidth label="Mother's Name" 
                                        value={formData.motherName} 
                                        onChange={(e) => setFormData({...formData, motherName: e.target.value})} 
                                        sx={inputStyles}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>Family Registry</Typography>
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Name" value={member.name} onChange={(e) => setMember({...member, name: e.target.value})} sx={inputStyles} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Age" type="number" value={member.age} onChange={(e) => setMember({...member, age: e.target.value})} sx={inputStyles} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField select fullWidth label="Relation" value={member.relation} onChange={(e) => setMember({...member, relation: e.target.value})} sx={inputStyles}>
                                        <MenuItem value="Son">Son</MenuItem>
                                        <MenuItem value="Daughter">Daughter</MenuItem>
                                        <MenuItem value="Spouse">Spouse</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Button fullWidth variant="outlined" onClick={addFamilyMember} sx={{ height: 56, borderRadius: '12px', border: '1px solid rgba(40,167,69,0.3)', color: '#28a745' }}>
                                        <AddCircleIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                            <Stack spacing={1} sx={{ mt: 2 }}>
                                {formData.familyDetails.map((m, i) => (
                                    <Paper key={i} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: '#fff' }}>{m.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{m.relation} • Age: {m.age}</Typography>
                                        </Box>
                                        <IconButton onClick={() => removeFamilyMember(i)} size="small" sx={{ color: '#ff4d4d' }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                );
            case 1:
                return (
                    <Stack spacing={4}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>Asset Repository</Typography>
                            <Typography variant="body2" color="text.secondary">Provide details about your agricultural land holdings.</Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth label="Total Area" 
                                    InputProps={{ endAdornment: <InputAdornment position="end">Acres</InputAdornment> }}
                                    value={formData.landInfo.area} 
                                    onChange={(e) => setFormData({...formData, landInfo: {...formData.landInfo, area: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth label="Land Classification" 
                                    placeholder="e.g. Irrigated"
                                    value={formData.landInfo.landType} 
                                    onChange={(e) => setFormData({...formData, landInfo: {...formData.landInfo, landType: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth multiline rows={3} label="Asset Address" 
                                    value={formData.landInfo.address} 
                                    onChange={(e) => setFormData({...formData, landInfo: {...formData.landInfo, address: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                );
            case 2:
                return (
                    <Stack spacing={4}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>Financial Profile</Typography>
                            <Typography variant="body2" color="text.secondary">High-security declaration of annual yield and liabilities.</Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth type="number" label="Loan Balance (₹)" 
                                    value={formData.financialDetails.loan} 
                                    onChange={(e) => setFormData({...formData, financialDetails: {...formData.financialDetails, loan: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth type="number" label="Balance (₹)" 
                                    value={formData.financialDetails.balance} 
                                    onChange={(e) => setFormData({...formData, financialDetails: {...formData.financialDetails, balance: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth type="number" label="Annual Income (₹)" 
                                    value={formData.financialDetails.annualIncome} 
                                    onChange={(e) => setFormData({...formData, financialDetails: {...formData.financialDetails, annualIncome: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth type="number" label="Predicted Income (₹)" 
                                    value={formData.financialDetails.predictedIncome} 
                                    onChange={(e) => setFormData({...formData, financialDetails: {...formData.financialDetails, predictedIncome: e.target.value}})} 
                                    sx={inputStyles}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                );
            default:
                return null;
        }
    };

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 8, 
                background: 'linear-gradient(145deg, #0a192f 0%, #040b2a 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
            }}
        >
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                {steps.map((step, index) => (
                    <Step key={step.label} sx={{
                        '& .MuiStepLabel-label': { fontWeight: 700, mt: 1, color: activeStep >= index ? '#28a745' : 'rgba(255,255,255,0.3)' },
                        '& .MuiStepIcon-root': { color: activeStep >= index ? '#28a745' : 'rgba(255,255,255,0.1)', fontSize: 28 },
                        '& .MuiStepIcon-text': { fill: '#fff' }
                    }}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ minHeight: 450 }}>
                <Fade in={true} key={activeStep} timeout={500}>
                    <Box>{renderStepContent(activeStep)}</Box>
                </Fade>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Button 
                    disabled={activeStep === 0} 
                    onClick={handleBack}
                    sx={{ borderRadius: '12px', px: 4, py: 1.5, color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }}
                >
                    Previous Step
                </Button>
                <Box>
                    {activeStep === steps.length - 1 ? (
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit} 
                            disabled={loading}
                            sx={{ 
                                borderRadius: '12px', 
                                px: 5, 
                                py: 1.5, 
                                fontWeight: 800,
                                background: 'linear-gradient(90deg, #28a745 0%, #1e7e34 100%)',
                                boxShadow: '0 10px 20px rgba(40,167,69,0.3)'
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalize Registration'}
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            onClick={handleNext}
                            sx={{ 
                                borderRadius: '12px', 
                                px: 5, 
                                py: 1.5, 
                                fontWeight: 800,
                                bgcolor: '#fff',
                                color: '#000',
                                '&:hover': { bgcolor: '#eee' }
                            }}
                        >
                            Continue
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default RegistrationForm;
