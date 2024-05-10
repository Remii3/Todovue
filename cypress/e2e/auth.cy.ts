// https://on.cypress.io/api

describe("Test auth proccess", () => {
  it("Shows form errors on register", () => {
    cy.visit("/signUp");
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="error-email').should("exist");
    cy.get('[data-cy="error-password').should("exist");
  });
  it("Register user", () => {
    cy.visit("/signUp");
    cy.get('[data-cy="email"]').type("test@gmail.com");
    cy.get('[data-cy="password"]').type("123456");
    cy.get('[data-cy="submit"]').click();
    cy.url({ timeout: 10000 }).should("match", /\/$/);
  });

  it("Logout user", () => {
    cy.visit("/");
    cy.get('[data-cy="user-link"]').click();
    cy.get('[data-cy="logout"]').click();
    cy.url({ timeout: 10000 }).should("match", /\/signIn$/);
  });
  it("Login user", () => {
    cy.visit("/signIn");
    cy.get('[data-cy="email"]').type("test@gmail.com");
    cy.get('[data-cy="password"]').type("123456");
    cy.get('[data-cy="submit"]').click();
    cy.url({ timeout: 10000 }).should("match", /\/$/);
  });
  it("Delete user", () => {
    cy.visit("/");
    cy.get('[data-cy="user-link"]').click();
    cy.get('[data-cy="delete-account"]').click();
    cy.url({ timeout: 10000 }).should("match", /\/signUp$/);
  });
});
