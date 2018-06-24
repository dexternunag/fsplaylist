import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

firebase.initializeApp({
    serviceAccount: './fs-playlist.json',
    databaseURL: 'https://fs-playlist.firebaseio.com'
});

const rooms = firebase.database().ref('rooms');
const playlist = firebase.database();
var isNext = false;
function isUpdated() { 
    return new Promise((resolve, reject) => {
        console.log(isNext)
        resolve(isNext)
    });
};

function deleteRoom() {
    const name = localStorage.getItem('adminRoom');
    firebase.database().ref(`rooms/${name}`).set(null).then(() => {
        firebase.database().ref(`playlist/${name}`).set(null).then(() => {
            firebase.database().ref(`player/${name}`).set(null);
        });
    });
}

function createRoom(roomName) {
    firebase.database().ref(`rooms/${roomName}`).set(roomName).then(res => {
        firebase.database().ref(`player/${roomName}`).set({
            state: 0,
            progress: 0,
            volume: 100
        });
    });
}

function getRoomList() {
    return new Promise((resolve, reject) => {
        rooms.on('value', snap => {
            if (snap) {
                const rooms = Object.values(snap.val() ? snap.val() : '');
                resolve(rooms.length !== 0 ? rooms : []);
            }
        }, err => reject(err))
    })
}

function addToList(data) {
    return new Promise((resolve, reject) => {
        const name = localStorage.getItem('room');
        playlist.ref(`playlist/${name}`).set(data).then(res => {
            resolve('Added to playlist');
        }).catch(err => reject(err))
        
    });
}

/*
* 0 = next q
* 1 = add q
*/
function updateList(data, status) {
    return new Promise((resolve, reject) => {
        const name = localStorage.getItem('room');
        isNext = status === 0 ? true : false;
        
        playlist.ref(`playlist/${name}`).set(data).then(res => {
            resolve('Updated playlist');
        }).catch(err => reject(err))
    });
}

function getList() {
    return new Promise((resolve, reject) => {
        const name = localStorage.getItem('room');
        playlist.ref(`playlist/${name}`).on('value', snap => {
            if (snap.val()) {
                const d = Object.values(snap.val());
                const data = Object.values(d[0]);
                resolve(d)
            }
        }, err => resolve(err));
    });
}

function joinRoom(name) {
    localStorage.setItem('room', name)
}

function joinedRoom(cb) {
    
}

/*
 * Player controllers 
 */

function setPlayerVolume(data) {
    return new Promise((resolve, reject) => {
        const name = localStorage.getItem('room');
        playlist.ref(`player/${name}/volume`).set(data).then(() => {
            resolve('Saved');
        }, err => reject(err));
    });
}

function setPlayerState(data) {
    return new Promise((resolve, reject) => {
        const name = localStorage.getItem('room');
        playlist.ref(`player/${name}/state`).set(data).then(() => {
            resolve('Saved');
        }, err => reject(err));
    });
}

function setPlayerProgress(data) {
    return new Promise((resolve, reject) => {
        const name = localStorage.getItem('room');
        playlist.ref(`player/${name}/progress`).set(data).then(() => {
            resolve('Saved');
        }, err => reject(err));
    });
}

export { 
    createRoom,
    deleteRoom,
    getRoomList,
    addToList,
    updateList,
    getList,
    joinRoom,
    joinedRoom,
    firebase,
    isUpdated,
    setPlayerState,
    setPlayerVolume,
    setPlayerProgress,
 };
