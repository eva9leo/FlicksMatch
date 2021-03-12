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
            const movieRef = db.collection('users').doc(user.uid).collection('movieRecs').doc(item.id.toString())
            movieRef.get().then((doc) => {
                if (doc.exists) {
                    // recommendation already exist
                    movieRef.update({
                        recBy: firebase.firestore.FieldValue.arrayUnion(selected.id.toString())
                    })
                } else {
                    // recommendation is new
                    const mediaDetails = {
                        title: item.title ? item.title : item.name,
                        poster_path: item.poster_path ? item.poster_path : null,
                        vote_average: item.vote_average,
                        release_date: item.release_date ? new Date(item.release_date) : null,
                        recBy: [selected.id.toString()]
                    }
                    movieRef.set(mediaDetails)
                }
            })
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
                const showRef = db.collection('users').doc(user.uid).collection('showRecs').doc(item.id.toString())
                showRef.get().then((doc) => {
                    if (doc.exists) {
                        // recommendation already exist
                        showRef.update({
                            recBy: firebase.firestore.FieldValue.arrayUnion(selected.id.toString())
                        })
                    } else {
                        // recommendation is new
                        const mediaDetails = {
                            title: item.title ? item.title : item.name,
                            poster_path: item.poster_path ? item.poster_path : null,
                            vote_average: item.vote_average,
                            release_date: item.release_date ? new Date(item.first_air_date) : null,
                            recBy: [selected.id.toString()]
                        }
                        showRef.set(mediaDetails)
                    }
                })
            })
        }).catch((error) => {Alert.alert(error)})
      }

    const addMovie = e => {
        e.preventDefault();
        const movieRef = db.collection('users').doc(user.uid).collection('movies').doc(selected.id.toString());
        movieRef.get().then((doc) => {
            if (doc.exists) {
                Alert.alert('This is already in your watched list');
            } else {
                const mediaDetails = {
                    title: selected.title ? selected.title : selected.name,
                    poster_path: selected.poster_path ? selected.poster_path : null,
                    vote_average: selected.vote_average,
                    release_date: selected.release_date,
                }
                movieRef.set(mediaDetails)
                .then(() => {
                    // clear existing movies and shows
                    dispatch({
                        type: 'SET_MOVIES',
                        item: []
                    })
                    dispatch({
                        type: 'SET_LAST_MOVIE',
                        item: null
                    })
                    dispatch({
                        type: 'SET_SHOWS',
                        item: []
                    })
                    dispatch({
                        type: 'SET_LAST_SHOW',
                        item: null
                    })
                }
                ).then(() => {
                    recMoviesById(selected.id)
                    navigation.push('Profile');
                })
                .catch(error => Alert.alert('failed to add movie: ' + error.message))
            }
        })
    }

    const addTv = e => {
        e.preventDefault();
        const movieRef = db.collection('users').doc(user.uid).collection('shows').doc(selected.id.toString());
        movieRef.get().then((doc) => {
            if (doc.exists) {
                Alert.alert('This is already in your watched list');
            } else {
                const mediaDetails = {
                    title: selected.title ? selected.title : selected.name,
                    poster_path: selected.poster_path ? selected.poster_path : null,
                    vote_average: selected.vote_average,
                    release_date: selected.release_date,
                }
                movieRef.set(mediaDetails)
                .then(() => {
                    // clear existing movies and shows
                    dispatch({
                        type: 'SET_MOVIES',
                        item: []
                    })
                    dispatch({
                        type: 'SET_LAST_MOVIE',
                        item: null
                    })
                    dispatch({
                        type: 'SET_SHOWS',
                        item: []
                    })
                    dispatch({
                        type: 'SET_LAST_SHOW',
                        item: null
                    })
                })
                .then(() => {
                    recShowsById(selected.id)
                    navigation.push('Profile');
                }
                ).catch(error => Alert.alert('failed to add show: ' + error.message))
            }
        })
    }

    const removeTv = e => {
        e.preventDefault();
        const newMedia = {}
        newMedia['shows.' + selected.id] = firebase.firestore.FieldValue.delete()
        db.collection('watched').doc(user.uid).update(newMedia)
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
                    db.collection('recs').doc(user.uid).update(newRec)
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
                    db.collection('recs').doc(user.uid).update(newRec).then(
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
        const movieRef = db.collection('users').doc(user.uid).collection('movies').doc(selected.id.toString());
        movieRef.get().then((doc) => {
            if (doc.exists) {
                // movie actually exists in watched list
                movieRef.delete().then(() => {
                    // update recommendations
                    db.collection('users').doc(user.uid).collection('movieRecs')
                    .where('recBy', 'array-contains', selected.id.toString()).get().then((recs) => {
                        // TODO
                        console.log(recs)
                    })
                }).catch(error => Alert.alert('Movie failed to delete: ' + error.message))
            } else {
                // movie does not exist in watched list, something went wrong
                Alert.alert('Movie does not exist in your watched list')
            }
        })
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
