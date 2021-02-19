import React, { useContext, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, FlatList, Image, SafeAreaView } from "react-native"
// import { AuthContext } from "./StateProvider"
import { IconButton, Colors } from 'react-native-paper'
import { SearchBar } from 'react-native-elements'
import { TMDB_KEY } from "@env"

export default function SearchContents({ navigation }) {
    // const {currentUser} = useContext(AuthContext);
    const imgUrl = "https://image.tmdb.org/t/p/original";
    const [query, setQuery] = useState("");
    const [moveisState, setMoviesState] = useState({
        movieResults: [],
        tvResults: [],
        selected: {}
    });
    const searchMovies = async () => {
        fetch(
            "https://api.themoviedb.org/3/search/movie?api_key=" + 
            TMDB_KEY + 
            "&language=en-US&query=" + 
            encodeURI(query) + 
            "&page=1&include_adult=false"
        ).then((response) => response.json())
        .then((json) => {
            // console.log(json.results)
            setMoviesState(prevState => {
                return { ...prevState, movieResults: json.results }
            })
        })
        .catch((error) => {
            Alert.alert(error)
        })
    }
    const searchTv = async () => {
        fetch(
            "https://api.themoviedb.org/3/search/tv?api_key=" + 
            TMDB_KEY + 
            "&language=en-US&query=" + 
            encodeURI(query) + 
            "&page=1&include_adult=false"
        ).then((response) => response.json())
        .then((json) => {
            // console.log(json.results)
            setMoviesState(prevState => {
                return { ...prevState, tvResults: json.results }
            })
        })
        .catch((error) => {
            Alert.alert(error)
        })
    }

    return (
        <View style={styles.container}>
            <IconButton 
                style={styles.backButton} 
                icon="chevron-left" 
                color={Colors.white} 
                size={45} 
                onPress={() => navigation.goBack()}
            />
            <SearchBar 
                containerStyle={styles.searchBarContainer} 
                platform="ios" 
                cancelButtonTitle="Cancel" 
                cancelButtonProps={{color:"#fff"}}
                placeholder="Search movies and shows"
                onChangeText={e => setQuery(e)}
                value={query}
                onSubmitEditing={() => {searchMovies(); searchTv();}}
            />
            <SafeAreaView style={styles.resultsContainer}>
                <FlatList 
                    style={{}}
                    initialNumToRender={9}
                    numColumns={3}
                    data={ [ ...moveisState.movieResults, ...moveisState.tvResults] }
                    keyExtractor={item => item.id + ''}
                    renderItem={({ item }) => {
                        return (
                        <TouchableOpacity 
                            onPress={() => {Alert.alert(item.title ? item.title : item.name)}} 
                            activeOpacity={1}
                            style={ styles.touchContainer }
                        >
                            <View style={styles.resultContainer}>
                                <Image 
                                    source={item.poster_path ? {uri: imgUrl + item.poster_path} : require("../assets/placeholder.png")} 
                                    style={{ height: 250, width: "100%", resizeMode: "contain"}}
                                    
                                />
                            </View>
                        </TouchableOpacity>
                        );
                    }}
                />
            </SafeAreaView>
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
    searchBarContainer: {
        position: "absolute",
        top: 45,
        left: 60,
        width: "83%",
        backgroundColor: "#f2784b",
        borderBottomColor: "transparent",
        borderTopColor: "transparent"
    },
    resultsContainer: {
        marginTop: 130,
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    resultContainer: {
        height: '100%', 
        width: '100%', 
        flex: 1
    },
    touchContainer: {
        width: '30%',
        height: '40%'
    }
});