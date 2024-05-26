import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    _id: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginRedux: (state, action) => {
            // Ensure payload contains `data` if necessary
            const userData = action.payload.data || action.payload;
            state._id = userData._id;
            state.firstName = userData.firstName;
            state.lastName = userData.lastName;
            state.email = userData.email;
            state.image = userData.image;
        },
        logoutRedux: (state) => {
            state._id = '';
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.image = '';
        },
    },
});

export const { loginRedux, logoutRedux } = userSlice.actions;

export default userSlice.reducer;
