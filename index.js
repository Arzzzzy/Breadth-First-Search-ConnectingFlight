function initMap() {
    // Create map centered on the Philippines
    var map = L.map('map').setView([12.8797, 121.7740], 6);
    
    // Add tile layer (map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // ip markers for cities
    var cities = [
      { name: "Manila", location: [14.513315623631144, 121.01619802849821] },
      { name: "Cebu", location: [10.313677596389923, 123.97699188189858] },
      { name: "Davao", location: [7.131033122977599, 125.645575142249] },
      { name: "Palawan", location: [9.747786370452031, 118.74970284449402] },
      { name: "Laoag", location: [18.18326438658606, 120.53201560718291] },
      { name: "Tuguegarao", location: [17.67587023274542, 121.73390653847838] },
      { name: "Legazpi", location: [13.15428017432601, 123.72959496397827] },
      { name: "Zamboanga", location: [6.919943039596754, 122.06244176920495] },
      { name: "Batanes", location: [20.544507635679466, 121.95251987413204] },
      { name: "Samar", location: [11.233194298664362, 125.02428994917288] },
      { name: "Surigao", location:[9.760481380191024, 125.48207764991838]},
      { name: "Tawi-Tawi", location:[5.048574790489617, 119.74283390153032]}
    ];
  
    cities.forEach(function (city) {
      L.marker(city.location).addTo(map).bindPopup(city.name);
    });
  
    // Add flight connections between cities
    var connections = [
      { origin: "Manila", destination: "Cebu", cost: 1000, duration: "1 hour" },
      { origin: "Cebu", destination: "Manila", cost: 1000, duration: "1 hour" },
      { origin: "Manila", destination: "Zamboanga", cost: 2000, duration: "2 hours" },
      { origin: "Zamboanga", destination: "Manila", cost: 2000, duration: "2 hours" },
      { origin: "Cebu", destination: "Davao", cost: 1500, duration: "1.5 hours" },
      { origin: "Davao", destination: "Cebu", cost: 1500, duration: "1.5 hours" },
      { origin: "Manila", destination: "Palawan", cost: 1800, duration: "1.8 hours" },
      { origin: "Palawan", destination: "Manila", cost: 1800, duration: "1.8 hours" },
      { origin: "Laoag", destination: "Manila", cost: 2500, duration: "2.5 hours" },
      { origin: "Manila", destination: "Laoag", cost: 2500, duration: "2.5 hours" },
      { origin: "Tuguegarao", destination: "Manila", cost: 3000, duration: "3 hours" },
      { origin: "Manila", destination: "Tuguegarao", cost: 3000, duration: "3 hours" },
      { origin: "Cebu", destination: "Zamboanga", cost: 2200, duration: "2.2 hours" },
      { origin: "Zamboanga", destination: "Cebu", cost: 2200, duration: "2.2 hours" },
      { origin: "Legazpi", destination: "Tuguegarao", cost: 3200, duration: "3.2 hours" },
      { origin: "Tuguegarao", destination: "Legazpi", cost: 3200, duration: "3.2 hours" },
      { origin: "Legazpi", destination: "Manila", cost: 2100, duration: "2.1 hours" },
      { origin: "Manila", destination: "Legazpi", cost: 2100, duration: "2.1 hours" },
      { origin: "Palawan", destination: "Zamboanga", cost: 2300, duration: "2.3 hours" },
      { origin: "Zamboanga", destination: "Palawan", cost: 2300, duration: "2.3 hours" },
      { origin: "Laoag", destination: "Tuguegarao", cost: 2700, duration: "2.7 hours" },
      { origin: "Tuguegarao", destination: "Laoag", cost: 2700, duration: "2.7 hours" },
      { origin: "Laoag", destination: "Palawan", cost: 3500, duration: "3.5 hours" },
      { origin: "Palawan", destination: "Laoag", cost: 3500, duration: "3.5 hours" },
      { origin: "Batanes", destination: "Tuguegarao", cost: 4000, duration: "4 hours" },
      { origin: "Tuguegarao", destination: "Batanes", cost: 4000, duration: "4 hours" },
      { origin: "Samar", destination: "Manila", cost: 2800, duration: "2.8 hours" },
      { origin: "Manila", destination: "Samar", cost: 2800, duration: "2.8 hours" },
      { origin: "Surigao", destination: "Cebu", cost: 1200, duration: "1 hours" },
      { origin: "Cebu", destination: "Surigao", cost: 1200, duration: "1 hours" },
      { origin: "Tawi-Tawi", destination: "Zamboanga", cost: 3500, duration: "1 hours" },
      { origin: "Zamboanga", destination: "Tawi-Tawi", cost: 3500, duration: "1 hours" },
    ];
    
    //Connect cities for possible path (red line)
    connections.forEach(function (connection) {
      var origin = cities.find(function (city) {
        return city.name === connection.origin;
      });
  
      var destination = cities.find(function (city) {
        return city.name === connection.destination;
      });
  
      L.polyline([origin.location, destination.location], { color: 'red', weight: 2 }).addTo(map);
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

  //TICKET POP UP
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

// Function to show ticket details in a pop-up
function showTicketPopup(details) {
  const totalAmount = document.getElementById('totalAmount').textContent;
  const seatNumber = generateRandomSeatNumber();
  const flightNumber = generateRandomFlightNumber();
  const referenceNumber = generateRandomReferenceNumber();

  const popup = document.createElement('div');
  popup.classList.add('ticket-popup');

  // Create and append the title element
  const title = document.createElement('h1');
  title.textContent = 'Philippines AirAsia';
  popup.appendChild(title);

  // Create and append the ticket details
  const ticketDetails = document.createElement('h3');
  ticketDetails.textContent = details + 'Origin: ' + getOrigin() + '\nDestination: ' + getDestination()  + '\n\nSeat Number: ' + seatNumber + '\nFlight Number: ' + flightNumber + '\nReference Number: ' + referenceNumber + '\nTotal Amount: ' + totalAmount;
  popup.appendChild(ticketDetails);

  // Create and append the thank you message
  const thankYouMessage = document.createElement('h3');
  thankYouMessage.textContent = 'Have a safe flight!';
  popup.appendChild(thankYouMessage);

  document.body.appendChild(popup);

  // Remove the pop-up after a certain time (e.g., 10 seconds)
  setTimeout(function () {
    popup.remove();
  }, 8000);
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
  
  
  // Print the result or the output    
  function printResult(path) {
    var resultContainer = document.getElementById('result');
    var resultHTML = 'Shortest Path: ';
  
    var totalCost = 0;
    var totalDuration = 0;
  
    for (var i = 0; i < path.length; i++) {
      resultHTML += path[i].name;
  
      if (i < path.length - 1) {
        resultHTML += ' &#8594; ';
  
        // Calculate total cost and duration
        var connection = connections.find(function (conn) {
          return (
            (conn.origin === path[i].name && conn.destination === path[i + 1].name) ||
            (conn.origin === path[i + 1].name && conn.destination === path[i].name)
          );
        });
  
        if (connection) {
          totalCost += connection.cost;
          totalDuration += parseFloat(connection.duration); // Parse duration as a floating-point number
        }
      }
    }
  
    resultHTML += '<br>Total Amount: ' + ' ₱ ' + totalCost ;
    //resultHTML += '<br>Total Duration: ' + totalDuration.toFixed(2) + ' hours'; // Use toFixed() to display two decimal places
  
    resultContainer.innerHTML = resultHTML;
  
    // Show the "Book Flight" button and flight information form
    var bookFlightBtn = document.getElementById('book-flight');
    var flightInfoForm = document.getElementById('flightInfoForm');
    var totalAmountContainer = document.getElementById('totalAmount');
    
    totalAmountContainer.innerHTML = 'Total Amount: ' + ' ₱ ' + totalCost ;

    bookFlightBtn.classList.remove('hidden');
    flightInfoForm.classList.add('show');
  }
  
}

  // MAP LOAD
  window.onload = function () {
    initMap();
  };
  
  // Show the flight information form popup
  function showPopup() {
        var popupContainer = document.getElementById('popup-container');
        popupContainer.style.display = 'flex';
      }

  // Hide the flight information form popup
  function hidePopup() {
    var popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'none';
  }
  
  // Event listener for the "Confirm Booking" button
  var confirmBookingButton = document.getElementById('confirm-booking');
  confirmBookingButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    // Hide the popup after processing the form
    hidePopup();
  });
  // Call the hidePopup function to hide the popup initially
  hidePopup();


  // Add event listener to the refresh button
document.getElementById('refreshButton').addEventListener('click', function() {
  // Reload the page
  location.reload();
});

  
