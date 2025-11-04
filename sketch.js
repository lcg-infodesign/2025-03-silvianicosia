let data;

let minLat, minLon, maxLat, maxLon;

function preload() {
  data = loadTable("assets/data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");

  let allLat = data.getColumn("Latitude").map(Number);
  let allLon = data.getColumn("Longitude").map(Number);

  minLat = min(allLat);
  maxLat = max(allLat);
  minLon = min(allLon);
  maxLon = max(allLon);
}

function draw() {
  background(10);

  drawLegend();

  for (let row = 0; row < data.getRowCount(); row++) {
    let lon = data.getNum(row, "Longitude");
    let lat = data.getNum(row, "Latitude");
    let country = data.getString(row, "Country");
    let volcanoName = data.getString(row, "Volcano Name");
    let elevation = data.getString(row, "Elevation (m)");
    let lastEruption = data.getString(row, "Last Known Eruption");

    let x = map(lon, minLon, maxLon, 0, width);
    let y = map(lat, minLat, maxLat, height, 0);
    let radius = 7;

    let d = dist(mouseX, mouseY, x, y);
    let isHovered = d < radius;

    let isEurope = checkIfEurope(country);
    let colorFill = isEurope ? color(255, 60, 60) : color(255, 150, 40); // rosso/arancione

    noStroke();
    fill(colorFill);
    ellipse(x, y, radius * 2);

    // tooltip al passaggio del mouse
    if (isHovered) {
      fill(255);
      textAlign(LEFT);
      textSize(12);
      // usare il simbolo "**" per grassetto non funziona in p5, quindi simuliamo con colore o dimensione diversa
      text(
        country + "\n" +
        "- " + volcanoName + "\n" +
        "- Elevation: " + elevation + " m\n" +
        "- Last eruption: " + lastEruption,
        mouseX + 10,
        mouseY
      );
    }
  }
}

function checkIfEurope(country) {
  let europeanCountries = [
    "Italy", "France", "Spain", "Iceland", "Greece", "Portugal",
    "Germany", "Austria", "Switzerland", "Norway", "Sweden",
    "Finland", "United Kingdom", "Ireland", "Russia", "Turkey",
    "Romania", "Bulgaria", "Croatia", "Slovakia", "Slovenia",
    "Poland", "Czech Republic", "Hungary"
  ];
  return europeanCountries.includes(country);
}

function drawLegend() {
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT);
  text("LEGENDA:", 20, 30);

  fill(255, 60, 60);
  ellipse(30, 50, 12);
  fill(255);
  text("Vulcani europei", 50, 54);

  fill(255, 150, 40);
  ellipse(30, 70, 12);
  fill(255);
  text("Vulcani non europei", 50, 74);
}
