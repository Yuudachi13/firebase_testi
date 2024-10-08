import { initializeApp } from "firebase/app";
import { getFirestore,collection,addDoc,serverTimestamp,query,onSnapshot, } from "firebase/firestore";
import firebaseConfig from "../keys/Keys";

initializeApp(firebaseConfig);
 
const firestore = getFirestore();

const MESSAGES = 'messages';

export {
    firestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    onSnapshot,
    
    MESSAGES
}
