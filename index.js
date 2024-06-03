function initMap() {
  // Create map centered on Asia
  var map = L.map('map').setView([22.3193, 114.1694], 3);

  // Add tile layer (map background)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  // ip markers for cities in Asia
  var cities = [
    { name: "Hong Kong", location: [22.3193, 114.1694] },
    { name: "Tokyo", location: [35.6895, 139.6917] },
    { name: "Seoul", location: [37.5665, 126.978] },
    { name: "Beijing", location: [39.9042, 116.4074] },
    { name: "Bangkok", location: [13.7563, 100.5018] },
    { name: "Singapore", location: [1.3521, 103.8198] },
    { name: "Manila", location: [14.5995, 120.9842] },
    { name: "Jakarta", location: [-6.2088, 106.8456] },
    { name: "Taipei", location: [25.033, 121.5654] },
    { name: "Mumbai", location: [19.076, 72.8777] },
    { name: "Dubai", location: [25.276987, 55.296249] },
    { name: "Istanbul", location: [41.0082, 28.9784] },
    { name: "Cairo", location: [30.0444, 31.2357] }
];

  cities.forEach(function (city) {
      L.marker(city.location).addTo(map).bindPopup(city.name);
  });

  // Add flight connections between cities
  var connections = [
    { origin: "Hong Kong", destination: "Tokyo", cost: 2000, duration: "4 hours" },
    { origin: "Tokyo", destination: "Hong Kong", cost: 2000, duration: "4 hours" },

    { origin: "Hong Kong", destination: "Beijing", cost: 2000, duration: "4 hours" },
    { origin: "Beijing", destination: "Hong Kong", cost: 2000, duration: "4 hours" },

    { origin: "Tokyo", destination: "Seoul", cost: 2500, duration: "2 hours" },
    { origin: "Seoul", destination: "Tokyo", cost: 2500, duration: "2 hours" },

    { origin: "Beijing", destination: "Bangkok", cost: 2200, duration: "5 hours" },
    { origin: "Bangkok", destination: "Beijing", cost: 2200, duration: "5 hours" },

    { origin: "Bangkok", destination: "Singapore", cost: 1000, duration: "2 hours" },
    { origin: "Singapore", destination: "Bangkok", cost: 1000, duration: "2 hours" },

    { origin: "Singapore", destination: "Manila", cost: 1200, duration: "3 hours" },
    { origin: "Manila", destination: "Singapore", cost: 1200, duration: "3 hours" },

    { origin: "Jakarta", destination: "Taipei", cost: 1800, duration: "3 hours" },
    { origin: "Taipei", destination: "Jakarta", cost: 1800, duration: "3 hours" },

    { origin: "Taipei", destination: "Mumbai", cost: 3000, duration: "4 hours" },
    { origin: "Mumbai", destination: "Taipei", cost: 3000, duration: "4 hours" },

    { origin: "Mumbai", destination: "Dubai", cost: 2500, duration: "3 hours" },
    { origin: "Dubai", destination: "Mumbai", cost: 2500, duration: "3 hours" },

    { origin: "Dubai", destination: "Istanbul", cost: 2800, duration: "4 hours" },
    { origin: "Istanbul", destination: "Dubai", cost: 2800, duration: "4 hours" },

    { origin: "Istanbul", destination: "Cairo", cost: 1500, duration: "2.5 hours" },
    { origin: "Cairo", destination: "Istanbul", cost: 1500, duration: "2.5 hours" },

    { origin: "Cairo", destination: "Hong Kong", cost: 3200, duration: "6 hours" },
    { origin: "Hong Kong", destination: "Cairo", cost: 3200, duration: "6 hours" },

    { origin: "Beijing", destination: "Istanbul", cost: 2800, duration: "4 hours" },
    { origin: "Istanbul", destination: "Beijing", cost: 2800, duration: "4 hours" },

    { origin: "Dubai", destination: "Singapore", cost: 2000, duration: "3 hours" },
    { origin: "Singapore", destination: "Dubai", cost: 2000, duration: "3 hours" },

    { origin: "Taipei", destination: "Hong Kong", cost: 1200, duration: "2 hours" },
    { origin: "Hong Kong", destination: "Taipei", cost: 1200, duration: "2 hours" },

    { origin: "Hong Kong", destination: "Manila", cost: 1300, duration: "2.5 hours" },
    { origin: "Manila", destination: "Hong Kong", cost: 1300, duration: "2.5 hours" },

    { origin: "Manila", destination: "Singapore", cost: 1200, duration: "3 hours" },
    { origin: "Singapore", destination: "Manila", cost: 1200, duration: "3 hours" },

    { origin: "Manila", destination: "Tokyo", cost: 1200, duration: "3 hours" },
    { origin: "Tokyo", destination: "Manila", cost: 1200, duration: "3 hours" },

    { origin: "Singapore", destination: "Bangkok", cost: 800, duration: "1.5 hours" },
    { origin: "Bangkok", destination: "Singapore", cost: 800, duration: "1.5 hours" },

    { origin: "Bangkok", destination: "Dubai", cost: 2500, duration: "4 hours" },
    { origin: "Dubai", destination: "Bangkok", cost: 2500, duration: "4 hours" },

    { origin: "Dubai", destination: "Mumbai", cost: 3000, duration: "4 hours" },
    { origin: "Mumbai", destination: "Dubai", cost: 3000, duration: "4 hours" },

    { origin: "Mumbai", destination: "Taipei", cost: 3500, duration: "5 hours" },
    { origin: "Taipei", destination: "Mumbai", cost: 3500, duration: "5 hours" }
];

    //Connect cities for possible path (red line)
    connections.forEach(function (connection) {
      var origin = cities.find(function (city) {
        return city.name === connection.origin;
      });
  
      var destination = cities.find(function (city) {
        return city.name === connection.destination;
      });
  
      L.polyline([origin.location, destination.location], { color: 'yellow', weight: 2 }).addTo(map);
    });
  
// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;

    var originDestinationDiv = document.getElementById('originDestinationDiv');
    originDestinationDiv.innerHTML = 'Origin: ' + origin + '<br>Destination: ' + destination;
  
    if (origin === destination) {
      // Remove previous booked flight and blue path
      map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline && layer.options.color === 'blue') {
          map.removeLayer(layer);
        }
      });
  
      printResultError('Please select different cities for the origin and destination.');
      return;
    }
        
        var originCity = cities.find(function (city) {
            return city.name === origin;
        });
        
        var destinationCity = cities.find(function (city) {
            return city.name === destination;
        });
        if (originCity && destinationCity) {
            var shortestPath = findShortestPathBFS(originCity, destinationCity, cities, connections);
  
            if (shortestPath.length > 0) {
                animateFlightPath(shortestPath);
    
                printResult(shortestPath);
            } else {
                printResultError('No flight paths found from ' + origin + ' to ' + destination);
            }
        } else {
            printResultError('Invalid origin or destination city.');
        }
    });

    function printResultError(message) {
        var resultContainer = document.getElementById('result');
        resultContainer.innerHTML = message;
    }
    

        // Function to check if origin and destination are the same
        function isSameOriginAndDestination() {
          const originSelect = document.getElementById('origin');
          const destinationSelect = document.getElementById('destination');
          return originSelect.value === destinationSelect.value;
      }

  // Function to show/hide the flightInfoForm
  function toggleFlightInfoForm() {
    const flightInfoForm = document.getElementById('flightInfoForm');
    const isSame = isSameOriginAndDestination();
    flightInfoForm.style.display = isSame ? 'none' : 'block';
  }

  // Event listener for the book-flight button
  const bookFlightButton = document.getElementById('book-flight');
  bookFlightButton.addEventListener('click', toggleFlightInfoForm);

  // Event listener for the confirm-booking button
  const confirmBookingButton = document.getElementById('confirm-booking');
  confirmBookingButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission
    
    const formInputs = document.querySelectorAll('#flightInfoForm input');
    let isEmpty = false;
    let ticketDetails = '';
    
    // Check if any input field is empty
    formInputs.forEach(input => {
      if (input.value.trim() === '') {
        isEmpty = true;
        input.classList.add('error'); // Add error class to input field
      } else {
        input.classList.remove('error'); // Remove error class if input is not empty
        ticketDetails += `${input.name}: ${input.value}\n`; // Collect input details
      }
        });

  // Display pop-up message if form is empty or show ticket details
  if (isEmpty) {
    alert('Please fill in all the fields');
  } else {
    showTicketPopup(ticketDetails);
  }
});


