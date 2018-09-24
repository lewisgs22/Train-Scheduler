
var config = {
  apiKey: "AIzaSyBbljHWWUW0ntscKj8Bv3WwTzU-wU-IEnU",
  authDomain: "train-scheduler-83415.firebaseapp.com",
  databaseURL: "https://train-scheduler-83415.firebaseio.com",
  projectId: "train-scheduler-83415",
  storageBucket: "train-scheduler-83415.appspot.com",
  messagingSenderId: "863324164432"
};
firebase.initializeApp(config);

var trainData = firebase.database().ref();
//Shows current time
$("#currentTime").append(moment().format("hh:mm A"));

// Button for adding trains
$("#addTrainBtn").on("click", function() {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequencyInput").val().trim();

  // local object for holding train data
  var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
  }

  
  trainData.push(newTrain);


  // Clears text-boxes
  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#firstTrainInput").val("");
  $("#frequencyInput").val("");

  return false;
});


// Firebase event adds trains to the database and a html row
trainData.on("child_added", function(childSnapshot) {

  let data = childSnapshot.val();
  let trainNames = data.name;
  let trainDestin = data.destination;
  let trainFrequency = data.frequency;
  let theFirstTrain = data.firstTrain;
  console.log(theFirstTrain);
  
  //calculate the minutes till arrival
  let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
  let tMinutes = trainFrequency - tRemainder;

  //add tMinutes to the currrent time
  let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

  // Add train's data into the table 
  $("#trainTable > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestin + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + tArrival + "</td><td class='min'>" + tMinutes + "</td></tr>");

});