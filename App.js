import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { firestore, addDoc, collection, MESSAGES, serverTimestamp, onSnapshot, query, deleteDoc } from './firebase/Config';
import React, { useState, useEffect } from 'react';
import { convertFirebaseImeStampToJS } from './firebase/Functions';
import { doc, orderBy } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons'

export default function App() {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessage] = useState([])

  useEffect(() => {
    const q = query(collection(firestore, MESSAGES), orderBy('created', 'desc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []
      querySnapshot.forEach((doc) => {
        tempMessages.push({ ...doc.data(), id: doc.id, created: convertFirebaseImeStampToJS(doc.data().created) })
      })
      setMessage(tempMessages)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch(error => console.log(error))

    setNewMessage('')
    console.log('message saved.')
  }
  const deletee = async (id) => {
    await deleteDoc(doc(firestore, MESSAGES, id)).catch(error => console.log(error));
    console.log('message deleted.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.shop}>Shopping list</Text>
      <View style={styles.form}>
        <TextInput
          placeholder='Add new item. . .'
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
          style={styles.input}
          multiline
        />
        <Button title="Add item" onPress={save} />

      </View>
      <ScrollView>
        {messages.map((message) => (
            <View key={message.id} style={styles.message}>
              {/*    <Text style={styles.messageInfo}> {message.created}</Text>*/}
              <Text multiline >{message.text}</Text>
              <TouchableOpacity onPress={() => deletee(message.id)}>
                <Ionicons name="trash" size={30} color="red" />

              </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    maxHeight: 100, 
    marginRight: 10, 
    flexShrink: 1, 
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  message: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
