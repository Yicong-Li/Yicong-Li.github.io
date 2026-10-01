document.addEventListener('DOMContentLoaded', function() {
    const mode_toggle = document.getElementById("light-toggle");
    if (!mode_toggle) return;

    const labels = {
        system: "Theme: automatic (follows your system). Click for light.",
        light: "Theme: light. Click for dark.",
        dark: "Theme: dark. Click for automatic.",
    };
    const updateLabel = () => {
        const label = labels[determineThemeSetting()];
        mode_toggle.setAttribute("title", label);
        mode_toggle.setAttribute("aria-label", label);
    };

    updateLabel();
    mode_toggle.addEventListener("click", function() {
        toggleThemeSetting();
        updateLabel();
    });
});

