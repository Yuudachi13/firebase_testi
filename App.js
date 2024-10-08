import { Button, SafeAreaView, StyleSheet, Text, TextInput, View,  } from 'react-native';
import {firestore, addDoc, collection, MESSAGES, serverTimestamp} from './firebase/Config';
import React, { useState } from 'react';


export default function App() {
  const [newMessage, setNewMessage] = useState('')

  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES),{
      text: newMessage,
      created: serverTimestamp()
    }).catch(error => console.log(error))

    setNewMessage('')
    console.log('message saved.')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput 
        placeholder='Send message...'
        value ={newMessage}
        onChangeText={text => setNewMessage(text)}
        />
        <Button title="Save" onPress={save} />

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8
  }, 
  form:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  }
});
