import {api} from "../utils/api";
import jwt_decode from "jwt-decode";
import {MAIN_PAGE_ROUTE} from "../utils/routes";

export const login = async (email, password, setIsAuthenticated) => {
    try {
        const { data } = await api.post(`/auth/authenticate`, {email, password});
        const decoded = jwt_decode(data.token);
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', decoded.email);
        setIsAuthenticated(true);
        return decoded;
    } catch (error) {
        console.log('Error response:', error.response);
        if (error.response && error.response.status === 409) {
            throw new Error(error.response.data.error);
        } else {
            console.error(error);
            throw error;
        }
    }
};

export const register = async (firstName,
                               lastName,
                               email,
                               password,
                               phoneNumber,
                               country,
                               region,
                               city,
                               setIsAuthenticated) => {
    try {
        const {data} = await api.post(`auth/register`,
            {firstName, lastName, email, password, phoneNumber, country, region, city});
        const decoded = jwt_decode(data.token);
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', decoded.email);
        setIsAuthenticated(true);
        return decoded;
    } catch (error) {
        console.log('Error response:', error.response);
        if (error.response && error.response.status === 409) {
            throw new Error(error.response.data.error);
        } else {
            console.error(error);
            throw error;
        }
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = MAIN_PAGE_ROUTE;
};

const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const decoded = jwt_decode(token);
        if (!decoded || !decoded.id) {
            throw new Error('User ID not found');
        }
        localStorage.setItem('userId', decoded.id); // Store userId in localStorage
        return decoded.id;
    } catch (error) {
        console.error('Error decoding token:', error);
        throw new Error('Invalid token');
    }
};

export const getUserDetails = async () => {
    const userId = getUserIdFromToken();

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    try {
        const response = await api.get(`users/${userId}`, { headers });
        console.log('User details:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user details:', error);
        throw error;
    }
};


export const uploadAvatar = async (file) => {
    const userId = getUserIdFromToken();
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    };
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await api.post(`/users/${userId}/avatar`, formData, { headers });
        return response.data;
    } catch (error) {
        console.error('Failed to upload avatar:', error);
        throw error;
    }
};

export const deleteAvatar = async () => {
    const userId = getUserIdFromToken();
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    };

    try {
        const response = await api.delete(`/users/${userId}/avatar/delete`, { headers });
        return response.data;
    } catch (error) {
        console.error('Failed to delete avatar:', error);
        throw error;
    }
};

export const updateUserDetails = async (userId, updates) => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    try {
        const response = await api.patch(`/users/update/${userId}`, updates, { headers });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user details', error);
        throw error;
    }
};

export const updateUserPassword = async (userId, oldPassword, newPassword) => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    const data = { oldPassword, newPassword };
    try {
        const response = await api.put(`/users/${userId}/password`, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Failed to update password', error);
        throw error;
    }
};
