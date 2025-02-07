import React, { useState, useEffect } from 'react';
import { StatusBar, Text, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    shakeText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        padding: 20,
    },
});

export default function App() {
    const [mySound, setMySound] = useState();
    const [isShaken, setIsShaken] = useState(false);
    const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
    const threshold = 1.5;

    async function playSound() {
        const soundfile = require('./glass-sound.wav');
        const { sound } = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);
        const subscription = Accelerometer.addListener((data) => {
            setAccelData(data);
            const { x, y, z } = data;
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            if (magnitude > threshold) {
                setIsShaken(true);
                playSound();
            } else {
                setIsShaken(false);
            }
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        return mySound
            ? () => {
                console.log('Shake Sound');
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            {isShaken && <Text style={styles.shakeText}>SHAKE!</Text>}
        </View>
    );
}
