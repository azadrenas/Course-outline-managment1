document.addEventListener("submit", async function(e){
  if(e.target && e.target.id === "contactForm"){
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };
    const status = document.getElementById("status");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error("Server error");
      status.textContent = "Message sent — thank you!";
      form.reset();
    } catch (err) {
      status.textContent = "Send error: " + err.message;
    }
  }
});
