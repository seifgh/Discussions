export const PRIMARY_COLOR = "#3668FD";
export const COLORS = [
    PRIMARY_COLOR,
    "#6D3DF8",
    "#3F3E45",
    "#26BF60",
    "#F5504E",
    "#FD6584",
    "#EED600"
];
export const getCurrentThemeColor = () =>
    localStorage.themeColor || PRIMARY_COLOR;

export const setThemeColor = (color = getCurrentThemeColor()) => {
    localStorage.themeColor = color;
    document.documentElement.style.setProperty("--primary-color", color);
};

export const resetThemeColor = () => {
    delete localStorage.themeColor;
    document.documentElement.style.setProperty("--primary-color", PRIMARY_COLOR);
};