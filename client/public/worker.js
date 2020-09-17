console.log("service worker loaded");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved");
  self.registration.showNotification(data.title, {
    body: "BevStock - Inventory Management",
  });
});