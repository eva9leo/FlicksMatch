export const initialState = {
    watched: [],
    user: null,
    searches: [],
    selected: null,
    shows: [],
    movies: [],
    firstname: null,
    lastname: null,
    unsubscribe: null,
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
        case "SET_SHOWS":
            return {
                ...state,
                shows: action.item
            }
        case "SET_MOVIES":
            return {
                ...state,
                movies: action.item
            }
        case "CLEAR_CONTENT":
            return {
                ...state,
                movies: [],
                shows: []
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
        case "SET_NAME":
            return {
                ...state,
                firstname: action.item[0],
                lastname: action.item[1]
            }
        case "SET_UNSUBSCRIBE":
            return {
                ...state,
                unsubscribe: action.item
            }
        default:
            return state;
    }
}