self.addEventListener("install", e => {
  console.log("Service Worker Installed");
});

self.addEventListener("push", e => {
  const data = e.data.json();

  self.registration.showNotification("AMIGO 🔴", {
    body: data.body
  });
});