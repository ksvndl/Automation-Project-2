describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
      });
  });

  it('Should delete issue and confirm deletion', () => {
    cy.get('[data-testid="icon:trash"]').should('exist').click();
    cy.get('[data-testid="modal:confirm"]')
      .should('be.visible')
      .within(() => {
        cy.get('button').contains('Delete').should('be.visible').click();
      });
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');
    cy.reload();
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`);
    cy.contains('This is an issue of type: Task.').should('not.exist');
  });

  it('Should initiate deleta and then cancel', () => {
    cy.get('[data-testid="icon:trash"]').should('exist').click();
    cy.get('[data-testid="modal:confirm"]')
      .should('be.visible')
      .within(() => {
        cy.get('button').contains('Cancel').should('be.visible').click();
      });
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]')
      .should('exist')
      .within(() => {
        cy.get('[data-testid="icon:close"]').eq(0).should('be.visible').click();
      });
    cy.reload();
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`);
    cy.contains('This is an issue of type: Task.').should('exist');
  });
});
