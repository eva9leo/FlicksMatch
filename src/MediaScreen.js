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
                            name: item.name,
                            title: item.title,
                            poster_path: item.poster_path,
                            overview: item.overview,
                            vote_average: item.vote_average,
                            release_date: item.release_date,
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
                                name: item.name,
                                title: item.title,
                                poster_path: item.poster_path,
                                overview: item.overview,
                                vote_average: item.vote_average,
                                release_date: item.first_air_date,
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
            db.collection('users').doc(user.uid).update({
                movies: firebase.firestore.FieldValue.arrayUnion(selected.id.toString())
            }).then(() => {
                dispatch({
                    type: 'ADD_MOVIE',
                    item: selected
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
            db.collection('users').doc(user.uid).update({
                shows: firebase.firestore.FieldValue.arrayUnion(selected.id.toString())
            }).then(() => {
                dispatch({
                    type: 'ADD_SHOW',
                    item: selected
                });
                recShowsById(selected.id).then((results) => {
                    console.log(results)
                })
                navigation.goBack();
            }).catch(error => Alert.alert(error.message))
        }
    }

    const removeTv = e => {
        e.preventDefault();
        db.collection('users').doc(user.uid).update({
            shows: firebase.firestore.FieldValue.arrayRemove(selected.id.toString())
        }).then(() => {
            dispatch({
                type: "REMOVE_SHOW",
                id: selected.id
            })
        }).then(() => {
            navigation.goBack();
        }).catch(error => Alert.alert(error.message))
    }

    const removeMovie = e => {
        e.preventDefault();
        db.collection('users').doc(user.uid).update({
            movies: firebase.firestore.FieldValue.arrayRemove(selected.id.toString())
        }).then(() => {
            dispatch({
                type: "REMOVE_MOVIE",
                id: selected.id
            })
        }).then(() => {
            // console.log(movies)
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
