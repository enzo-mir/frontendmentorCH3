const input = document.querySelector("#input");
const displayResult = document.querySelector("#result");
const filterBy = document.getElementById("filterBy");
const options = filterBy.querySelectorAll("option");
const details = document.querySelector(".details");
const schemeMode = document.querySelector(".schemeMode");
const schemeModeImg = document.querySelector(".schemeMode img");

window.onload = () => {
  details.setAttribute("data-visible", "false");
};

schemeMode.onclick = () => {
  document.body.classList.toggle("darkMode");
  schemeModeImg.setAttribute("src", "/assets/sun.svg");

  if (!document.body.classList.contains("darkMode")) {
    schemeModeImg.setAttribute("src", "/assets/nuit.png");
  }
};

function backDetails() {
  document.body.style.overflow = "visible"
  details.setAttribute("data-visible", "false");
  details.innerHTML = `
  <div class="backBtn" onclick="backDetails()"> 
    <img src="left-arrow.png" alt="">
    <div>Back</div>
  </div>
`;
}

let dataArray;

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");

  const results = await res.json();

  dataArray = listCountries(results);
  createHtmlComponents(dataArray);
}

getCountries();

function listCountries(data) {
  console.log(data);
  const orderedData = data.sort((a, b) => {
    if (a.name.common.toLowerCase() < b.name.common.toLowerCase()) {
      return -1;
    }
    if (a.name.common.toLowerCase() > b.name.common.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  return orderedData;
}

function createHtmlComponents(usersList) {

  usersList.forEach((countries) => {
    var capital;
    countries.capital ? (capital = countries.capital[0]) : (capital = "None");
    var populations = new Intl.NumberFormat("en-En").format(countries.population);

    const listItem = document.createElement("div");
    listItem.setAttribute("class", "card");
    listItem.innerHTML = `
        <img loading="lazy" src="${countries.flags.png}">
        <h2>${countries.name.common}</h2>
        <p><strong>Population :</strong> ${populations}</p>
        <p><strong>Region :</strong> ${countries.region}</p>
        <p><strong>Capital :</strong> ${capital}</p>
    `;

    displayResult.appendChild(listItem);

    listItem.onclick = creatComponentsDetails;

    function creatComponentsDetails() {

      document.body.style.overflow = "hidden"

      let NativeName, currencies, languages;

      var nativeNamesObj = countries.name.nativeName
        ? Object.values(countries.name.nativeName)
        : "";
      NativeName = nativeNamesObj
        ? nativeNamesObj[nativeNamesObj.length - 1].common
        : "None";

      var currenciesObj = countries.currencies ? Object.values(countries.currencies) : "";
      currencies = currenciesObj ? currenciesObj[0].name : "None";

      var languagesObj = countries.languages ? Object.values(countries.languages) : "";
      languages = languagesObj ? languagesObj.join(", ") : "None";

      var borderObj = countries.borders ? Object.values(countries.borders) : "";

      console.log(countries);
      details.setAttribute("data-visible", "true");
      details.innerHTML += `
        <div class='specs'>
            <img src='${countries.flags.png}'>
            <aside>
            <div class='left-side'>
              <div class='titleSpecs'>
              <h2>${countries.name.common}</h2>
              </div>
              <p><strong>Native Name:</strong> ${NativeName}</p>
              <p><strong>Population:</strong> ${populations}</p>
              <p><strong>Region:</strong> ${countries.region}</p>
              <p><strong>Sub Region:</strong> ${countries.subregion}</p>
              <p><strong>Capital:</strong> ${capital}</p>
            </div>
            <div class='right-side'>
              <p><strong>Top Level Domain:</strong> ${countries.tld[0]}</p>
              <p><strong>Currencies:</strong> ${currencies}</p>
              <p><strong>Languages:</strong> ${languages}</p>
            </div>
            <div class='bottom-side'>
            <p class='borderCountries'><strong>Border Countries :</strong></p>
            
            </div>
      `;

      const bottomSide = document.querySelector(".bottom-side");
      if (borderObj) {
        borderObj.forEach((element) => {
          let newBorders = bottomSide.appendChild(
            document.createElement("div")
          );
          newBorders.setAttribute("class", "border");

          var borderArr = dataArray.filter((el) => el.cca3.includes(element));
          let commonNameBorder = borderArr[0].name.common;

          newBorders.innerHTML = commonNameBorder;
        });
      } else {
        let newBorders = bottomSide.appendChild(document.createElement("div"));
        newBorders.setAttribute("class", "border");
        newBorders.innerHTML = "None";
      }
    }
  });
  
  

}

input.addEventListener("input", filterData);

function filterData(e) {
  displayResult.innerHTML = "";
  const searchedString = e.target.value.toLowerCase().replace(/\s/g, "");
  var searchFilteredArr;

  if (filterBy.value) {
    searchFilteredArr = dataArray.filter(
      (el) =>
        el.name.common.toLowerCase().includes(searchedString) &&
        el.region.toLowerCase().includes(filterBy.value.toLowerCase())
    );
  } else {
    searchFilteredArr = dataArray.filter((el) =>
      el.name.common.toLowerCase().includes(searchedString)
    );
  }

  createHtmlComponents(searchFilteredArr);
}

filterBy.addEventListener("change", filterRegion);
var RegionFilteredArr;
function filterRegion(e) {
  displayResult.innerHTML = "";

  if (input.value) {
    RegionFilteredArr = dataArray.filter(
      (el) =>
        el.region.toLowerCase().includes(e.target.value.toLowerCase()) &&
        el.name.common.toLowerCase().includes(input.value.toLowerCase())
    );
  } else {
    RegionFilteredArr = dataArray.filter((el) =>
      el.region.toLowerCase().includes(e.target.value.toLowerCase())
    );
  }

  createHtmlComponents(RegionFilteredArr);
}