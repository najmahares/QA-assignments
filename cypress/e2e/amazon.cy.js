describe("Amazon test", () => {
  it("Opens the Amazon homepage", () => {
    cy.visit("https://www.amazon.com");
    cy.title().should("include", "Amazon");
  });
});
