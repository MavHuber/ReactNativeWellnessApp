import * as React from 'react';
import {useState, useEffect} from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import SnackBar from 'react-native-snackbar-component'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({navigation}) {

    const [Quote, setQuote] = useState('Loading...');
    const [Author, setAuthor] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const[isCopied, setIsCopied] = useState(false);

    //const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

    const randomQuote = () => {
        setIsLoading(true);
        fetch("https://api.quotable.io/quotes/random")
            .then(res => res.json()
            .then(result => {
                if (Array.isArray(result) && result.length > 0) {
                    // console.log(result[0].content);
                    setQuote(result[0].content);
                    setAuthor(result[0].author);
                    setIsLoading(false);
                    setIsPlaying(false);
                }
        }))
    }

    useEffect(() => {
        randomQuote();
    }, []);

    const speak = () => {
        // Make sure ringer is on
        // console.log('Speak Called');
        Speech.stop();
        Speech.speak(Quote + ' by ' + Author, {
            rate: 1,
            onStart:() => setIsPlaying(true),
            onDone:() => setIsPlaying(false)
        })
    }

    const copyToClipboard = () => {
        setIsCopied(true);
        Clipboard.setStringAsync(Quote + ' ' + Author);
        //wait(300);
        setIsCopied(false);
    }

    return(
        <View style={styles.container}>
            <ImageBackground 
                source={require('../../assets/plant-background.jpg')}
                resizeMode='cover'
                style= {{flex : 1}}>
                <StatusBar barStyle="light-content" />
                <View>
                    <Text style={styles.heading}>Welcome, friend!</Text> 
                </View>
                <View style={styles.quoteSpace}>
                    <Text style={styles.quoteTitle}>
                        Quote of the Day
                    </Text>
                    <FontAwesome5 name="quote-left" style={{fontSize:20,marginBottom:-12}} color="#000" />
                    <Text style={styles.quote}>
                        {Quote}
                    </Text>
                    <FontAwesome5 name="quote-right" style={{fontSize:20, textAlign:'right',marginTop:-20,marginBottom:20}} color="#000" />
                    <Text 
                        style={{
                            textAlign: 'right', 
                            fontWeight: '300', 
                            fontStyle:'italic', 
                            fontSize: 16, 
                            color: '#000'
                            }}>
                                --- {Author}
                            </Text>
                    <TouchableOpacity onPress={randomQuote} style={{
                        backgroundColor: isLoading ? 'rgba(86, 112, 38, 0.7)' : 'rgba(86, 112, 38, 1)', 
                        padding: 20, 
                        borderRadius: 30, 
                        marginVertical: 20,
                        }}>
                        <Text style={{color:'#fff', fontSize: 18, textAlign: 'center'}}>
                            {isLoading ? 'Loading...' : 'New Quote'}
                        </Text>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={speak} style={[styles.buttonStyle, {backgroundColor: isPlaying ? '#567026' : '#fff'}]}>
                            <FontAwesome name="volume-up" size={22} color={isPlaying ? '#fff' : "#567026"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={copyToClipboard} style={styles.buttonStyle}>
                            <FontAwesome name="copy" size={22} color="#567026" />
                        </TouchableOpacity>
                    </View>

                </View>
                <SnackBar visible={isCopied} textMessage="Quote copied" />
            </ImageBackground>
        </View>
    );
}

//STYLES

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    heading: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    quoteSpace: {
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        justifyContent: 'center',
    },
    quoteTitle: {
        textAlign: 'center',
        fontSize: 26,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    quote: {
        color: '#000',
        fontSize: 16,
        lineHeight: 26,
        letterSpacing: 1.1,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 30,
    },
    buttonStyle: {
        borderWidth: 2,
        borderColor: '#567026',
        borderRadius: 50,
        padding: 15,
    }
})