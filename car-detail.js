// Get the car ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const carId = urlParams.get('id');

// Dummy data for testing (replace with actual data from backend)
const cars = [
    { id: 1, title: 'Car 1', description: 'Description of Car 1', tags: 'tag1, tag2', image: 'car1.jpg' },
    { id: 2, title: 'Car 2', description: 'Description of Car 2', tags: 'tag3, tag4', image: 'car2.jpg' },
    // Add more car data as needed
];

// Find the car by ID
const car = cars.find(c => c.id === parseInt(carId));

// Display car details
if (car) {
    document.getElementById('car-title').textContent = car.title;
    document.getElementById('car-description').textContent = car.description;
    document.getElementById('car-tags').textContent = car.tags;
    document.getElementById('car-image').src = car.image;
}

// Edit car
document.getElementById('edit-button').addEventListener('click', () => {
    window.location.href = `edit-car.html?id=${carId}`;
});

// Delete car
document.getElementById('delete-button').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this car?')) {
        // Delete the car (replace this with actual deletion logic)
        alert('Car deleted!');
        // Redirect to car list page after deletion
        window.location.href = 'car-list.html';
    }
});
