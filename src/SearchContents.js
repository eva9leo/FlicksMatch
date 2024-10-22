import React, { useCallback, useContext, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, FlatList, Image, SafeAreaView } from "react-native"
import { IconButton, Colors } from 'react-native-paper'
import { SearchBar } from 'react-native-elements'
import { TMDB_KEY } from "@env"
import ResultBox from './components/ResultBox'
import { useStateValue } from './StateProvider';
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';
import TransitionView from './components/TransitionView';
import { CompareDates, ReversedCompareDates } from './helpers';

export default function SearchContents({ navigation }) {
    const flatListRef = React.useRef()
    const [{ searches, searchReverseOrder }, dispatch] = useStateValue();

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
                item: json.results.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        title: item.title,
                        poster_path: item.poster_path,
                        overview: item.overview,
                        vote_average: item.vote_average,
                        release_date: item.release_date,
                        type: 'movie'
                    }
                })
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
                item: json.results.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        title: item.title,
                        poster_path: item.poster_path,
                        overview: item.overview,
                        vote_average: item.vote_average,
                        release_date: item.first_air_date,
                        type: 'tv'
                    }
                })
            })
        })
        .catch((error) => {
            Alert.alert(error)
        })
    }

    const keyExtractor = useCallback((item) => item.id.toString(), []);
    const renderItem = useCallback(
        ({ item, index }) => 
        <TransitionView index={ index }>
            <ResultBox item={item} navigation={ navigation } dispatch={ dispatch } />
        </TransitionView>
        , []
    );

    return (
        <View style={styles.container}>
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
                        ref={flatListRef}
                        initialNumToRender={9}
                        numColumns={3}
                        data={ searches.sort(searchReverseOrder ? ReversedCompareDates : CompareDates) }
                        keyExtractor={keyExtractor}
                        renderItem={ renderItem }
                        style={{ paddingTop: 23, width: '100%' }}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}
                        
                    />
                </SafeAreaView>
                </MaskedView>
            </MaskedView>
            <IconButton 
                style={styles.backButton} 
                icon="chevron-left" 
                color={Colors.white} 
                size={35} 
                onPress={() => {
                    dispatch({
                        type: "SET_INSEARCH"
                    });
                    navigation.goBack();
                }}
            />
            <IconButton 
                style={styles.filterButton} 
                icon="tune" 
                color={Colors.white} 
                size={27} 
                onPress={() => {
                    // Alert.alert('Filter place holder')
                    dispatch({type:'REVERSE_SEARCH_ORDER'})
                    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
                }}
            />
            <SearchBar 
                containerStyle={styles.searchBarContainer} 
                inputContainerStyle={{ height: '100%', borderRadius: 20 }}
                platform="ios" 
                cancelButtonTitle="Cancel" 
                cancelButtonProps={{color:"#fff"}}
                placeholder="Search movies and shows"
                onChangeText={e => setQuery(e)}
                value={query}
                // round={true}
                onSubmitEditing={() => {
                    // clear search results and fill in new results
                    dispatch({
                        type: "CLEAR_SEARCHES"
                    })
                    searchMovies();
                    searchTv();
                }}
            />
            
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
        left: -2
    },
    filterButton: {
        position: "absolute",
        top: 46,
        right: 0
    },
    searchBarContainer: {
        position: "absolute",
        top: 54,
        left: 50,
        height: 35,
        width: "74%",
        backgroundColor: "transparent",
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
        marginTop: 68,
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