import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Profile = ({onLogout}) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [sex, setSex] = useState('Male');
  const [userType, setUserType] = useState('Student');

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfilePic(imageUrl);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name);
      setUserType(user.role);
      setSex(user.sex);
      setDateOfBirth(user.dateOfBirth);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate('/');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: 3
        }}
      >
        <CardContent>
          <Stack spacing={1} alignItems="center" mb={2}>
            <Box position="relative">
              <Avatar
                alt="Profile Picture"
                src={profilePic}
                sx={{
                  width: 120,
                  height: 120,
                  border: '2px solid white'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  '&:hover': {
                    backgroundColor: '#f1f1f1'
                  }
                }}
                aria-label="edit-picture"
                component="label"
              >
                <EditIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </IconButton>
            </Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: '#333', textAlign: 'center' }}
            >
              {name.trim() !== '' ? name : 'Your Name'}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {userType}
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ pl: 1, pt: 0.5 }}>
                  {name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1" sx={{ pl: 1, pt: 0.5 }}>
                  {dateOfBirth}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Sex
                </Typography>
                <Typography variant="body1" sx={{ pl: 1, pt: 0.5 }}>
                  {sex}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" sx={{ pl: 1, pt: 0.5 }}>
                  {userType}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', py: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ mr: 2 }}
          >
            Logout
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Profile;