// Function to generate a random seat number
function generateRandomSeatNumber() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const randomRow = rows[Math.floor(Math.random() * rows.length)];
  const randomSeatNumber = Math.floor(Math.random() * 20) + 1;
  return randomRow + randomSeatNumber;
}

// Function to generate a random reference number
function generateRandomReferenceNumber() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let referenceNumber = '';
  for (let i = 0; i < 11; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referenceNumber += characters[randomIndex];
  }
  return referenceNumber;
}

// Function to show ticket details in a SweetAlert modal
function showTicketPopup(details) {
  const totalAmount = document.getElementById('totalAmount').textContent;
  const seatNumber = generateRandomSeatNumber();
  const flightNumber = generateRandomFlightNumber();
  const referenceNumber = generateRandomReferenceNumber();

  const message = `
      ${details}<br>
      <b>Origin:</b> ${getOrigin()}<br>
      <b>Destination:</b> ${getDestination()}<br>
      <b>Seat Number:</b> ${seatNumber}<br>
      <b>Flight Number:</b> ${flightNumber}<br>
      <b>Reference Number:</b> ${referenceNumber}<br>
      <b>Total Amount:</b> ${totalAmount}
  `;

  // Show the SweetAlert modal
  Swal.fire({
      icon: 'success',
      title: 'Booking Confirmed!',
      html: message,
      showConfirmButton: false,
      timer: 8000 // Close the modal after 8 seconds
  });
}

