const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyA3ZwOB8HqeK3XgSqit0MJXmXX76N-W_Xw",
  authDomain: "vidplay-3db58.firebaseapp.com",
  databaseURL: "https://vidplay-3db58-default-rtdb.firebaseio.com",
  projectId: "vidplay-3db58",
  storageBucket: "vidplay-3db58.appspot.com",
  messagingSenderId: "1069493163724",
  appId: "1:1069493163724:web:bc22a51ea975a994585469"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

const collectionSelect = document.getElementById("collection-select");

// Function to dynamically populate the collection-select dropdown
function populateCollectionSelect() {
  db.collection("collections")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.id;
        option.text = doc.id;
        collectionSelect.appendChild(option);
      });
    });
}

// Event listener for form submission to create a collection
const createCollectionForm = document.getElementById("create-collection-form");
createCollectionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const collectionName = document.getElementById("collection-name").value;
  const thumbnailFile = document.getElementById("thumbnail-file").files[0];

  // Check if the required fields are not empty
  if (!collectionName || !thumbnailFile) {
    alert("Collection name and thumbnail are required.");
    return;
  }

  // Create a storage reference for the thumbnail
  const storageRef = storage.ref();
  const thumbnailRef = storageRef.child(`thumbnails/${thumbnailFile.name}`);

  // Upload the thumbnail
  thumbnailRef.put(thumbnailFile).then((snapshot) => {
    console.log("Uploaded a blob or file!");

    // Get the download URL of the thumbnail
    snapshot.ref.getDownloadURL().then((thumbnailDownloadURL) => {
      console.log("Thumbnail available at", thumbnailDownloadURL);

      // Create a new collection in Firestore
      db.collection("collections")
        .doc(collectionName)
        .set({ thumbnail: thumbnailDownloadURL, videos: {} })
        .then(() => {
          console.log("Collection created successfully");
          // Clear the form fields
          createCollectionForm.reset();
        })
        .catch((error) => {
          console.error("Error creating collection:", error);
        });
    });
  }).catch((error) => {
    console.error("Error uploading thumbnail:", error);
  });
});

// Event listener for form submission to upload a video
const uploadVideoForm = document.getElementById("upload-video-form");
uploadVideoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const collectionName = collectionSelect.value;
  const videoName = document.getElementById("video-name").value;
  const videoFile = document.getElementById("video-file").files[0];

  if (!collectionName || !videoName || !videoFile) {
    alert("Please select a collection, provide a video name, and select a video file.");
    return;
  }

  const storageRef = storage.ref();
  const videoRef = storageRef.child(`videos/${videoFile.name}`);

  videoRef.put(videoFile).then((snapshot) => {
    console.log("Uploaded a video file!");

    snapshot.ref.getDownloadURL().then((videoDownloadURL) => {
      console.log("Video available at", videoDownloadURL);

      // Add the video URL to the collection in Firestore
      db.collection("collections")
        .doc(collectionName)
        .update({ [`videos.${videoName}`]: videoDownloadURL })
        .then(() => {
          console.log("Video added to collection");
          // Clear the form fields
          uploadVideoForm.reset();
        })
        .catch((error) => {
          console.error("Error adding video to collection:", error);
        });
    });
  }).catch((error) => {
    console.error("Error uploading video:", error);
  });
});

// Event listener for collection deletion (if you want to implement this feature)
// Add code to handle collection deletion

// Populate the collection-select dropdown on page load
populateCollectionSelect();