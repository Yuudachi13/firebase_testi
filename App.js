import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View,  } from 'react-native';
import {firestore, addDoc, collection, MESSAGES, serverTimestamp, onSnapshot, query} from './firebase/Config';
import React, { useState,useEffect } from 'react';
import { convertFirebaseImeStampToJS } from './firebase/Functions';
import { orderBy } from 'firebase/firestore';


export default function App() {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessage] = useState([])

  useEffect(() => {
    const q = query(collection(firestore,MESSAGES),orderBy('created','desc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []
      querySnapshot.forEach((doc) => {
        tempMessages.push({...doc.data(),id: doc.id, created: convertFirebaseImeStampToJS(doc.data().created)})
      })
      setMessage(tempMessages)
    })
    return () => {
      unsubscribe()
    }
  }, [])

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
      <Text style={styles.shop}>Shopping list</Text>
        <View style={styles.form}>
        <TextInput 
        placeholder='Add new item. . .'
        value ={newMessage}
        onChangeText={text => setNewMessage(text)}
        />
        <Button title="Add item" onPress={save} />

      </View>
        <ScrollView>
          {
        messages.map((message) => (
          <View key={message.id} style={styles.message}>
            <Text style={styles.messageInfo}> {message.created}</Text>
            <Text>{message.text}</Text>
          </View>
        ))
      }
        </ScrollView>
        

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8,
    marginTop: 40,

  }, 
  form:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  message: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  shop: {
    fontSize: 25,
  },
  messageInfo: {
    fontSize: 12,
  }
});
