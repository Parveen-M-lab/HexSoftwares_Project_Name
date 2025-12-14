function submitDonation(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;

  alert("Thank you for your donating");
}

function scrollToForm() {
  document
    .getElementById("donation-form")
    .scrollIntoView({ behavior: "smooth" });
}
function scrollToDonate() {
  document.getElementById("donate").scrollIntoView({ behavior: "smooth" });
}

/* Scroll Reveal Animation */
const sections = document.querySelectorAll(".fade");
function reveal() {
  sections.forEach((sec) => {
    if (sec.getBoundingClientRect().top < window.innerHeight - 100) {
      sec.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", reveal);
reveal();
