curl -X 'GET' \
  'http://localhost:8080/api/bookings/upcoming' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzM4


  [
  {
    "id": "832a7dd1-b6af-4858-b4f0-b851401c944c",
    "name": "Advanced Algorithms",
    "type": "Lecture Hall B",
    "capacity": 0,
    "status": "booked",
    "image": "https://images.unsplash.com/photo-1544991185-13fe5d113fe3?auto=format&fit=crop&q=80&w=1000",
    "booker": null
  }
]

curl -X 'GET' \
  'http://localhost:8080/api/bookings/current' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzM4

  [
  {
    "id": "cfd18b70-a1ce-43be-8b16-6281b5d90db1",
    "name": "Physics Lab",
    "type": "Lab 101",
    "capacity": 0,
    "status": "booked",
    "image": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1000",
    "booker": null
  }
]