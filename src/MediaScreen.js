import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { IconButton, Colors } from 'react-native-paper'
import { useStateValue } from './StateProvider';
import { db } from './firebaseConfig';
import firebase from 'firebase'

export default function MediaScreen({ navigation }) {
    const [{ selected, user, insearch, movies, shows }, dispatch] = useStateValue();
    const imgUrl = "https://image.tmdb.org/t/p/original";

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
                size={45} 
                onPress={() => {
                    navigation.goBack();
                }}
            />
            {insearch ? (
                <IconButton 
                    style={styles.addButton} 
                    icon="check" 
                    color={Colors.white} 
                    size={45} 
                    onPress={selected.type === 'movie' ? addMovie : addTv}
                />
            ) : (
                <IconButton 
                    style={styles.addButton} 
                    icon="delete" 
                    color={Colors.white} 
                    size={45} 
                    onPress={selected.type === 'movie' ? removeMovie : removeTv}
                />
            )}
            
            {selected.poster_path ? (
                <Image 
                    source={{uri: imgUrl + selected.poster_path}} 
                    style={{ height: "50%", width: "80%", resizeMode: 'contain' }}
                />
              ) : (
                
                <View style={styles.titleContainer}>
                    <Text 
                    adjustsFontSizeToFit
                    numberOfLines={4}
                    style={styles.titleText}>
                        {selected.title ? selected.title : selected.name}
                    </Text>
                </View>
              )}
            <Text>{selected.title ? selected.title : selected.name}</Text>
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
