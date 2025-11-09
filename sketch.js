let data;

let minLat, minLon, maxLat, maxLon;
let hoveredVolcano = null;
let margin = 60;
let topMargin = 100;

let filterSelect;
let currentFilter = "Tutti";

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
  
  // Dropdown menu
  let offset = 40;
  let dropdownX = margin + offset; 
  let dropdownY = topMargin + 50;
  
  filterSelect = createSelect();
  filterSelect.position(dropdownX, dropdownY);
  filterSelect.option("Tutti");

  let countries = [...new Set(data.getColumn("Country"))];
  countries.sort();
  countries.forEach(c => filterSelect.option(c));
  filterSelect.changed(() => currentFilter = filterSelect.value());
  
  // Stili estetici
  filterSelect.style('padding', '6px 10px');
  filterSelect.style('font-size', '15px');
  filterSelect.style('border', 'none');
  filterSelect.style('border-radius', '6px');
  filterSelect.style('background-color', '#1b1f3b');
  filterSelect.style('color', 'white');
  filterSelect.style('box-shadow', '0 0 8px rgba(0,0,0,0.4)');
  filterSelect.style('z-index', '100');
}

function draw() {
  // sfondo con gradiente
  setGradient(0, 0, width, height, color(10, 15, 35), color(5, 10, 25));

  // Cornice elegante
  noFill();
  stroke(255, 255, 255, 60);
  strokeWeight(2);
  rect(margin, topMargin, width - margin * 2, height - topMargin - margin, 12);

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
    
    if (currentFilter !== "Tutti" && country !== currentFilter) continue;

    let x = map(lon, minLon, maxLon, margin + 20, width - margin - 20);
    let y = map(lat, minLat, maxLat, height - margin - 20, topMargin + 20);
    let radius = 7;

    let d = dist(mouseX, mouseY, x, y);
    let isHovered = d < radius;

    let isEurope = checkIfEurope(country);
    let baseColor = isEurope ? color(255, 100, 120) : color(255, 180, 60);

    // alone esterno morbido (triangolo più grande trasparente)
    noStroke();
    fill(red(baseColor), green(baseColor), blue(baseColor), 80);
    drawTriangle(x, y, radius * 3.5);

    // triangolo principale con bordo
    stroke(255, 255, 255, 200);
    strokeWeight(1.5);
    fill(baseColor);
    drawTriangle(x, y, radius * 2.5);

    // effetto glow se hover
    if (isHovered) {
      fill(255, 255, 255, 200);
      drawTriangle(x, y, radius * 1);
      hoveredVolcano = { country, volcanoName, elevation, lastEruption };
    }
  }

  if (hoveredVolcano) drawTooltip(hoveredVolcano);
}

// Funzione per disegnare triangolo centrato
function drawTriangle(x, y, size) {
  triangle(
    x, y - size / 2,
    x - size / 2, y + size / 2,
    x + size / 2, y + size / 2
  );
}

function drawTooltip(volcano) {
  let lines = [
    { label: "Paese:", value: volcano.country },
    { label: "Nome:", value: volcano.volcanoName },
    { label: "Altitudine:", value: volcano.elevation + " m" },
    { label: "Ultima eruzione:", value: volcano.lastEruption }
  ];
  
  let padding = 10;
  let lineHeight = 18;
  textSize(13);
  
  let boxWidth = 270;
  let boxHeight = lines.length * lineHeight + padding * 2;
  let tooltipX = mouseX + 15;
  let tooltipY = mouseY - 10;
  
  if (tooltipX + boxWidth > width - 10) tooltipX = mouseX - boxWidth - 10;
  if (tooltipY + boxHeight > height - 10) tooltipY = height - boxHeight - 10;
  
  fill(0, 0, 0, 220);
  stroke(255, 255, 255, 100);
  strokeWeight(1);
  rect(tooltipX, tooltipY, boxWidth, boxHeight, 6);
  
  noStroke();
  textAlign(LEFT);
  for (let i = 0; i < lines.length; i++) {
    let yPos = tooltipY + lineHeight * (i + 1);
    fill(180, 200, 255);
    text(lines[i].label, tooltipX + padding, yPos);
    fill(255);
    text(lines[i].value, tooltipX + 130, yPos);
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

function drawTitle() {
  textAlign(CENTER);
  textStyle(BOLD);
  
  textSize(34);
  fill(255, 160, 90, 60);
  text("MAPPA MONDIALE DEI VULCANI ", width / 2 + 2, 52);
  fill(255, 220, 150);
  text(" MAPPA MONDIALE DEI VULCANI ", width / 2, 50);

  textSize(15);
  textStyle(NORMAL);
  fill(230);
  text("Distribuzione geografica e informazioni sui principali vulcani del mondo", width / 2, 75);
}

function drawLegend() {
  textAlign(LEFT);
  textSize(15);
  fill(255);
  text("LEGENDA:", margin + 20, height - margin - 70);

  let size = 12;

  // europeo
  fill(255, 100, 120);
  drawTriangle(margin + 35, height - margin - 50, size);
  fill(230);
  text("Vulcani europei", margin + 55, height - margin - 46);

  // non europeo
  fill(255, 180, 60);
  drawTriangle(margin + 35, height - margin - 30, size);
  fill(230);
  text("Vulcani non europei", margin + 55, height - margin - 26);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let offset = 40;
  let dropdownX = margin + offset; 
  let dropdownY = topMargin + 50;
  if (filterSelect) filterSelect.position(dropdownX, dropdownY);
}

// Funzione per sfondo con gradiente
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
