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
      { origin: "Manila", destination: "Cebu"},
      { origin: "Cebu", destination: "Manila"},
      { origin: "Manila", destination: "Zamboanga"},
      { origin: "Zamboanga", destination: "Manila"},
      { origin: "Cebu", destination: "Davao"},
      { origin: "Davao", destination: "Cebu"},
      { origin: "Manila", destination: "Palawan"},
      { origin: "Palawan", destination: "Manila"},
      { origin: "Laoag", destination: "Manila"},
      { origin: "Manila", destination: "Laoag"},
      { origin: "Tuguegarao", destination: "Manila"},
      { origin: "Manila", destination: "Tuguegarao"},
      { origin: "Cebu", destination: "Zamboanga"},
      { origin: "Zamboanga", destination: "Cebu"},
      { origin: "Legazpi", destination: "Tuguegarao"},
      { origin: "Tuguegarao", destination: "Legazpi"},
      { origin: "Legazpi", destination: "Manila"},
      { origin: "Manila", destination: "Legazpi"},
      { origin: "Palawan", destination: "Zamboanga"},
      { origin: "Zamboanga", destination: "Palawan"},
      { origin: "Laoag", destination: "Tuguegarao"},
      { origin: "Tuguegarao", destination: "Laoag"},
      { origin: "Laoag", destination: "Palawan"},
      { origin: "Palawan", destination: "Laoag"},
      { origin: "Batanes", destination: "Tuguegarao"},
      { origin: "Tuguegarao", destination: "Batanes"},
      { origin: "Samar", destination: "Manila"},
      { origin: "Manila", destination: "Samar"},
      { origin: "Surigao", destination: "Cebu"},
      { origin: "Cebu", destination: "Surigao"},
      { origin: "Tawi-Tawi", destination: "Zamboanga"},
      { origin: "Zamboanga", destination: "Tawi-Tawi"},
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

  // Get the selected origin and destination cities from the form
  var origin = document.getElementById('origin').value;
  var destination = document.getElementById('destination').value;

  // Update the origin and destination display
  var originDestinationDiv = document.getElementById('originDestinationDiv');
  originDestinationDiv.innerHTML = 'Origin: ' + origin + '<br>Destination: ' + destination;

  // Check if the origin and destination are the same city
  if (origin === destination) {
    // Remove previous booked flight and blue path
    map.eachLayer(function (layer) {
      if (layer instanceof L.Polyline && layer.options.color === 'blue') {
        map.removeLayer(layer);
      }
    });

    // Display an error message
    printResultError('Please select different cities for the origin and destination.');
    return;
  }

  // Find the origin and destination cities in the cities array
  var originCity = cities.find(function (city) {
    return city.name === origin;
  });

  var destinationCity = cities.find(function (city) {
    return city.name === destination;
  });

  // If the origin and destination cities are valid, find the shortest path using BFS
  if (originCity && destinationCity) {
    var shortestPath = findShortestPathBFS(originCity, destinationCity, cities, connections);

    // If a shortest path is found, animate the flight path and print the result
    if (shortestPath.length > 0) {
      animateFlightPath(shortestPath);
      printResult(shortestPath);
    } else {
      // Display an error message if no flight path is found
      printResultError('No flight paths found from ' + origin + ' to ' + destination);
    }
  } else {
    // Display an error message for invalid cities
    printResultError('Invalid origin or destination city.');
  }
});

function printResultError(message) {
  // Get the result container element
  var resultContainer = document.getElementById('result');

  // Display the error message
  resultContainer.innerHTML = message;
}

// Function to check if the origin and destination are the same
function isSameOriginAndDestination() {
  const originSelect = document.getElementById('origin');
  const destinationSelect = document.getElementById('destination');

  // Compare the values of the origin and destination selects
  return originSelect.value === destinationSelect.value;
}

// Implementation of Breadth-first search (BFS) to find the shortest path
function findShortestPathBFS(origin, destination, cities, connections) {
  var queue = [[origin]];
  var shortestPath = [];

  while (queue.length > 0) {
    var currentPath = queue.shift();
    var currentCity = currentPath[currentPath.length - 1];

    if (currentCity === destination) {
      // If the current path reaches the destination, update the shortest path if it is shorter
      if (shortestPath.length === 0 || currentPath.length < shortestPath.length) {
        shortestPath = currentPath;
      }
    }

    var neighboringCities = getNeighboringCities(currentCity, cities, connections);

    neighboringCities.forEach(function (neighbor) {
      // Add neighboring cities to the queue if they are not already in the current path
      if (!currentPath.includes(neighbor)) {
        queue.push(currentPath.concat([neighbor]));
      }
    });
  }

  return shortestPath;
}

// Function to get neighboring cities of a given city
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

// Function to animate the flight path (Vertices Icon Functionalities)
function animateFlightPath(path) {
  var animationDuration = 2000; // Duration of the animation in milliseconds
  var framesPerSecond = 30; // Number of frames per second
  var numFrames = (animationDuration / 1000) * framesPerSecond; // Calculate the total number of frames
  var frameDistance = path.length - 1; // Calculate the distance between frames
  var planePaths = []; // Array to store the polylines representing the flight path
  
  // Clear previous flight path (blue line)
  map.eachLayer(function (layer) {
    if (layer instanceof L.Polyline && layer.options.color === 'blue') {
      map.removeLayer(layer);
    }
  });
  
  // Iterate over the path array
  path.forEach(function (city, index) {
    if (index < path.length - 1) {
      var origin = city;
      var destination = path[index + 1];
      
      // Create a polyline representing the flight path between two cities
      var planePath = L.polyline([origin.location, destination.location], { color: 'blue', weight: 4 }).addTo(map);
      planePaths.push(planePath); // Add the polyline to the array
      
      // Schedule the animation for the current polyline
      setTimeout(function () {
        animatePath(planePath, numFrames, frameDistance);
      }, index * animationDuration); // Delay the animation based on the index and animation duration
    }
  });
  
  // Function to animate a single path
  function animatePath(path, numFrames, frameDistance) {
    var currentFrame = 0; // Current frame count
    
    var pathAnimation = setInterval(function () {
      if (currentFrame >= numFrames) {
        clearInterval(pathAnimation); // Stop the animation when all frames are rendered
        return;
      }
      
      var nextLatLngIndex = Math.round((currentFrame / numFrames) * frameDistance); // Calculate the index of the next point to render
      var nextLatLng = path.getLatLngs()[nextLatLngIndex]; // Get the coordinates of the next point
      
      path.spliceLatLngs(0, 1); // Remove the first point from the path
      currentFrame++; // Increment the current frame count
    }, animationDuration / numFrames); // Calculate the delay between frames
  }
}

// Function to print the result or output
function printResult(path) {
  var resultContainer = document.getElementById('result'); // Get the container element
  var resultHTML = 'Shortest Path: ';
  
  for (var i = 0; i < path.length; i++) {
    resultHTML += path[i].name; // Add the city name to the result string
    
    if (i < path.length - 1) {
      resultHTML += ' &#8594; '; // Add arrow symbol if it's not the last city in the path
    }
  }
  
  resultContainer.innerHTML = resultHTML; // Update the container with the result string
}

}

// MAP LOAD
window.onload = function () {
  initMap();
};
