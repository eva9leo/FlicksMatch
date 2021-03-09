export const initialState = {
    recommendations: [],
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
    movieRecommendations: [],
    showRecommendations: [],
};

export default function reducer(state, action) {
    switch(action.type) {
        case 'CLEAR_RECOMMENDATIONS':
            return {
                ...state,
                recommendations: []
            }
        case 'ADD_RECOMMENDATION':
            return {
                ...state,
                recommendations: [ ...state.recommendations, action.item]
            }
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
        case "ADD_MOVIE_REC":
            return {
                ...state,
                movieRecommendations: [ ...state.movieRecommendations, action.item ]
            }
        case "UPDATE_MOVIE_REC":
            const recIndex = state.movieRecommendations.findIndex(function(rec) {
                return rec.id === action.item[0]
            })
            state.movieRecommendations[recIndex].recBy = [ ...state.movieRecommendations[recIndex].recBy, action.item[1] ]
            return {
                ...state,
            }
        case "REMOVE_MOVIE_REC":
            const movieRemoveIndex = state.movieRecommendations.findIndex(function(rec) {
                return rec.id === action.item[0]
            })
            const i = state.movieRecommendations[movieRemoveIndex].recBy.findIndex(function(m) {
                return m === action.item[1]
            })
            if (i > -1) {
                state.movieRecommendations[movieRemoveIndex].recBy.splice(i, 1)
            }
            return {
                ...state,
            }
        case "DELETE_MOVIE_REC":
            return {
                ...state,
                movieRecommendations: state.movieRecommendations.filter(item => item.id !== action.id)
            }
        case "UPDATE_SHOW_REC":
            const showRecId = action.item[0]
            const showRefId = action.item[1]
            const showRecIndex = state.showRecommendations.findIndex(function(rec) {
                return rec.id === showRecId
            })
            state.showRecommendations[showRecIndex].recBy = [ ...state.showRecommendations[showRecIndex].recBy, showRefId ]
            return {
                ...state,
            }
        case "REMOVE_SHOW_REC":
            const showRemoveIndex = state.showRecommendations.findIndex(function(rec) {
                return rec.id === action.item[0]
            })
            const j = state.showRecommendations[showRemoveIndex].recBy.findIndex(function(m) {
                return m === action.item[1]
            })
            if (j > -1) {
                state.showRecommendations[showRemoveIndex].recBy.splice(i, 1)
            }
            return {
                ...state,
            }
        case "DELETE_SHOW_REC":
            return {
                ...state,
                showRecommendations: state.showRecommendations.filter(item => item.id !== action.id)
            }
        case "ADD_SHOW_REC":
            return {
                ...state,
                showRecommendations: [ ...state.showRecommendations, action.item ]
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
                shows: [],
                movieRecommendations: [],
                showRecommendations: [],
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