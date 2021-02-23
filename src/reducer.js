export const initialState = {
    watched: [],
    user: null,
    searches: [],
    selected: null
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
        case "ADD_SEARCHES":
            return {
                ...state,
                searches: [ ...state.searches, ...action.item]
            }
        case "CLEAR_SEARCHES":
            return {
                ...state,
                searches: []
            }
        case "SET_SELECTED":
            return {
                ...state,
                selected: action.item
            }
        default:
            return state;
    }
}