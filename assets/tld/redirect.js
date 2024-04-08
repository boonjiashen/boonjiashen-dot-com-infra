// Extract the current domain from the window.location object
var currentDomain = window.location.hostname;

// Construct the new URL using 'blog' as the subdomain
var redirectTo = 'blog.' + currentDomain;

// Redirect the browser to the new URL
window.location.href = 'https://' + redirectTo;
