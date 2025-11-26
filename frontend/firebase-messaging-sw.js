// Source - https://stackoverflow.com/a
// Posted by Justin J
// Retrieved 2025-11-26, License - CC BY-SA 4.0

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../firebase-messaging-sw.js')
		.then(function (registration) {
			console.log('Registration successful, scope is:', registration.scope);
		}).catch(function (err) {
			console.log('Service worker registration failed, error:', err);
		});
}
