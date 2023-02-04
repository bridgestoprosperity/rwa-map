map.on("click", showList[l], (e) => {
    popupVisible = false;
    hov.liveDataHandler(e.features[0]);
    popupVisible = true;
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    let properties = e.features[0].properties;
    let blockingList = [];
    let blockingString = "";
    if (properties["Education access blocked by river"].includes("Primary") !== false) {
      blockingList.push("Primary School");
    }
    if (properties["Education access blocked by river"].includes("Secondary") !== false) {
      blockingList.push("Secondary School");
    }
    if (properties["Education access blocked by river"].includes("University") !== false) {
      blockingList.push("University");
    }
    if (properties["Health access blocked by river"].includes("Hospital") !== false) {
      blockingList.push("Hospital");
    }
    if (properties["Health access blocked by river"].includes("Clinic") !== false) {
      blockingList.push("Clinic");
    }
    if (properties["Health access blocked by river"].includes("Pharmacy") !== false) {
      blockingList.push("Pharmacy");
    }

    if (blockingList.length > 1) {
      let last = blockingList.pop();
      blockingString = blockingList.join(", ") + " and " + last + " Blocked";
    } else if (blockingList.length == 1) {
      blockingString = blockingList[0] + " Blocked";
    } else {
      blockingString = "";
    }

    let name = "Name: " + properties["Bridge Name"];
    let village = "Village: " + properties["Bridge Opportunity: Level 4 Government"];
    let days = "Days Flooded: " + properties["Days per year river is flooded"];
    let width = "River Width: " + properties["Width of River During Flooding (m)"] + "m";
    let mortality = "Deaths: " + properties["River crossing deaths in last 3 years"];
    let blocking = "Blocking: " + blockingString;
    let rejected = "Rejected: " + properties["Flag for Rejection"];

    let popupList = [name, village, days, width, mortality, blocking, rejected];

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML("<div class='popup-custom'>" + popupList.join("<br>") + "</div>")
      .on("close", (e) => {
        popupVisible = false;
      })
      .addTo(map);
  });