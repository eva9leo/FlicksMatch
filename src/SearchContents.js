import React, { useCallback, useContext, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, FlatList, Image, SafeAreaView } from "react-native"
import { IconButton, Colors } from 'react-native-paper'
import { SearchBar } from 'react-native-elements'
import { TMDB_KEY } from "@env"
import ResultBox from './components/ResultBox'
import { useStateValue } from './StateProvider';
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';

export default function SearchContents({ navigation }) {
    const [{ searches }, dispatch] = useStateValue();

    const imgUrl = "https://image.tmdb.org/t/p/w185";
    const [query, setQuery] = useState("");

    const searchMovies = async () => {
        fetch(
            "https://api.themoviedb.org/3/search/movie?api_key=" + 
            TMDB_KEY + 
            "&language=en-US&query=" + 
            encodeURI(query) + 
            "&page=1&include_adult=false"
        ).then((response) => response.json())
        .then((json) => {
            dispatch({
                type: "ADD_SEARCHES",
                item: json.results
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
            dispatch({
                type: "ADD_SEARCHES",
                item: json.results
            })
        })
        .catch((error) => {
            Alert.alert(error)
        })
    }

    const selectHandler = () => {
        alert("Hello")
    }

    const keyExtractor = useCallback((item) => item.id.toString(), []);
    const renderItem = useCallback(
        ({ item }) => <ResultBox item={item} navigation={ navigation } dispatch={ dispatch }/>, []
    );

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
            <SearchBar 
                containerStyle={styles.searchBarContainer} 
                platform="ios" 
                cancelButtonTitle="Cancel" 
                cancelButtonProps={{color:"#fff"}}
                placeholder="Search movies and shows"
                onChangeText={e => setQuery(e)}
                value={query}
                onSubmitEditing={() => {
                    dispatch({
                        type: "CLEAR_SEARCHES"
                    })
                    searchMovies();
                    searchTv();
                }}
            />
            <MaskedView 
                style={styles.maskContainerTop}
                maskElement={ <LinearGradient style={styles.fadeContainer} colors={['transparent', 'black'] } locations={[0.055, 0.075]} /> }
            >
                <MaskedView 
                style={styles.maskContainerBottom}
                maskElement={ <LinearGradient style={styles.fadeContainer} colors={['black', 'transparent'] } locations={[0.93, 0.95]} /> }
                >
                <SafeAreaView style={styles.resultsContainer}>
                    <FlatList 
                        style={{}}
                        initialNumToRender={9}
                        numColumns={3}
                        data={ searches }
                        keyExtractor={keyExtractor}
                        renderItem={ renderItem }
                        style={{ paddingTop: 15}}
                        showsVerticalScrollIndicator={false}
                        
                    />
                </SafeAreaView>
                </MaskedView>
            </MaskedView>
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
        marginTop: 25,
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
    },
    maskContainerTop: {
        marginTop: 100,
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    fadeContainer: {
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    maskContainerBottom: {
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
});