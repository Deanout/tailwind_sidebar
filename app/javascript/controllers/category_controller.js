import { Controller } from "@hotwired/stimulus";

const SINGLE_CLICK_TIMEOUT = 300;

// Connects to data-controller="category"
export default class extends Controller {
  static targets = ["name"];
  connect() {
    console.log("Connected");
    this.clickCount = 0;
    this.singleClickTimer = null;
    this.originalNameTarget = null;
  }

  click(event) {
    this.clickCount++;

    if (this.clickCount === 1) {
      this.singleClickTimer = setTimeout(() => {
        this.clickCount = 0;
      }, SINGLE_CLICK_TIMEOUT);
    } else if (this.clickCount === 2) {
      clearTimeout(this.singleClickTimer);
      this.clickCount = 0;
      this.handleDoubleClick(event);
    }
  }

  handleDoubleClick(event) {
    console.log("Clicked");
    event.preventDefault();

    this.originalNameTarget = this.nameTarget;
    let categoryName = this.originalNameTarget.querySelector("a").innerText;
    let inputField = this.createInputField(categoryName);

    this.element.replaceChild(inputField, this.nameTarget);
    inputField.focus();
  }

  createInputField(value) {
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = value;
    inputField.style.width = "100%"; // Set the width to 100%
    inputField.style.boxSizing = "border-box"; // Include padding and border in element's total width and height
    inputField.style.height = "inherit"; // Set height to inherit from parent
    inputField.style.lineHeight = "inherit"; // Set line-height to inherit from parent
    inputField.addEventListener("blur", this.submit.bind(this));
    inputField.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    });

    return inputField;
  }

  submit(event) {
    let inputField = event.target;
    let { categoryId } = this.element.dataset;
    let categoryName = inputField.value;

    fetch(`/categories/${categoryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": this.getMetaValue("csrf-token"),
      },
      body: JSON.stringify({ category: { name: categoryName } }),
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then(({ status, name }) => {
        if (status === "ok") {
          this.originalNameTarget.querySelector("a").innerText = name;
          this.element.replaceChild(this.originalNameTarget, inputField);
        } else {
          // Handle error...
        }
      })
      .catch((error) => {
        // Handle fetch errors
        console.error("Error:", error);
      });
  }

  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element.getAttribute("content");
  }
}
