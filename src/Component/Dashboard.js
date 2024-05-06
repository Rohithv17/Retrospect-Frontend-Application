import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Box, Typography, Button } from '@mui/material';
import RetrospectService from '../Service/RetrospectService';
import { useParams } from 'react-router-dom';
import Createroom from './Createroom';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const { userId, userRole } = useParams();
    const [reloadDashboard, setReloadDashboard] = useState(false);
    const [roomToUpdate, setRoomToUpdate] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await RetrospectService.getAllRooms(userId);
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
            localStorage.removeItem('userEmail');
            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [userId, reloadDashboard]);

    const openRoom = (url) => {
        window.open(url, '_blank');
    }

    const handleCreateRoomSuccess = async () => {
        setRoomToUpdate(null);
        try {
            setReloadDashboard(prevState => !prevState);
        } catch (error) {
            console.error('Error handling room creation success:', error);
        }
    };

    const handleUpdateRoom = (room) => {
        if (room.roomId) {
            console.log('Updating room with id:', room.roomId);
            setRoomToUpdate(room);
        } else {
            console.error('Room id is undefined:', room);
        }
    };

    return (
        <div>
            <Header role={userRole} onCreateRoom={() => setRoomToUpdate({})} />
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', marginTop: '20px', marginLeft:'7%' }}>
                {rooms.map((room, index) => (
                    <Box key={room.id || index} sx={{ position: 'relative', width: '25%', height: '160px', marginLeft: '20px', marginTop: '30px', padding: '20px', border: '3px solid black', borderRadius: '2px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', ':hover': { transform: 'scale(1.02)' }, backgroundColor: "#f2f2f2" }}>
                        <img src={room.room_image} alt="Room" style={{ position: 'absolute', top: 0, left: 0, width: '38%', height: '100%', objectFit: 'cover' }} />
                        <Typography variant="h7" gutterBottom style={{ position: 'absolute', top: '5%', left: '60%', transform: 'translateX(-30%)', color: 'black', borderRadius: '5px', fontWeight: 'bold' }}>
                            {room.roomName}
                        </Typography>
                        <Typography variant="body2" style={{ position: 'absolute', textAlign: 'left', top: '30%', left: '47%', color: 'grey', maxWidth: '50%' }}>
                            {room.roomDescription}
                        </Typography>
                        <div style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: room.roomStatus === 'active' ? '#4ef037' : '#ff0000' }}></div>
                        <div style={{ position: 'absolute', bottom: '10px', right: '6%', display: 'flex' }}>
                            {userRole === 'admin' && (
                                <Button variant="outlined" onClick={() => handleUpdateRoom(room)} style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', width: '30px', fontSize: '10px', borderColor: 'black' }}>Update</Button>
                            )}
                            {room.roomStatus === 'active' ? (
                                <Button variant="contained" onClick={() => openRoom('/chatroom')} style={{ backgroundColor: 'black', color: 'white', fontSize: '10px' }}>Enter Room</Button>
                            ) : (
                                <Button disabled style={{ fontWeight: 'bolder', color: '#5f6769', fontSize: '10px' }}>Room closed</Button>
                            )}
                        </div>
                    </Box>
                ))}
            </div>
            <Createroom open={!!roomToUpdate} onClose={() => setRoomToUpdate(null)} onCreateSuccess={handleCreateRoomSuccess} roomToUpdate={roomToUpdate} />
        </div>
    );
}

export default Dashboard;
