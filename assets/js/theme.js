// Has to be in the head tag, otherwise a flicker effect will occur.

// The theme setting is "system" (follow the OS), "light" or "dark";
// the computed theme is the one actually shown: "light" or "dark".

// Cycle the setting: system -> light -> dark -> system.
let toggleThemeSetting = () => {
  let themeSetting = determineThemeSetting();
  if (themeSetting == "system") {
    setThemeSetting("light");
  } else if (themeSetting == "light") {
    setThemeSetting("dark");
  } else {
    setThemeSetting("system");
  }
};

let setThemeSetting = (themeSetting) => {
  localStorage.setItem("theme-setting", themeSetting);
  document.documentElement.setAttribute("data-theme-setting", themeSetting);
  applyTheme();
};

let determineThemeSetting = () => {
  let themeSetting = localStorage.getItem("theme-setting");
  if (themeSetting != "system" && themeSetting != "light" && themeSetting != "dark") {
    themeSetting = "system";
  }
  return themeSetting;
};

let determineComputedTheme = () => {
  let themeSetting = determineThemeSetting();
  if (themeSetting != "system") {
    return themeSetting;
  }
  const userPref = window.matchMedia;
  if (userPref && userPref("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

let applyTheme = () => {
  let theme = determineComputedTheme();

  transTheme();
  setHighlight(theme);
  setGiscusTheme(theme);
  document.documentElement.setAttribute("data-theme", theme);

  // Add class to tables.
  let tables = document.getElementsByTagName("table");
  for (let i = 0; i < tables.length; i++) {
    if (theme == "dark") {
      tables[i].classList.add("table-dark");
    } else {
      tables[i].classList.remove("table-dark");
    }
  }

  // Set jupyter notebooks themes.
  let jupyterNotebooks = document.getElementsByClassName("jupyter-notebook-iframe-container");
  for (let i = 0; i < jupyterNotebooks.length; i++) {
    let bodyElement = jupyterNotebooks[i].getElementsByTagName("iframe")[0].contentWindow.document.body;
    if (theme == "dark") {
      bodyElement.setAttribute("data-jp-theme-light", "false");
      bodyElement.setAttribute("data-jp-theme-name", "JupyterLab Dark");
    } else {
      bodyElement.setAttribute("data-jp-theme-light", "true");
      bodyElement.setAttribute("data-jp-theme-name", "JupyterLab Light");
    }
  }

  // Updates the background of medium-zoom overlay.
  if (typeof medium_zoom !== "undefined") {
    medium_zoom.update({
      background:
        getComputedStyle(document.documentElement).getPropertyValue(
          "--global-bg-color"
        ) + "ee", // + 'ee' for trasparency.
    });
  }
};

let setHighlight = (theme) => {
  if (theme == "dark") {
    document.getElementById("highlight_theme_light").media = "none";
    document.getElementById("highlight_theme_dark").media = "";
  } else {
    document.getElementById("highlight_theme_dark").media = "none";
    document.getElementById("highlight_theme_light").media = "";
  }
};

let setGiscusTheme = (theme) => {
  function sendMessage(message) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
  }

  sendMessage({
    setConfig: {
      theme: theme,
    },
  });
};

let transTheme = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 500);
};

let initTheme = () => {
  // The old two-way toggle saved its result under "theme" on every page load,
  // which kept visitors in dark mode after their system switched back. Drop it.
  localStorage.removeItem("theme");
  setThemeSetting(determineThemeSetting());

  // While set to "system", follow the OS when it switches between light and dark.
  if (window.matchMedia) {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (determineThemeSetting() == "system") {
        applyTheme();
      }
    };
    if (darkQuery.addEventListener) {
      darkQuery.addEventListener("change", onSystemChange);
    } else {
      darkQuery.addListener(onSystemChange);
    }
  }
};

initTheme();
