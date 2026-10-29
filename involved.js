/* Harbor & Hope — working donate + volunteer forms.
   Amount chips select a gift, the Give button label follows the
   amount and frequency, both forms validate, and each ends in a
   thank-you state. Front-end demo only: no donation is taken and
   nothing is sent anywhere. */
(function () {
  "use strict";

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
  function setErr(input, errEl, bad) {
    if (errEl) errEl.classList.toggle("show", bad);
    input.classList.toggle("invalid", bad);
    return !bad;
  }

  /* ---------- donate ---------- */
  function initDonate() {
    var panel = document.getElementById("donate-panel");
    if (!panel) return;
    var amounts = panel.querySelectorAll(".amount[data-amount]");
    var freq = document.getElementById("freq");
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var btn = document.getElementById("give-btn");
    var success = document.getElementById("give-success");
    var selected = 50;

    function render() {
      Array.prototype.forEach.call(amounts, function (chip) {
        var on = Number(chip.getAttribute("data-amount")) === selected;
        chip.classList.toggle("selected", on);
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
      var monthly = freq.selectedIndex === 0;
      btn.textContent = "Give $" + selected + (monthly ? " monthly" : " one-time") + " (demo)";
    }
    Array.prototype.forEach.call(amounts, function (chip) {
      function pick() { selected = Number(chip.getAttribute("data-amount")); render(); }
      chip.addEventListener("click", pick);
      chip.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(); }
      });
    });
    freq.addEventListener("change", render);

    btn.addEventListener("click", function () {
      var ok = true;
      ok = setErr(name, document.getElementById("err-dname"), name.value.trim().length < 2) && ok;
      ok = setErr(email, document.getElementById("err-demail"), !isEmail(email.value)) && ok;
      if (!ok) { var f = panel.querySelector(".invalid"); if (f) f.focus(); return; }
      var monthly = freq.selectedIndex === 0;
      document.getElementById("give-success-text").textContent =
        "Thank you, " + name.value.trim().split(" ")[0] + " — your " + (monthly ? "monthly" : "one-time") +
        " gift of $" + selected + " would stock real shelves in a live version of this page. " +
        "A receipt would be emailed to " + email.value.trim() + ".";
      Array.prototype.forEach.call(panel.querySelectorAll(".give-controls"), function (el) { el.hidden = true; });
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
    render();
  }

  /* ---------- volunteer ---------- */
  function initVolunteer() {
    var form = document.getElementById("volunteer-form");
    if (!form) return;
    var vname = document.getElementById("vname");
    var vemail = document.getElementById("vemail");
    var role = document.getElementById("role");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      ok = setErr(vname, document.getElementById("err-vname"), vname.value.trim().length < 2) && ok;
      ok = setErr(vemail, document.getElementById("err-vemail"), !isEmail(vemail.value)) && ok;
      if (!ok) { var f = form.querySelector(".invalid"); if (f) f.focus(); return; }
      document.getElementById("volunteer-success-text").textContent =
        "Thank you, " + vname.value.trim().split(" ")[0] + " — your first pick, “" +
        role.options[role.selectedIndex].text + ",” is noted. In a live version, the orientation invite would go to " +
        vemail.value.trim() + ".";
      form.hidden = true;
      var success = document.getElementById("volunteer-success");
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", function () { initDonate(); initVolunteer(); });
})();
