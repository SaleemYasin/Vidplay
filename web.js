// web.js

// Initialize Firebase with your Firebase project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3ZwOB8HqeK3XgSqit0MJXmXX76N-W_Xw",
    authDomain: "vidplay-3db58.firebaseapp.com",
    databaseURL: "https://vidplay-3db58-default-rtdb.firebaseio.com",
    projectId: "vidplay-3db58",
    storageBucket: "vidplay-3db58.appspot.com",
    messagingSenderId: "1069493163724",
    appId: "1:1069493163724:web:bc22a51ea975a994585469"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  const collectionsDiv = document.getElementById("collections");
  const videoPlayerDiv = document.getElementById("video-player");
  const videoElement = document.getElementById("video");
  
  // Function to retrieve collections and display them
  function displayCollections() {
    collectionsDiv.innerHTML = "";
    db.collection("collections")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const collection = doc.data();
          const collectionName = doc.id;
  
          const collectionDiv = document.createElement("div");
          collectionDiv.innerHTML = `<h2>${collectionName}</h2>`;
  
          // Create buttons to play videos
          const playButtons = document.createElement("div");
          playButtons.classList.add("play-buttons");
  
          for (const videoName in collection.videos) {
            const playButton = document.createElement("button");
            playButton.innerText = `Play ${videoName}`;
            playButton.addEventListener("click", () => {
              playVideo(collection.videos[videoName]);
            });
            playButtons.appendChild(playButton);
          }
  
          collectionDiv.appendChild(playButtons);
          collectionsDiv.appendChild(collectionDiv);
        });
      });
  }
  
  // Function to play a video
  function playVideo(videoURL) {
    videoPlayerDiv.style.display = "block";
    videoElement.src = videoURL;
  }
  
  // Event listener to display collections when the page loads
  window.addEventListener("load", () => {
    displayCollections();
  });
  
  // Event listener to hide the video player
  videoElement.addEventListener("ended", () => {
    videoPlayerDiv.style.display = "none";
  });
  