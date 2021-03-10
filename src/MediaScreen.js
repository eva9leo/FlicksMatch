import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { IconButton, Colors } from 'react-native-paper'
import { useStateValue } from './StateProvider';
import { db } from './firebaseConfig';
import firebase from 'firebase';
import MediaDetail from './components/MediaDetail';
import { TMDB_KEY } from "@env";

export default function MediaScreen({ navigation }) {
    const [{ selected, user, insearch, movies, shows, movieRecommendations, showRecommendations }, dispatch] = useStateValue();
    const imgUrl = "https://image.tmdb.org/t/p/original";

    const recMoviesById = async (movieId) => {
      fetch(
        "https://api.themoviedb.org/3/movie/" +
        movieId + "/recommendations?api_key=" +
        TMDB_KEY + "&language=en-US&page=1"
      ).then((response) => response.json())
      .then((json) => {
        json.results.forEach(function(item){
            if (movieRecommendations.some(movie => movie.id === item.id)) {
                // this recommendation already exist
                const curRecIndex = movieRecommendations.findIndex(function(rec) {
                    return rec.id === item.id
                })
                const newRec = {}
                newRec['movieRecs.' + item.id] = [ ...movieRecommendations[curRecIndex].recBy, selected.id]
                db.collection('users').doc(user.uid).update(newRec).then(() => {
                    dispatch({
                        type: "UPDATE_MOVIE_REC",
                        item: [item.id, selected.id]
                    })
                })
            } else {
                // this is a new recommendation
                const newRec = {}
                newRec['movieRecs.' + item.id] = [selected.id]
                db.collection('users').doc(user.uid).update(newRec).then(() => {
                    dispatch({
                        type: "ADD_MOVIE_REC",
                        item: {
                            id: item.id,
                            type: 'movie',
                            recBy: [selected.id]
                        }
                    })
                })
            }
        })
      }).catch((error) => {Alert.alert(error)})
    }

    const recShowsById = async (showId) => {
        fetch(
          "https://api.themoviedb.org/3/tv/" +
          showId + "/recommendations?api_key=" +
          TMDB_KEY + "&language=en-US&page=1"
        ).then((response) => response.json())
        .then((json) => {
            json.results.forEach(function(item){
                if (showRecommendations.some(show => show.id === item.id)) {
                    // this recommendation already exist
                    const curRecIndex = showRecommendations.findIndex(function(rec) {
                        return rec.id === item.id
                    })
                    const newRec = {}
                    newRec['showRecs.' + item.id] = [ ...showRecommendations[curRecIndex].recBy, selected.id]
                    db.collection('users').doc(user.uid).update(newRec).then(() => {
                        dispatch({
                            type: "UPDATE_SHOW_REC",
                            item: [item.id, selected.id]
                        })
                    })
                } else {
                    // this is a new recommendation
                    const newRec = {}
                    newRec['showRecs.' + item.id] = [selected.id]
                    db.collection('users').doc(user.uid).update(newRec).then(() => {
                        dispatch({
                            type: "ADD_SHOW_REC",
                            item: {
                                id: item.id,
                                type: 'tv',
                                recBy: [selected.id]
                            }
                        })
                    })
                }
            })
        }).catch((error) => {Alert.alert(error)})
      }

    const addMovie = e => {
        if (movies.some(item => item.id === selected.id)) {
            Alert.alert('This is already in your watched list');
        } else {
            e.preventDefault();
            const newMedia = {}
            const mediaDetails = {
                name: selected.name? selected.name : null,
                title: selected.title ? selected.title : null,
                poster_path: selected.poster_path ? selected.poster_path : null,
                vote_average: selected.vote_average,
                release_date: selected.release_date ? selected.release_date : null,
                type: 'movie'
            }
            newMedia['movies.' + selected.id] = mediaDetails 
            db.collection('users').doc(user.uid).update(newMedia)
            .then(() => {
                dispatch({
                    type: 'ADD_MOVIE',
                    item: {
                        id: selected.id,
                        name: selected.name? selected.name : null,
                        title: selected.title ? selected.title : null,
                        poster_path: selected.poster_path ? selected.poster_path : null,
                        vote_average: selected.vote_average,
                        release_date: selected.release_date ? selected.release_date : null,
                        type: 'movie'
                    }
                });
                recMoviesById(selected.id)
                navigation.goBack();
            }
            ).catch(error => Alert.alert(error.message))
        }
    }

    const addTv = e => {
        if (shows.some(item => item.id === selected.id)) {
            Alert.alert('This is already in your watched list');
        } else {
            e.preventDefault();
            const newMedia = {}
            const mediaDetails = {
                name: selected.name? selected.name : null,
                title: selected.title ? selected.title : null,
                poster_path: selected.poster_path ? selected.poster_path : null,
                vote_average: selected.vote_average,
                release_date: selected.release_date ? selected.release_date : null,
                type: 'tv'
            }
            newMedia['shows.' + selected.id] = mediaDetails 
            db.collection('users').doc(user.uid).update(newMedia).
            then(() => {
                dispatch({
                    type: 'ADD_SHOW',
                    item: {
                        id: selected.id,
                        name: selected.name? selected.name : null,
                        title: selected.title ? selected.title : null,
                        poster_path: selected.poster_path ? selected.poster_path : null,
                        vote_average: selected.vote_average,
                        release_date: selected.release_date ? selected.release_date : null,
                        type: 'tv'
                    }
                });
                recShowsById(selected.id)
                navigation.goBack();
            }).catch(error => Alert.alert(error.message))
        }
    }

    const removeTv = e => {
        e.preventDefault();
        const newMedia = {}
        newMedia['shows.' + selected.id] = firebase.firestore.FieldValue.delete()
        db.collection('users').doc(user.uid).update(newMedia)
        .then(() => {
            dispatch({
                type: "REMOVE_SHOW",
                id: selected.id
            })
        }).then(() => {
            // update any recommended shows that were related to the show being deleted
            const recs = showRecommendations.filter(item => item.recBy.includes(selected.id))
            recs.forEach(function(rec) {
                if (rec.recBy.length === 1) {
                    // when the recommended show should be removed
                    const newRec = {}
                    newRec['showRecs.' + rec.id] = firebase.firestore.FieldValue.delete()
                    db.collection('users').doc(user.uid).update(newRec)
                    .then(() => {
                        dispatch({
                            type: "DELETE_SHOW_REC",
                            id: rec.id
                        })
                    })
                } else {
                    // when the recommended show should be updated
                    const newRec = {}
                    const curIndex = rec.recBy.findIndex(function(m) {
                        return m === selected.id
                    })
                    if (curIndex > -1) {
                        rec.recBy.splice(curIndex, 1)
                    }
                    newRec['showRecs.' + rec.id] = rec.recBy
                    db.collection('users').doc(user.uid).update(newRec).then(
                        dispatch({
                            type: "REMOVE_SHOW_REC",
                            item: [rec.id, selected.id]
                        })
                    )
                }
            })
            navigation.goBack();
        }).catch(error => Alert.alert(error.message))
    }

    const removeMovie = e => {
        e.preventDefault();
        const newMedia = {}
        newMedia['movies.' + selected.id] = firebase.firestore.FieldValue.delete()
        db.collection('users').doc(user.uid).update(newMedia).then(() => {
            dispatch({
                type: "REMOVE_MOVIE",
                id: selected.id
            })
        }).then(() => {
            // update any recommended movies that were related to the movie being deleted
            const recs = movieRecommendations.filter(item => item.recBy.includes(selected.id))
            recs.forEach(function(rec) {
                if (rec.recBy.length === 1) {
                    // when the recommended movie should be removed
                    const newRec = {}
                    newRec['movieRecs.' + rec.id] = firebase.firestore.FieldValue.delete()
                    db.collection('users').doc(user.uid).update(newRec)
                    .then(() => {
                        dispatch({
                            type: "DELETE_MOVIE_REC",
                            id: rec.id
                        })
                    })
                } else {
                    // when the recommended movie should be updated
                    const newRec = {}
                    const curIndex = rec.recBy.findIndex(function(m) {
                        return m === selected.id
                    })
                    if (curIndex > -1) {
                        rec.recBy.splice(curIndex, 1)
                    }
                    newRec['movieRecs.' + rec.id] = rec.recBy
                    db.collection('users').doc(user.uid).update(newRec).then(
                        dispatch({
                            type: "REMOVE_MOVIE_REC",
                            item: [rec.id, selected.id]
                        })
                    )
                }
            })
            navigation.goBack();
        }).catch(error => Alert.alert(error.message))
    }

    return (
        <View style={styles.container}>
            <IconButton 
                style={styles.backButton} 
                icon="chevron-left" 
                color={Colors.white} 
                size={35} 
                onPress={() => {
                    navigation.goBack();
                }}
            />
            {insearch ? (
                <IconButton 
                    style={styles.addButton} 
                    icon="check" 
                    color={Colors.white} 
                    size={35} 
                    onPress={selected.type === 'movie' ? addMovie : addTv}
                />
            ) : (
                <IconButton 
                    style={styles.addButton} 
                    icon="delete" 
                    color={Colors.white} 
                    size={35} 
                    onPress={selected.type === 'movie' ? removeMovie : removeTv}
                />
            )}
            <MediaDetail selected={ selected }/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#f2784b",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: -5
    },
    titleText: {
        fontSize: 80,
        textAlign: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        width: '80%',
        height: '60%',
        backgroundColor: '#C1C1C1',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButton: {
        position: "absolute",
        top: 40,
        right: 5
    }
});
