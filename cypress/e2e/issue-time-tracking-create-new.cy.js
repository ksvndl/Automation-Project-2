import IssueModal from '../pages/IssueModal';

const issueDetails = {
  title: 'TEST_TITLE',
  type: 'Bug',
  description: 'TEST_DESCRIPTION',
  assignee: 'Lord Gaben',
};

describe('Time Tracking and Estimation', () => {
  before(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
        IssueModal.createIssue(issueDetails);
        cy.contains(issueDetails.title).click();
      });
  });
  //   after(() => {
  //     IssueModal.clickDeleteButton();
  //     IssueModal.confirmDeletion();
  //   });
  describe('Time Estimation functionality', () => {
    const estimatedHours = '10';
    const editedEstimatedHours = '20';
    it("Should add time estimation successfully and verify it's consistency", () => {
      IssueModal.verifyNoTimeLogged();
      IssueModal.addEstimatedHours(estimatedHours);
      IssueModal.verifyEstimatedHours(estimatedHours);
      IssueModal.closeDetailModal();
      cy.contains(issueDetails.title).click();
      IssueModal.verifyEstimatedHours(estimatedHours);
    });

    it('Should edit estimated time and verify changes', () => {
      IssueModal.editedEstimatedHours(editedEstimatedHours);
    });
  });
});
