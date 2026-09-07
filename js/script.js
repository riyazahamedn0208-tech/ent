/* ============================================
   AK ENT ZONE — Shared Site Script
   ============================================ */

(function () {
  "use strict";

  // Clinic constants — update here once, reflected everywhere.
  window.AKENT = {
    phoneDisplay: "83002 79451",
    phoneHref: "tel:+918300279451",
    whatsappNumber: "918300279451" // country code 91 + number, no symbols
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initActiveNavLink();
    initAccordion();
    initInquiryForm();
    initYear();
  });

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* ---------- Highlight current page in nav ---------- */
  function initActiveNavLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === path) {
        a.classList.add("active");
      }
    });
  }

  /* ---------- Services accordion (services.html) ---------- */
  function initAccordion() {
    var heads = document.querySelectorAll(".acc-head");
    if (!heads.length) return;
    heads.forEach(function (head) {
      head.addEventListener("click", function () {
        var item = head.closest(".service-accordion");
        var body = item.querySelector(".acc-body");
        var isOpen = item.classList.contains("open");

        // close others (accordion behaviour) — comment out loop to allow multi-open
        document.querySelectorAll(".service-accordion.open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".acc-body").style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove("open");
          body.style.maxHeight = null;
        } else {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });

    // Open first item by default on services page
    var first = document.querySelector(".service-accordion");
    if (first && first.dataset.openDefault === "true") {
      first.classList.add("open");
      first.querySelector(".acc-body").style.maxHeight = first.querySelector(".acc-body").scrollHeight + "px";
    }
  }

  /* ---------- Contact inquiry form -> WhatsApp ---------- */
  function initInquiryForm() {
    var form = document.getElementById("inquiryForm");
    if (!form) return;

    var nameField = document.getElementById("fullName");
    var phoneField = document.getElementById("mobileNumber");
    var treatmentField = document.getElementById("treatmentType");
    var branchField = document.getElementById("branchChoice");
    var messageField = document.getElementById("extraMessage");
    var successBox = document.getElementById("formSuccess");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      valid = validateField(nameField, function (v) { return v.trim().length >= 2; }) && valid;
      valid = validateField(phoneField, function (v) { return /^[0-9]{10}$/.test(v.replace(/\D/g, "").slice(-10)); }) && valid;
      valid = validateField(treatmentField, function (v) { return v !== ""; }) && valid;

      if (!valid) return;

      var name = nameField.value.trim();
      var phone = phoneField.value.trim();
      var treatment = treatmentField.options[treatmentField.selectedIndex].text;
      var branch = branchField && branchField.value ? branchField.options[branchField.selectedIndex].text : "";
      var message = messageField ? messageField.value.trim() : "";

      var lines = [
        "Hello AK ENT Zone, I would like to book a consultation.",
        "",
        "Name: " + name,
        "Mobile: " + phone,
        "Concern / Treatment: " + treatment
      ];
      if (branch) lines.push("Preferred Branch: " + branch);
      if (message) lines.push("Message: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + window.AKENT.whatsappNumber + "?text=" + text;

      successBox.style.display = "flex";
      window.open(url, "_blank", "noopener");
    });

    [nameField, phoneField, treatmentField].forEach(function (field) {
      if (!field) return;
      field.addEventListener("input", function () {
        field.closest(".form-row").classList.remove("invalid");
      });
    });

    function validateField(field, testFn) {
      if (!field) return true;
      var ok = testFn(field.value || "");
      field.closest(".form-row").classList.toggle("invalid", !ok);
      return ok;
    }
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
