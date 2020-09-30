//service worker loaded

self.addEventListener("push", (e) => {
  const data = e.data.json();
//Push Recieved
  self.registration.showNotification(data.title, {
    body: "BevStock - Inventory Management",
  });
});