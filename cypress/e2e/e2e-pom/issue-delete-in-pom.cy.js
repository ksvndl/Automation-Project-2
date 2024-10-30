import IssueModal from '../../pages/IssueModal';

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.contains(issueTitle).click();
      });
    IssueModal.getIssueDetailModal()
      .should('be.visible')
      .and('contain', issueTitle);
  });

  const issueTitle = 'This is an issue of type: Task.';
  let isVisible = '';

  it('Should delete issue successfully', () => {
    IssueModal.getIssueDetailModal().within(() => {
      IssueModal.clickDeleteButton();
    });
    IssueModal.confirmDeletion();
    IssueModal.validateIssueVisibilityState(issueTitle, (isVisible = false));
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.getIssueDetailModal().within(() => {
      IssueModal.clickDeleteButton();
    });
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle, (isVisible = true));
  });
});
