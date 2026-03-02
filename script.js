document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("rsvpForm");
    const thankYou = document.getElementById("thankYou");
    const page = document.querySelector(".page");
    const formError = document.getElementById("formError");
    const submitBtn = document.getElementById("submitBtn");
    const guestNameField = document.getElementById("fieldGuestName");
    const guestNameInput = document.getElementById("guest_name");
    const bringingGuestRadios = form && form.querySelectorAll('input[name="bringing_guest"]');

    if (!form || !thankYou) return;

    // Show/hide guest name and set required when "Yes, one guest" is selected
    if (guestNameField && guestNameInput && bringingGuestRadios && bringingGuestRadios.length) {
        function updateGuestField() {
            var bringingGuest = form.querySelector('input[name="bringing_guest"]:checked');
            if (bringingGuest && bringingGuest.value === "yes") {
                guestNameField.hidden = false;
                guestNameInput.required = true;
            } else {
                guestNameField.hidden = true;
                guestNameInput.required = false;
                guestNameInput.value = "";
            }
        }
        bringingGuestRadios.forEach(function (radio) {
            radio.addEventListener("change", updateGuestField);
        });
        updateGuestField();
    }

    function showError(msg) {
        if (formError) {
            formError.textContent = msg || "Something went wrong. Please try again.";
            formError.classList.remove("hidden");
        }
    }

    function hideError() {
        if (formError) {
            formError.textContent = "";
            formError.classList.add("hidden");
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        hideError();

        var data = {
            name: (form.name && form.name.value) ? form.name.value.trim() : "",
            email: (form.email && form.email.value) ? form.email.value.trim() : "",
            attending: (form.attending && form.attending.value) ? form.attending.value : "no",
            bringing_guest: (form.bringing_guest && form.bringing_guest.value) ? form.bringing_guest.value : "no",
            guest_name: (form.guest_name && form.guest_name.value) ? form.guest_name.value.trim() : "",
            dietary: (form.dietary && form.dietary.value) ? form.dietary.value.trim() : ""
        };

        var apiUrl = form.getAttribute("data-api");
        if (!apiUrl || apiUrl.indexOf("YOUR_FORM_ID") !== -1) {
            showError("Please set your Formspree form ID in the form’s data-api attribute.");
            return;
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending…";
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(function (res) {
                return res.json().then(function (json) {
                    if (!res.ok) throw new Error(json.error || (json.errors && json.errors[0] && json.errors[0].message) || res.statusText || "Request failed");
                    return json;
                }, function () {
                    if (!res.ok) throw new Error(res.statusText || "Request failed");
                    return {};
                });
            })
            .then(function () {
                if (page) page.classList.add("hidden");
                thankYou.classList.remove("hidden");
                thankYou.classList.add("visible");
            })
            .catch(function (err) {
                showError(err.message || "Could not send. Check your connection and try again.");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send response";
                }
            });
    });
});
