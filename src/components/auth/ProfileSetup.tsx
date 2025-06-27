import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import examService from '../../services/examService';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [formData, setFormData] = useState({
    date_of_birth: '',
    profile_picture: null as File | null,
    institution_name: '',
    examination_type: '',
    grade: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [examTypes, setExamTypes] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files) {
      setFormData(prev => ({ ...prev, profile_picture: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = new FormData();
      data.append('date_of_birth', formData.date_of_birth);
      if (formData.profile_picture) data.append('profile_picture', formData.profile_picture);
      data.append('institution_name', formData.institution_name);
      data.append('examination_type_id', formData.examination_type);
      data.append('grade', formData.grade);
      await api.put('/users/profile/update/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getExamTypes = async () => {
      try {
        const types = await examService.fetchAllExamTypes();
        if ((types)) {
          setExamTypes(types?.results);
        }
      } catch (err) {
        // setExamTypes(['WAEC', 'NECO', 'JAMB', 'Other']); // fallback
      }
    };
    getExamTypes();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >   <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" textAlign="center">Complete Your Profile</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Profile updated! Redirecting...</Alert>}
            <TextField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <Button variant="contained" component="label">
              Upload Profile Picture
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </Button>
            {formData.profile_picture && <Typography variant="body2">{formData.profile_picture.name}</Typography>}
            <TextField
              label="Institution Name"
              name="institution_name"
              value={formData.institution_name}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Examination Type</InputLabel>
              <Select
                name="examination_type"
                value={formData.examination_type}
                label="Examination Type"
                onChange={handleSelectChange}
              >
                {examTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              Save Profile
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}; 

