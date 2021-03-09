import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import Login from "./Login";
import Start from "./Start";
import Register from "./Register";
import Profile from "./Profile";
import Home from "./Home";
import MediaScreen from "./MediaScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useStateValue } from './StateProvider';
import { auth, db } from './firebaseConfig';
import { TMDB_KEY } from "@env"
import SearchContents from "./SearchContents"

export default function Index() {
  const Stack = createStackNavigator();
  const [{ user, shows, movies, ready }, dispatch] = useStateValue();

  // const recMoviesById = async (movieId) => {
  //   fetch(
  //     "https://api.themoviedb.org/3/movie/" +
  //     movieId + "/recommendations?api_key=" +
  //     TMDB_KEY + "&language=en-US&page=1"
  //   ).then((response) => response.json())
  //   .then((json) => {
  //     console.log(json)
  //   }).catch((error) => {Alert.alert(error)})
  // }

  // const recShowsById = async (showId) => {
  //   fetch(
  //     "https://api.themoviedb.org/3/tv/" +
  //     showId + "/recommendations?api_key=" +
  //     TMDB_KEY + "&language=en-US&page=1"
  //   ).then((response) => response.json())
  //   .then((json) => {
  //     console.log(json)
  //   }).catch((error) => {Alert.alert(error)})
  // }
  const searchMovieById = async (movieId, rec=null) => {
    fetch(
      "https://api.themoviedb.org/3/movie/" +
      movieId + "?api_key=" +
      TMDB_KEY +
      "&language=en-US"
    ).then((response) => response.json())
    .then((item) => {
      if (rec) {
        dispatch({
          type: "ADD_RECOMMENDATION",
          item: {
            id: item.id,
            name: item.name,
            title: item.title,
            poster_path: item.poster_path,
            overview: item.overview,
            vote_average: item.vote_average,
            release_date: item.release_date,
            type: 'movie',
            recBy: rec
          }
        });
      } else {
        dispatch({
          type: "ADD_MOVIE",
          item: {
            id: item.id,
            name: item.name,
            title: item.title,
            poster_path: item.poster_path,
            overview: item.overview,
            vote_average: item.vote_average,
            release_date: item.release_date,
            type: 'movie'
          }
        });
      }
    })
  }

  const searchShowById = async (showId, rec=null) => {
    fetch(
      "https://api.themoviedb.org/3/tv/" +
      showId + "?api_key=" +
      TMDB_KEY +
      "&language=en-US"
    ).then((response) => response.json())
    .then((item) => {
      if (rec) {
        dispatch({
          type: "ADD_RECOMMENDATION",
          item: {
            id: item.id,
            name: item.name,
            title: item.title,
            poster_path: item.poster_path,
            overview: item.overview,
            vote_average: item.vote_average,
            release_date: item.first_air_date,
            type: 'tv',
            recBy: rec
          }
        });
      } else {
        dispatch({
          type: "ADD_SHOW",
          item: {
            id: item.id,
            name: item.name,
            title: item.title,
            poster_path: item.poster_path,
            overview: item.overview,
            vote_average: item.vote_average,
            release_date: item.first_air_date,
            type: 'tv'
          }
        });
      }
    })
  }
  
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch({
          type: 'SET_USER',
          user: authUser
        });
      } else {
        dispatch({
          type: 'SET_USER',
          user: null
        });
        dispatch({
          type: "SET_UNSUBSCRIBE",
          item: null
        });
        dispatch({
          type: "SET_NAME",
          item: [null, null]
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user) { // when user is logged in
      db.collection('users').doc(user.uid).get().then((doc) => {
        if (doc) {
          const userData = doc.data();
          userData.movies.forEach(function(movie) {
            searchMovieById(movie)
          })
          userData.shows.forEach(function(show) {
            searchShowById(show)
          })
          setTimeout(function(){
            dispatch({ type: 'SET_READY' })
          }, 100)
          for (const rec in userData.movieRecs) {
            dispatch({
              type: "ADD_MOVIE_REC",
              item: {
                id: rec,
                type: 'movie',
                recBy: userData.movieRecs[rec.toString()]
              }
            })
            // searchMovieById(rec, userData.movieRecs[rec.toString()])
            // console.log(rec + ': ' + Array.isArray(userData.movieRecs[rec.toString()]))
          }
          for (const rec in userData.showRecs) {
            dispatch({
              type: "ADD_SHOW_REC",
              item: {
                id: rec,
                type: 'tv',
                recBy: userData.showRecs[rec.toString()]
              }
            })
            // searchShowById(rec, userData.showRecs[rec.toString()])
          }
        }
      })
      .catch((error) => {
        console.log("Error getting document", error)
      })
      // const unsubscribe = db.collection('users').doc(user.uid).onSnapshot((doc) => {
      //   if (doc) {
      //     const userData = doc.data();
      //     // set user first name and last name
      //     dispatch({
      //       type: "SET_NAME",
      //       item: [userData.firstName? userData.firstName : null, userData.lastName? userData.lastName : null]
      //     });
      //     dispatch({
      //       type: "SET_MOVIES",
      //       item: userData.movies ? userData.movies : []
      //     })
      //     dispatch({
      //       type: "SET_SHOWS",
      //       item: userData.shows ? userData.shows : []
      //     })
      //     console.log(userData)
      //   }
      // });

      // dispatch({
      //   type: "SET_UNSUBSCRIBE",
      //   item: unsubscribe
      // });
    }
  }, [user]);

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
          {ready ? (
            <>
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="SearchContents" component={SearchContents} />
              <Stack.Screen name="MediaScreen" component={MediaScreen} />
            </>
          ) : (
            <>
            <Stack.Screen name="Start" component={Start} ></Stack.Screen>
            <Stack.Screen name="Login" component={Login} ></Stack.Screen>
            <Stack.Screen name="Register" component={Register} ></Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  image: {
    width: "10%",
    height: "10%",
    resizeMode: "contain",
    
  }
});