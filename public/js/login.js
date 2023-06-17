import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
    try{
        const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', {
            email,
            password
        });
        
        if(res.data.status === 'success'){
            showAlert("success",'Logged in successfully.');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1000)
        }
    }
    catch(err){
         showAlert('error',err.response.data.message);
    }
};

export const logOut = async () => {
    try{
        const res = await axios.get('http://127.0.0.1:3000/api/v1/users/logout');
        
        if(res.data.status === 'success'){
            location.reload(true);            
        }
    }
    catch(err){
         showAlert('error', 'Error logging out! Please try again');
    }
};
