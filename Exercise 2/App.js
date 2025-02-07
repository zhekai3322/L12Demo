import React, { useState, useEffect } from 'react';
import { StatusBar, Button, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({

});

export default function App() {
    const [mySound, setMySound] = useState();

    async function playSound() {
        const soundfile = require('./short1.wav');
        const { sound } = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return mySound
            ? () => {
                console.log('Unloading Sound');
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            <Button
                title="Play Sound"
                onPress={() => {
                    playSound();
                }}
            />
        </View>
    );
}