// Function to get the selected origin
function getOrigin() {
  var origin = document.getElementById('origin').value;
  return origin;
}

// Function to get the selected destination
function getDestination() {
  var destination = document.getElementById('destination').value;
  return destination;
}


// Function to generate a random flight number
function generateRandomFlightNumber() {
  const airlines = ['AA', 'BA', 'CA', 'DL', 'EK', 'QF', 'SQ', 'UA'];
  const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];
  const randomFlightNumber = Math.floor(Math.random() * 1000) + 100;
  return randomAirline + randomFlightNumber;
}

    // FUNCTIONALITY
    //Implementation of Breadth-first search (BFS), finding the shortest path
    function findShortestPathBFS(origin, destination, cities, connections) {
      var queue = [[origin]];
      var shortestPath = [];
  
      while (queue.length > 0) {
        var currentPath = queue.shift();
        var currentCity = currentPath[currentPath.length - 1];
  
        if (currentCity === destination) {
          if (shortestPath.length === 0 || currentPath.length < shortestPath.length) {
            shortestPath = currentPath;
          }
        }
  
        var neighboringCities = getNeighboringCities(currentCity, cities, connections);
  
        neighboringCities.forEach(function (neighbor) {
          if (!currentPath.includes(neighbor)) {
            queue.push(currentPath.concat([neighbor]));
          }
        });
      }
  
      return shortestPath;
    }
  
    function getNeighboringCities(city, cities, connections) {
      var neighboringCities = [];
  
      connections.forEach(function (connection) {
        if (connection.origin === city.name) {
          var neighbor = cities.find(function (city) {
            return city.name === connection.destination;
          });
  
          if (neighbor) {
            neighboringCities.push(neighbor);
          }
        }
      });
  
      return neighboringCities;
    }
    
