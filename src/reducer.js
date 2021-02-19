export const initialState = {
    likes: [],
    user: null,
};

export default function reducer(state, action) {
    switch(action.type) {
        case 'ADD_TO_LIKES':
            return {
                ...state,
                basket: [...state.basket, action.item]
            };
        case "SET_USER":
            return {
                ...state,
                user: action.user
            };
        default:
            return state;
    }
}