const apiBaseUrl = "http://localhost:8080/api"; // Replace with your backend URL

// Add a Car
document.getElementById("add-car-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("car-title").value;
  const description = document.getElementById("car-description").value;
  const tags = document.getElementById("car-tags").value.split(",");
  const images = document.getElementById("car-images").files;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("tags", JSON.stringify(tags));

  for (const file of images) {
    formData.append("images", file);
  }

  try {
    const response = await fetch(`${apiBaseUrl}/cars`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
      alert("Car added successfully!");
      listCars(); // Refresh car list
    } else {
      alert("Failed to add car. Please try again.");
    }
  } catch (error) {
    console.error("Error adding car:", error);
  }
});

// List User's Cars
async function listCars() {
  try {
    const response = await fetch(`${apiBaseUrl}/cars`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const cars = await response.json();

    const carList = document.getElementById("car-list");
    carList.innerHTML = ""; // Clear the list

    cars.forEach((car) => {
      const carItem = document.createElement("li");
      carItem.textContent = car.title;
      carItem.dataset.id = car.id;

      carItem.addEventListener("click", () => viewCarDetail(car.id));
      carList.appendChild(carItem);
    });
  } catch (error) {
    console.error("Error listing cars:", error);
  }
}

// Search Cars
document.getElementById("search-button").addEventListener("click", async () => {
  const keyword = document.getElementById("search-bar").value;

  try {
    const response = await fetch(`${apiBaseUrl}/cars/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const cars = await response.json();

    const carList = document.getElementById("car-list");
    carList.innerHTML = ""; // Clear the list

    cars.forEach((car) => {
      const carItem = document.createElement("li");
      carItem.textContent = car.title;
      carItem.dataset.id = car.id;

      carItem.addEventListener("click", () => viewCarDetail(car.id));
      carList.appendChild(carItem);
    });
  } catch (error) {
    console.error("Error searching cars:", error);
  }
});

// View Car Details
async function viewCarDetail(carId) {
  try {
    const response = await fetch(`${apiBaseUrl}/cars/${carId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const car = await response.json();

    document.getElementById("car-detail-title").textContent = car.title;
    document.getElementById("car-detail-description").textContent = car.description;
    document.getElementById("car-detail-tags").textContent = car.tags.join(", ");

    const imagesContainer = document.getElementById("car-detail-images");
    imagesContainer.innerHTML = "";
    car.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image;
      img.alt = "Car Image";
      imagesContainer.appendChild(img);
    });

    document.getElementById("car-detail-modal").style.display = "block";

    document.getElementById("edit-car-button").onclick = () => editCar(carId, car);
    document.getElementById("delete-car-button").onclick = () => deleteCar(carId);
  } catch (error) {
    console.error("Error viewing car details:", error);
  }
}

// Edit Car
async function editCar(carId, car) {
  const newTitle = prompt("Edit Title:", car.title);
  const newDescription = prompt("Edit Description:", car.description);
  const newTags = prompt("Edit Tags (comma-separated):", car.tags.join(","));

  if (!newTitle || !newDescription || !newTags) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/cars/${carId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        tags: newTags.split(","),
      }),
    });

    if (response.ok) {
      alert("Car updated successfully!");
      listCars();
    } else {
      alert("Failed to update car.");
    }
  } catch (error) {
    console.error("Error updating car:", error);
  }
}

// Delete Car
async function deleteCar(carId) {
  if (!confirm("Are you sure you want to delete this car?")) {
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/cars/${carId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
      alert("Car deleted successfully!");
      listCars();
      document.getElementById("car-detail-modal").style.display = "none";
    } else {
      alert("Failed to delete car.");
    }
  } catch (error) {
    console.error("Error deleting car:", error);
  }
}

// Close Modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("car-detail-modal").style.display = "none";
});

// Initial Load
listCars();

// Example of dynamic product display
function displayCarList(cars) {
  const carList = document.getElementById("car-list");
  carList.innerHTML = ""; // Clear existing list
  cars.forEach(car => {
      const carItem = document.createElement("li");
      carItem.classList.add("list-group-item");
      carItem.innerHTML = `
          <h4>${car.title}</h4>
          <p>${car.description}</p>
          <a href="car-detail.html?id=${car.id}" class="btn btn-info">View Details</a>
          <button class="btn btn-warning" onclick="editCar(${car.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteCar(${car.id})">Delete</button>
      `;
      carList.appendChild(carItem);
  });
}

// Handle Search
document.getElementById("search-button").addEventListener("click", () => {
  const searchQuery = document.getElementById("search-bar").value;
  // Filter cars based on search query (title, description, or tags)
  const filteredCars = cars.filter(car => 
      car.title.includes(searchQuery) || 
      car.description.includes(searchQuery) || 
      car.tags.includes(searchQuery)
  );
  displayCarList(filteredCars);
});

// Edit car
function editCar(carId) {
  // Redirect to the edit page or open a form to update car details
  window.location.href = `edit-car.html?id=${carId}`;
}

// Delete car
function deleteCar(carId) {
  if (confirm("Are you sure you want to delete this car?")) {
      // Delete the car from the database
      // After successful deletion, refresh the car list
      alert("Car deleted!");
      // Code to remove car from the database goes here
  }
}

