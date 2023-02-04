// VARIABLES
const radioList = ["allsites-radio", "identified-radio", "completed-radio", "confirmed-radio", "prosp-radio", "cancel-radio"];

mapboxgl.accessToken = "pk.eyJ1IjoiaGlnaGVzdHJvYWQiLCJhIjoiY2w5bjYzdXlyMDNyOTNycDh4YnB1dWV5eiJ9.vhIIq0L5So522RkERq7MNQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/highestroad/cldp1727l003801my4c9m90vp", // style URL
  center: [29.736, -1.975], // starting position [lng, lat]
  zoom: 7.5, // starting zoom
  pitch: 0,
  minZoom: 7.5,
  // hash: true,
});

map.on("load", () => {
  const nav = new mapboxgl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: true,
  });
  map.addControl(nav, "top-right");

  document.getElementById("3d-switch").addEventListener("change", (e) => {
    if (e.target.checked) {
      map.easeTo({ pitch: 70 });
    } else {
      map.easeTo({ pitch: 0 });
    }
  });
  // when satellite view is checked make "satellite" layer visible
  document.getElementById("sat-switch").addEventListener("change", (e) => {
    if (e.target.checked) {
      map.setLayoutProperty("satellite", "visibility", "visible");
    } else {
      map.setLayoutProperty("satellite", "visibility", "none");
    }
  });
  for (let i = 0; i < radioList.length; i++) {
    document.getElementById(radioList[i]).addEventListener("change", (e) => {
      console.log(radioList[i]);
      if (radioList[i] == "allsites-radio") {
        // only show sites in the all-sites layer that have stage matching identified
        map.setFilter("all-sites", null);
        map.setFilter("all-sites-shadow", null);
      } else if (radioList[i] == "identified-radio") {
        // only show sites in the all-sites layer that have stage matching identified
        map.setFilter("all-sites", ["==", "Stage", "Identified"]);
        map.setFilter("all-sites-shadow", ["==", "Stage", "Identified"]);
      } else if (radioList[i] == "completed-radio") {
        // only show sites in the all-sites layer that have stage matching identified
        map.setFilter("all-sites", ["==", "Stage", "Complete"]);
        map.setFilter("all-sites-shadow", ["==", "Stage", "Complete"]);
      } else if (radioList[i] == "confirmed-radio") {
        // only show sites in the all-sites layer that have stage matching confirmed or ready to confirm
        map.setFilter("all-sites", ["in", "Stage", "Confirmed", "Ready to Confirm"]);
        map.setFilter("all-sites-shadow", ["in", "Stage", "Confirmed", "Ready to Confirm"]);
      } else if (radioList[i] == "prosp-radio") {
        // only show sites in the all-sites layer that have stage matching identified
        map.setFilter("all-sites", ["==", "Stage", "Prospecting"]);
        map.setFilter("all-sites-shadow", ["==", "Stage", "Prospecting"]);
      } else if (radioList[i] == "cancel-radio") {
        // only show sites in the all-sites layer that have stage matching identified
        map.setFilter("all-sites", ["==", "Stage", "Cancelled"]);
        map.setFilter("all-sites-shadow", ["==", "Stage", "Cancelled"]);
      } else {
        console.log("layer not in style sheet");
      }
    });
  }
  map.on("mouseenter", "all-sites", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "all-sites", () => {
    map.getCanvas().style.cursor = "";
  });

  // whenthe all-sites layer is clicked show a mapbox popup
  map.on("click", "all-sites", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    // const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    console.log(e.features[0].properties);
    let region = "Region: " + e.features[0].properties["Level 2 Government"];
    let name = "Bridge name: " + e.features[0].properties["Bridge Name"];
    let year = "Year Built: " + e.features[0].properties["B2P Fiscal Year"];
    let pop = "Population served: " + e.features[0].properties["Individuals Directly Served"];
    let popClose = "Population within 2km: " + e.features[0].properties["Population Estimate 2000m"];
    let popupList = [region, name, year, pop, popClose];

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML("<div class='popup-custom'>" + popupList.join("<br>") + "</div>")
      .on("close", (e) => {
        console.log("popup closed");
      })
      .addTo(map);
  });
});
