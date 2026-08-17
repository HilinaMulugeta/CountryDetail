const form = document.querySelector("#searchForm");
const input = document.querySelector("#countryInput");
const out = document.querySelector("#facts");
const countryHeader = document.querySelector(".country-header");
const countryName = document.querySelector("#country-name");
const countryFlag = document.querySelector("#country-flag");

// Helper function to append structured elements using createElement
function renderFact(container, label, value, cardClass) {
  const p = document.createElement("p");
  p.className = `fact-item ${cardClass}`;

  const strong = document.createElement("strong");
  strong.textContent = label;

  const span = document.createElement("span");
  span.textContent = value;

  p.appendChild(strong);
  p.appendChild(span);
  container.appendChild(p);
}

async function showCountry(name) {
  // 1. Loading State
  out.textContent = "";
  const loadingText = document.createElement("p");
  loadingText.className = "loading";
  loadingText.textContent = "🔄Loading country data…";
  out.appendChild(loadingText);

  try {
    // 2. Fetch Data
    const res = await fetch(
      `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`,
    );

    if (!res.ok) {
      console.log(res.status);
      throw new Error("❌ We couldn't find that country. Try another name.");
    }

    const data = await res.json();
    const country = Array.isArray(data) ? data[0] : data;

    // 3. Extract safe dynamic data
    const capital = country.capital?.[0] ?? "N/A";
    const region = country.region ?? "N/A";
    const population = country.population
      ? country.population.toLocaleString()
      : "N/A";
    const languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "N/A";

    const currencies = country.currencies
      ? Object.values(country.currencies)
          .map((c) => `${c.name} (${c.symbol ?? ""})`)
          .join(", ")
      : "N/A";
    const timezones = country.timezones?.[0] ?? "N/A";

    // Clear loading state
    out.textContent = "";
    // countryHeader.innerHTML = "";

    // Header Title
    const title = document.createElement("h2");
    countryName.textContent = country.name.common;

    // Flag Image
    if (country.flags?.png) {
      countryFlag.src = country.flags.png;
      countryFlag.alt = country.flags.alt || `Flag of ${country.name.common}`;
      countryFlag.hidden = false;
    } else {
      countryFlag.hidden = true;
    }

    // 4. Success State using createElement helper
    renderFact(out, "Capital", capital, "card1");
    renderFact(out, "Region", region, "card2");
    renderFact(out, "Population", population, "card3");
    renderFact(out, "language", languages, "card4");
    renderFact(out, "Currencies", currencies, "card5");
    renderFact(out, "Time Zone", timezones, "card6");
  } catch (err) {
    // 5. Error State
    out.textContent = "";
    const errorText = document.createElement("p");
    errorText.className = "error";
    errorText.textContent = err.message || "Failed to fetch country data";
    out.appendChild(errorText);
  }
}

// Search submission event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    showCountry(query);
  }
});

// Default to Ethiopia on first load
showCountry("Ethiopia");
