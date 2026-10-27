const soldOutDates = ["2026-12-25", "2026-12-31"];
const promoCodes = { "DISCOUNT10": 0.1, "SAVE20": 0.2 };
const seatLimits = { "Standard": 50, "VIP": 10 };

const form = document.getElementById("ticket-form");
form.noValidate = true;

const eventNameInput = document.getElementById("event-name");
const eventDateInput = document.getElementById("event-date");
const ticketTypeInput = document.getElementById("ticket-type");
const quantityInput = document.getElementById("quantity");
const buyerNameInput = document.getElementById("buyer-name");
const buyerEmailInput = document.getElementById("buyer-email");
const promoCodeInput = document.getElementById("promo-code");
const errorSummary = document.getElementById("error-summary");

const prevEvent = document.getElementById("prev-event");
const prevDate = document.getElementById("prev-date");
const prevType = document.getElementById("prev-type");
const prevQty = document.getElementById("prev-qty");
const prevName = document.getElementById("prev-name");
const prevTotal = document.getElementById("prev-total");

function updatePreview() {
    prevEvent.textContent = eventNameInput.value || "-";
    prevDate.textContent = eventDateInput.value || "-";
    prevType.textContent = ticketTypeInput.value || "-";
    prevQty.textContent = quantityInput.value || "0";
    prevName.textContent = buyerNameInput.value || "-";

    let basePrice = ticketTypeInput.value === "VIP" ? 100 : 40;
    let qty = Number(quantityInput.value) || 0;
    let total = basePrice * qty;

    let promo = promoCodeInput.value.trim().toUpperCase();
    if (promoCodes[promo]) {
        total = total * (1 - promoCodes[promo]);
    }
    prevTotal.textContent = total.toFixed(2);
}

function validateField(input, errorEl, customCheck, customMsg) {
    let isValid = true;
    let message = "";

    if (input.validity.valueMissing) {
        isValid = false;
        message = "This field is required.";
    } else if (input.type === "email" && input.validity.typeMismatch) {
        isValid = false;
        message = "Please enter a valid email address.";
    } else if (input.id === "buyer-name" && input.value.trim().length < 3) {
        isValid = false;
        message = "Name must be at least 3 characters long.";
    } else if (customCheck && !customCheck()) {
        isValid = false;
        message = customMsg;
    }

    if (!isValid) {
        input.setAttribute("aria-invalid", "true");
        errorEl.textContent = message;
    } else {
        input.removeAttribute("aria-invalid");
        errorEl.textContent = "";
    }
    return isValid;
}

function checkAllFields(isSubmit = false) {
    let v1 = validateField(eventNameInput, document.getElementById("event-name-error"));
    let v2 = validateField(eventDateInput, document.getElementById("event-date-error"), () => {
        return !soldOutDates.includes(eventDateInput.value);
    }, "Selected date is sold out.");

    let v3 = validateField(ticketTypeInput, document.getElementById("ticket-type-error"));
    let v4 = validateField(quantityInput, document.getElementById("quantity-error"), () => {
        let type = ticketTypeInput.value;
        let qty = Number(quantityInput.value);
        let max = seatLimits[type] || 0;
        return qty > 0 && qty <= max;
    }, "Quantity exceeds available seats for this type.");

    let v5 = validateField(buyerNameInput, document.getElementById("buyer-name-error"));
    let v6 = validateField(buyerEmailInput, document.getElementById("buyer-email-error"));
    let v7 = validateField(promoCodeInput, document.getElementById("promo-code-error"), () => {
        let code = promoCodeInput.value.trim().toUpperCase();
        return code === "" || promoCodes[code] !== undefined;
    }, "Invalid promo code.");

    return v1 && v2 && v3 && v4 && v5 && v6 && v7;
}

const inputs = [eventNameInput, eventDateInput, ticketTypeInput, quantityInput, buyerNameInput, buyerEmailInput, promoCodeInput];

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", () => {
        updatePreview();
        checkAllFields();
    });
    inputs[i].addEventListener("blur", () => {
        checkAllFields();
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (checkAllFields(true)) {
        errorSummary.classList.add("hidden");
        let bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        alert("Success! Your booking code is: " + bookingCode);
        form.reset();
        updatePreview();
    } else {
        errorSummary.textContent = "Please fix the errors in the form before submitting.";
        errorSummary.classList.remove("hidden");
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
    }
});

updatePreview();