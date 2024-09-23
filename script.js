async function loadFlightsFromJSON() {
  try {
    const response = await fetch("flights.json")
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON")
    }
    return await response.json()
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

function searchFlights() {
  const origin = document.getElementById("origin-f").value
  const destination = document.getElementById("destination-f").value
  const travelDate = document.getElementById("travel-date-f").value

  const resultsContainer = document.getElementById("results-container-f")
  resultsContainer.innerHTML = ""

  if (!origin || !destination || !travelDate) {
    resultsContainer.innerHTML =
      "<p>Falta información, todos los campos son obligatorios.</p>"
    return
  }

  loadFlightsFromJSON().then((flights) => {
    const filteredFlights = flights.filter(
      (flight) =>
        flight.origin.toLowerCase().includes(origin.toLowerCase()) &&
        flight.destination.toLowerCase().includes(destination.toLowerCase()) &&
        flight.dates.includes(travelDate)
    )

    const [year, month, day] = travelDate.split("-")
    const esDate = `${day}-${month}-${year}`

    if (filteredFlights.length > 0) {
      filteredFlights.forEach((flight) => {
        const resultDiv = document.createElement("div")
        resultDiv.innerHTML = `
              <h3>Información del vuelo:</h3>                    
              <strong>Origen:</strong> ${flight.origin}<br>
              <strong>Destino:</strong> ${flight.destination}<br>
              <strong>Precio:</strong> $${flight.price.toLocaleString(
                "es-ES"
              )}<br>
              <strong>Fecha:</strong> ${esDate}
              `
        resultsContainer.appendChild(resultDiv)
      })
    } else {
      resultsContainer.innerHTML = `<p>No hay vuelos de <strong>"${origin}"</strong> a <strong>"${destination}"</strong> en esta fecha.</p>`
    }
  })
}

class Flight {
  constructor(origin, destination, price, dates) {
    this.origin = origin
    this.destination = destination
    this.price = price
    this.dates = dates
  }
}

class Hotel {
  constructor(name, location, nightPrice) {
    this.name = name
    this.location = location
    this.nightPrice = nightPrice
  }
}

class Package {
  constructor(flight, hotel, nights) {
    this.flight = flight
    this.hotel = hotel
    this.nights = nights
  }

  calculatePrice() {
    const flightPrice = this.flight.price
    const hotelPricePerNight = this.hotel.nightPrice
    const hotelTotalPrice = hotelPricePerNight * this.nights
    const totalPrice = flightPrice + hotelTotalPrice
    return totalPrice
  }

  showPackageDetails() {
    return `
        <h3>Paquete turístico:</h3>
        <strong>Origen</strong>: ${this.flight.origin}<br>
        <strong>Destino:</strong> ${this.flight.destination}<br>
        <strong>Precio del vuelo:</strong> $${this.flight.price.toLocaleString(
          "es-ES"
        )}<br>
        <strong>Hotel:</strong> ${this.hotel.name}<br>
        <strong>Ubicación del hotel:</strong> ${this.hotel.location}<br>
        <strong>Precio por noche:</strong> $${this.hotel.nightPrice.toLocaleString(
          "es-ES"
        )}<br>
        <strong>Número de noches:</strong> ${this.nights}<br>
        <strong>Precio total del paquete:</strong> $${this.calculatePrice().toLocaleString(
          "es-ES"
        )}
      `
  }
}

function showSimpleNotification(message, flight, hotel, nights) {
  const notificationArea = document.getElementById("notification-area")
  notificationArea.innerHTML = `
    <h4>${message}</h4>
    <button id="view-details" class="view-details-button btn btn-sm btn-link">Ver detalles</button>
  `
  notificationArea.classList = "blue-border"

  const viewDetailsButton = document.getElementById("view-details")

  viewDetailsButton.addEventListener("click", () => {
    const resultsContainer = document.getElementById("results-container-p")
    resultsContainer.innerHTML = ""

    const pkg = new Package(flight, hotel, nights)
    const resultDiv = document.createElement("div")
    resultDiv.innerHTML = pkg.showPackageDetails()
    resultsContainer.appendChild(resultDiv)
  })
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

function searchPackages() {
  const origin = document.getElementById("origin-p").value
  const destination = document.getElementById("destination-p").value
  const travelDate = document.getElementById("travel-date-p").value
  const nights = parseInt(document.getElementById("nights").value)

  const resultsContainer = document.getElementById("results-container-p")
  resultsContainer.innerHTML = ""

  if (!origin || !destination || !travelDate) {
    resultsContainer.innerHTML =
      "<p>Ingrese un origen, destino, fecha de viaje y número de noches.</p>"
    return
  }

  loadFlightsFromJSON().then((flights) => {
    const hotels = {
      Lima: new Hotel("JW Marriott Hotel Lima", "Lima", 38140),
      "Buenos Aires": new Hotel("Alvear Palace Hotel", "Buenos Aires", 26823),
      Brasilia: new Hotel("Royal Tulip Brasilia Alvorada", "Brasilia", 41235),
      Caracas: new Hotel("Hotel Eurobuilding Caracas", "Caracas", 30150),
      Bogota: new Hotel("Four Seasons Hotel Casa Medina", "Bogota", 45780),
      Quito: new Hotel("Hotel Plaza Grande", "Quito", 37425),
      "La Paz": new Hotel("Hotel Presidente", "La Paz", 42160),
      Asuncion: new Hotel("La Mision Hotel Boutique", "Asuncion", 34890),
      Montevideo: new Hotel(
        "Sofitel Montevideo Casino Carrasco",
        "Montevideo",
        39240
      ),
      Madrid: new Hotel("Hotel Ritz Madrid", "Madrid", 85125),
      "New York": new Hotel("The Plaza Hotel", "New York", 89530),
      Miami: new Hotel("The Ritz-Carlton, South Beach", "Miami", 78255),
    }

    const filteredFlights = flights.filter(
      (flight) =>
        flight.origin.toLowerCase().includes(origin.toLowerCase()) &&
        flight.destination.toLowerCase().includes(destination.toLowerCase()) &&
        flight.dates.includes(travelDate)
    )

    if (filteredFlights.length > 0) {
      filteredFlights.forEach((flight) => {
        const hotel = hotels[flight.destination]
        if (hotel) {
          const pkg = new Package(flight, hotel, nights)
          const resultDiv = document.createElement("div")
          resultDiv.innerHTML = pkg.showPackageDetails()
          resultsContainer.appendChild(resultDiv)
        }
      })

      const alternativeFlights = flights.filter(
        (flight) =>
          flight.origin.toLowerCase().includes(origin.toLowerCase()) &&
          flight.dates.includes(travelDate) &&
          flight.destination.toLowerCase() !== destination.toLowerCase()
      )

      if (alternativeFlights.length > 0) {
        const randomFlight = getRandomElement(alternativeFlights)
        const altHotel = hotels[randomFlight.destination]
        if (altHotel) {
          const altPkg = new Package(randomFlight, altHotel, nights)

          showSimpleNotification(
            `¿Qué tal un viaje a ${
              randomFlight.destination
            } en las mismas fechas por $${altPkg
              .calculatePrice()
              .toLocaleString("es-ES")}?`,
            randomFlight,
            altHotel,
            nights
          )
        }
      }
    } else {
      resultsContainer.innerHTML = `<p>No hay paquetes turísticos disponibles desde <strong>"${origin}"</strong> para la fecha seleccionada.</p>`
    }
  })
}
