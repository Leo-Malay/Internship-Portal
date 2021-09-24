/* Malay Bhavsar (Leo-Malay) */
const getUrlParam = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
};
