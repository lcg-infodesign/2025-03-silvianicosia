let data;

let minLat, minLon, maxLat, maxLon;
let hoveredVolcano = null;
let margin = 60;
let topMargin = 100; // margine ridotto

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

  // disegna cornice
  noFill();
  stroke(255, 255, 255, 100);
  strokeWeight(2);
  rect(margin, topMargin, width - margin * 2, height - topMargin - margin);

  drawTitle();
  drawLegend();

  hoveredVolcano = null;

  for (let row = 0; row < data.getRowCount(); row++) {
    let lon = data.getNum(row, "Longitude");
    let lat = data.getNum(row, "Latitude");
    let country = data.getString(row, "Country");
    let volcanoName = data.getString(row, "Volcano Name");
    let elevation = data.getString(row, "Elevation (m)");
    let lastEruption = data.getString(row, "Last Known Eruption");

    let x = map(lon, minLon, maxLon, margin + 20, width - margin - 20);
    let y = map(lat, minLat, maxLat, height - margin - 20, topMargin + 20);
    let radius = 7;

    let d = dist(mouseX, mouseY, x, y);
    let isHovered = d < radius;

    let isEurope = checkIfEurope(country);
    let baseColor = isEurope ? color(255, 60, 60) : color(255, 150, 40);

    // effetto glow - cerchi concentrici sfumati
    noStroke();
    for (let i = 3; i > 0; i--) {
      let alpha = 40 / i;
      fill(red(baseColor), green(baseColor), blue(baseColor), alpha);
      ellipse(x, y, radius * 2 * (1 + i * 0.3));
    }

    // puntino principale
    fill(baseColor);
    ellipse(x, y, radius * 2);

    if (isHovered) {
      hoveredVolcano = {
        country: country,
        volcanoName: volcanoName,
        elevation: elevation,
        lastEruption: lastEruption
      };
    }
  }

  if (hoveredVolcano) {
    drawTooltip(hoveredVolcano);
  }
}

function drawTooltip(volcano) {
  let tooltipText = 
    volcano.country + "\n" +
    "- " + volcano.volcanoName + "\n" +
    "- Elevation: " + volcano.elevation + " m\n" +
    "- Last eruption: " + volcano.lastEruption;
  
  let padding = 8;
  let lineHeight = 16;
  let lines = tooltipText.split('\n');
  let maxWidth = 0;
  
  textSize(12);
  for (let line of lines) {
    maxWidth = max(maxWidth, textWidth(line));
  }
  
  let boxWidth = maxWidth + padding * 2;
  let boxHeight = lines.length * lineHeight + padding * 2;
  
  // calcola posizione tooltip per non uscire dai bordi
  let tooltipX = mouseX + 10;
  let tooltipY = mouseY - padding;
  
  if (tooltipX + boxWidth > width - 10) {
    tooltipX = mouseX - boxWidth - 10;
  }
  if (tooltipY + boxHeight > height - 10) {
    tooltipY = height - boxHeight - 10;
  }
  
  fill(0, 0, 0, 200);
  stroke(255, 255, 255, 150);
  strokeWeight(1);
  rect(tooltipX, tooltipY, boxWidth, boxHeight, 4);
  
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(12);
  text(tooltipText, tooltipX + padding, tooltipY + lineHeight);
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

function drawTitle() {
  fill(255);
  noStroke();
  textAlign(CENTER);
  
  // Titolo sopra la cornice
  textSize(32);
  textStyle(BOLD);
  text("MAPPA MONDIALE DEI VULCANI", width / 2, 40);
  
  // Sottotitolo sotto il titolo, sopra la cornice
  textSize(14);
  textStyle(NORMAL);
  fill(255, 255, 255, 180);
  text("Distribuzione geografica e informazioni sui principali vulcani del mondo", width / 2, 70);
}

function drawLegend() {
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT);
  text("LEGENDA:", margin + 20, height - margin - 60);

  fill(255, 60, 60);
  ellipse(margin + 30, height - margin - 40, 12);
  fill(255);
  text("Vulcani europei", margin + 50, height - margin - 36);

  fill(255, 150, 40);
  ellipse(margin + 30, height - margin - 20, 12);
  fill(255);
  text("Vulcani non europei", margin + 50, height - margin - 16);
}
