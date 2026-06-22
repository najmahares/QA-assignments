describe("E-Commerce Automation Assignment", () => {
  let sharedEmail;
  const password = "NajmaHares123!";
  const username = "Student";

  beforeEach(() => {
    cy.visit("https://automationexercise.com");
  });

  // Test Case 1: Verify Homepage Loads
  it("Test Case 1: Should load the homepage successfully with key elements", () => {
    cy.url().should("include", "automationexercise.com");
    cy.get(".logo img").should("be.visible");
    cy.get(".shop-menu").should("be.visible");
    cy.get('a[href="/login"]')
      .should("be.visible")
      .and("contain", "Signup / Login");
  });

  // Test Case 2: Register a New User
  it("Test Case 2: Register a New User", () => {
    cy.get('a[href="/login"]').click();

    sharedEmail = `student${Date.now()}@test.com`;

    cy.get('[data-qa="signup-name"]').type(username);
    cy.get('[data-qa="signup-email"]').type(sharedEmail);
    cy.get('[data-qa="signup-button"]').click();

    cy.get("#id_gender1").check();
    cy.get('[data-qa="password"]').type(password);
    cy.get('[data-qa="days"]').select("15");
    cy.get('[data-qa="months"]').select("January");
    cy.get('[data-qa="years"]').select("2007");
    cy.get('[data-qa="first_name"]').type("Najma");
    cy.get('[data-qa="last_name"]').type("Hares");
    cy.get('[data-qa="company"]').type("Amazon");
    cy.get('[data-qa="address"]').type("Aqua 4 dua67");
    cy.get('[data-qa="country"]').select("United States");
    cy.get('[data-qa="state"]').type("California");
    cy.get('[data-qa="city"]').type("Los Angeles");
    cy.get('[data-qa="zipcode"]').type("90001");
    cy.get('[data-qa="mobile_number"]').type("0712345678");

    cy.get('[data-qa="create-account"]').click();
    cy.get('[data-qa="account-created"]').should("be.visible");
    cy.get('[data-qa="continue-button"]').click();

    cy.get(".shop-menu").should("contain", `Logged in as ${username}`);
    cy.get('a[href="/logout"]').click();
  });

  // Test Case 3: Login With Valid Credentials
  it("Test Case 3: Login With Valid Credentials", () => {
    cy.get('a[href="/login"]').click();
    cy.get('[data-qa="login-email"]').type(sharedEmail);
    cy.get('[data-qa="login-password"]').type(password);
    cy.get('[data-qa="login-button"]').click();
    cy.get(".shop-menu").should("contain", `Logged in as ${username}`);
    cy.get('a[href="/logout"]').click();
  });

  // Test Case 4: Login With Invalid Credentials
  it("Test Case 4: Login With Invalid Credentials", () => {
    cy.get('a[href="/login"]').click();
    cy.get('[data-qa="login-email"]').type("completely_fake_email@test.com");
    cy.get('[data-qa="login-password"]').type("WrongPassword123!");
    cy.get('[data-qa="login-button"]').click();
    cy.get(".login-form p")
      .should("be.visible")
      .and("contain", "Your email or password is incorrect!");
  });

  // Test Case 5: Search for a Product
  it("Test Case 5: Search for a Product", () => {
    cy.get('a[href="/products"]').click({ force: true });
    cy.url().should("include", "/products");
    cy.get("#search_product").type("dress");
    cy.get("#submit_search").click();
    cy.get(".features_items")
      .should("be.visible")
      .and("contain", "Searched Products");
    cy.get(".features_items .productinfo p").each(($el) => {
      const itemText = $el.text().toLowerCase();
      const isValidApparel =
        itemText.includes("dress") ||
        itemText.includes("top") ||
        itemText.includes("shirt") ||
        itemText.includes("gown");
      expect(isValidApparel).to.be.true;
    });
  });

  // Test Case 6: View Product Details
  it("Test Case 6: View Product Details", () => {
    cy.get('a[href="/products"]').click({ force: true });
    cy.get(".choose a").first().click({ force: true });

    cy.get(".product-information h2").should("be.visible");
    cy.get(".product-information p").eq(0).should("contain", "Category:");
    cy.get(".product-information span span").should("be.visible");
    cy.get(".product-information p").eq(1).should("contain", "Availability:");
    cy.get(".product-information p").eq(2).should("contain", "Condition:");
    cy.get(".product-information p").eq(3).should("contain", "Brand:");
  });

  // Test Case 7: Add Product to Cart
  it("Test Case 7: Add Product to Cart", () => {
    cy.get('a[href="/products"]').click({ force: true });
    cy.get(".add-to-cart").first().click({ force: true });
    cy.get(".modal-footer .btn").click();

    cy.get('a[href="/view_cart"]').first().click({ force: true });
    cy.url().should("include", "/view_cart");

    // Fixed: Standard functional length evaluation
    cy.get("#cart_info_table tbody tr").should(($tr) => {
      expect($tr.length).to.be.at.least(1);
    });
    cy.get(".cart_price").should("be.visible");
    cy.get(".cart_quantity").should("be.visible");
  });
  // Test Case 8: Remove Product From Cart
  it("Test Case 8: Remove Product From Cart", () => {
    cy.get('a[href="/products"]').click({ force: true });
    cy.get(".add-to-cart").first().click({ force: true });
    cy.get(".modal-footer .btn").click();

    cy.get('a[href="/view_cart"]').first().click({ force: true });
    cy.get(".cart_quantity_delete").first().click({ force: true });
    cy.get("#empty_cart").should("be.visible");
  });

  // Test Case 9: Submit Contact Us Form
  it("Test Case 9: Submit Contact Us Form", () => {
    cy.get('a[href="/contact_us"]').click({ force: true });

    cy.on("window:confirm", (text) => {
      expect(text).to.contains("Press OK to proceed!");
      return true;
    });

    cy.get('[data-qa="name"]').type("Najma Hares");
    cy.get('[data-qa="email"]').type("student@test.com");
    cy.get('[data-qa="subject"]').type("Automation Assignment Submission");
    cy.get('[data-qa="message"]').type(
      "This is automated via Cypress framework tests.",
    );

    cy.get('input[name="upload_file"]').selectFile({
      contents: Cypress.Buffer.from("sample text"),
      fileName: "assignment_proof.txt",
      mimeType: "text/plain",
    });

    cy.get('[data-qa="submit-button"]').click({ force: true });
    cy.get(".status.alert-success")
      .should("be.visible")
      .and(
        "contain",
        "Success! Your details have been submitted successfully.",
      );
  });

  // Challenge 1: Add Multiple Products
  it("Challenge 1: Add Multiple Products", () => {
    cy.get('a[href="/products"]').click({ force: true });
    cy.get(".features_items .add-to-cart").eq(0).click({ force: true });
    cy.get(".modal-footer .btn").click();
    cy.get(".features_items .add-to-cart").eq(2).click({ force: true });
    cy.get(".modal-footer .btn").click();

    cy.get('a[href="/view_cart"]').first().click({ force: true });

    cy.get("#cart_info_table tbody tr").should(($tr) => {
      expect($tr.length).to.be.at.least(2);
    });
  });

  // Challenge 2: Verify Product Quantity
  it("Challenge 2: Verify Product Quantity", () => {
    cy.get('a[href="/products"]').click({ force: true });
    cy.get(".choose a").first().click({ force: true });

    cy.get("#quantity").clear().type("3");
    cy.get("button.cart").click({ force: true });
    cy.get(".modal-footer .btn").click();

    cy.get('a[href="/view_cart"]').first().click({ force: true });
    cy.get(".cart_quantity button")
      .first()
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("3");
      });
    cy.get('a[href="/login"]').first().click({ force: true });
    cy.get('[data-qa="login-email"]').type(sharedEmail);
    cy.get('[data-qa="login-password"]').type(password);
    cy.get('[data-qa="login-button"]').click({ force: true });

    cy.get('a[href="/delete_account"]').first().click({ force: true });
    cy.get('[data-qa="account-deleted"]').should("be.visible");
    cy.get('[data-qa="continue-button"]').first().click({ force: true });
  });
});
