
/**
 * { main } html tag object for use in other views
 */
var __MAIN__ = document.querySelector('#main');

/**
 * Display the initial view
 */
function displayWelcome() {
    try {
        __MAIN__.innerHTML = '';
    } catch (error) {
        
    }
}