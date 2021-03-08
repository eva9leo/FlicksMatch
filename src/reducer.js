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
    insearch: false,
    ready: false,
    orderBy: 'date',
    reverseOrder: false,
    searchOrderBy: 'date',
    searchReverseOrder: false,
};

export default function reducer(state, action) {
    switch(action.type) {
        case 'REVERSE_ORDER':
            return {
                ...state,
                reverseOrder: !state.reverseOrder
            }
        case 'REVERSE_SEARCH_ORDER':
            return {
                ...state,
                searchReverseOrder: !state.searchReverseOrder
            }
        case 'SET_READY':
            return {
                ...state,
                ready: !state.ready
            };
        case 'SET_INSEARCH': 
            return {
                ...state,
                insearch: !state.insearch
            }
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
        case "SET_MOVIE":
            return {
                ...state,
                movies: action.item
            }
        case "ADD_SHOW":
            return {
                ...state,
                shows: [ ...state.shows, action.item]
            }
        case "ADD_MOVIE":
            return {
                ...state,
                movies: [ ...state.movies, action.item]
            }
        case "REMOVE_SHOW":
            return {
                ...state,
                shows: state.shows.filter(item => item.id !== action.id)
            }
        case "REMOVE_MOVIE":
            return {
                ...state,
                movies: state.movies.filter(item => item.id !== action.id)
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