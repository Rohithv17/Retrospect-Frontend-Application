import React, { useState, useEffect } from 'react';
import Header from './Header';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { TextField, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import RetrospectService from '../Service/RetrospectService';
import night from '../Asserts/night.jpg'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await RetrospectService.loginUser({
        userEmail: formData.email,
        userPassword: formData.password
      });

      if (response && response.data) {
        localStorage.setItem('token', response.data);

        const userDetailsResponse = await RetrospectService.getUserByToken(response.data);
        const userEmail = userDetailsResponse.data.userEmail;
        localStorage.setItem('userEmail', userEmail); 

        setUserEmail(userEmail);

        const userId = userDetailsResponse.data.userId;
        const userRole = userDetailsResponse.data.userRole;

        console.log(userDetailsResponse.data.user)

        navigate(`/dashboard/${userId}/${userRole}`);
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Header userEmail={userEmail} />
<Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }}
>
 
 
  <Box
    // backgroundColor="black"
    height={310}
    width={400}
    marginTop='5%'
    marginBottom='2%'
    display="flex"
    flexDirection="column"
    alignItems="center"
    
    p={2}
    borderRadius={1}
    backgroundImage= {night}
    sx={{
      backgroundColor:'black',
      border: '3px solid #FF69B4',
      fontFamily: 'Arial, sans-serif',
      color: '#E066FF',
       backgroundImage: {night} , 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <Typography variant='h6' fontWeight='bold'>
      LOGIN
    </Typography>
    <Box display='flex' alignItems='center' marginTop={4} marginBottom={4}>
      <TextField name="email" value={formData.email} onChange={handleChange} variant='outlined' size='small' placeholder='Enter your Email...' sx={{ '& input': { padding: '5px 35px' }, backgroundColor: 'white' , border:'3px solid white'}} />
    </Box>
    <Box display='flex' alignItems='center' marginTop={2} marginBottom={4}>
      <TextField name='password' type='password' value={formData.password} onChange={handleChange} variant='outlined' size='small' placeholder='Enter your Password...' sx={{ '& input': { padding: '5px 35px' }, backgroundColor: 'white' }} />
    </Box>
    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ justifyContent: 'center', borderRadius: '20px' }}>
      Login
    </Button>
    {error && (
      <Typography variant="body1" color="error" sx={{ marginTop: '10px' }}>
        {error}
      </Typography>
    )}
    <Box display="flex" justifyContent="left" marginBottom={4} marginLeft={2} marginTop={2} color={''}>
      <span style={{ fontStyle: 'italic' }}> Don't have an account ? </span>
      <Link component={RouterLink} to="/registration" color="#FF69B4" underline="none">
        Click Here
      </Link>
    </Box>
  </Box>
</Box>
    </>
  );
}

export default Login;