// Plane Icon Functionalities
function animateFlightPath(path) {
    var animationDuration = 2000; // in milliseconds
    var framesPerSecond = 30;
    var numFrames = (animationDuration / 1000) * framesPerSecond;
    var frameDistance = path.length - 1;
  
    var planePaths = [];
  
    // Clear previous flight path (blue line)
    map.eachLayer(function (layer) {
      if (layer instanceof L.Polyline && layer.options.color === 'blue') {
        map.removeLayer(layer);
      }
    });
  
    path.forEach(function (city, index) {
      if (index < path.length - 1) {
        var origin = city;
        var destination = path[index + 1];
  
        var planePath = L.polyline([origin.location, destination.location], { color: 'blue', weight: 4 }).addTo(map);
        planePaths.push(planePath);
  
        setTimeout(function () {
          animatePath(planePath, numFrames, frameDistance);
        }, index * animationDuration);
      }
    });
  
    function animatePath(path, numFrames, frameDistance) {
      var currentFrame = 0;
  
      var pathAnimation = setInterval(function () {
        if (currentFrame >= numFrames) {
          clearInterval(pathAnimation);
          return;
        }
  
        var nextLatLngIndex = Math.round((currentFrame / numFrames) * frameDistance);
        var nextLatLng = path.getLatLngs()[nextLatLngIndex];
  
        path.spliceLatLngs(0, 1); // Remove the first point from the path
  
        currentFrame++;
      }, animationDuration / numFrames);
    }
  }
  
  
  function printResult(path) {
    var resultContainer = document.getElementById('result');
    var resultHTML = 'Shortest Path: ';
  
    var totalCost = 0;
    var totalDuration = 0;
    var totalDistance = 0; // Initialize total distance
  
    for (var i = 0; i < path.length; i++) {
      resultHTML += path[i].name;
  
      if (i < path.length - 1) {
        resultHTML += ' &#8594; ';
  
        // Calculate total cost, duration, and distance
        var connection = connections.find(function (conn) {
          return (
            (conn.origin === path[i].name && conn.destination === path[i + 1].name) ||
            (conn.origin === path[i + 1].name && conn.destination === path[i].name)
          );
        });
  
        if (connection) {
          totalCost += connection.cost;
          totalDuration += parseFloat(connection.duration); // Parse duration as a floating-point number
  
          // Calculate distance between cities
          var origin = path[i];
          var destination = path[i + 1];
          var distance = calculateDistance(origin.location[0], origin.location[1], destination.location[0], destination.location[1]);
          totalDistance += distance;
        }
      }
    }
  
    resultHTML += '<br>Total Amount: ' + ' ₱ ' + totalCost ;
    resultHTML += '<br>Total Distance: ' + totalDistance.toFixed(2) + ' km'; // Display total distance in kilometers with two decimal places
    resultHTML += '<br>Total Duration: ' + totalDuration.toFixed(2) + ' hours'; // Use toFixed() to display two decimal places
  
    resultContainer.innerHTML = resultHTML;
  
    // Show the "Book Flight" button and flight information form
    var bookFlightBtn = document.getElementById('book-flight');
    var flightInfoForm = document.getElementById('flightInfoForm');
    var totalAmountContainer = document.getElementById('totalAmount');
    
    totalAmountContainer.innerHTML = 'Total Amount: ' + ' ₱ ' + totalCost ;

    bookFlightBtn.classList.remove('hidden');
    flightInfoForm.classList.add('show');
  }

// Function to calculate the distance between two points given their latitude and longitude using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in kilometers
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in kilometers
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

}

  // MAP LOAD
  window.onload = function () {
    initMap();
  };
  
  // Add event listener to the refresh button
document.getElementById('refreshButton').addEventListener('click', function() {
  // Reload the page
  location.reload();
});

  
