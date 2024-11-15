import IssueModal from '../pages/IssueModal';
const issueTitle = 'This is an issue of type: Task.';

const session = (name) => {
  cy.session(name, () => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`);
  });
  cy.visit('/project/board');
  cy.contains(issueTitle).click();
};

describe('Time Estimation functionality', () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
    session('Time estimation');
    IssueModal.removeTimeEstimated();
    IssueModal.openTimeTrackingModal();
    IssueModal.removeTimeLogged();
    IssueModal.removeTimeRemaining();
    IssueModal.closeTimeTrackingModal();
  });

  beforeEach(() => {
    session('Time estimation');
  });
  const estimatedHours = 10;
  const editedEstimatedHours = 20;

  it('Should add time estimation successfully and verify changes', () => {
    IssueModal.verifyNoTimeEstimated();
    IssueModal.verifyNoTimeLRemainingInIssueDetailModal();
    IssueModal.verifyNoTimeLoggedInIssueDetailModal();
    IssueModal.addEstimatedHours(estimatedHours);
    IssueModal.verifyEstimatedHoursInIssueDetailModal(estimatedHours);
    IssueModal.closeDetailModal();
    cy.contains(issueTitle).click();
    IssueModal.verifyEstimatedHoursInIssueDetailModal(estimatedHours);
  });

  it('Should edit estimated time successfully and verify changes', () => {
    IssueModal.editEstimatedHours(editedEstimatedHours);
    IssueModal.verifyEstimatedHoursInIssueDetailModal(editedEstimatedHours);
    IssueModal.closeDetailModal();
    cy.contains(issueTitle).click();
    IssueModal.verifyEstimatedHoursInIssueDetailModal(editedEstimatedHours);
  });
  it('Should remove estimated time successfully and verify changes', () => {
    IssueModal.removeTimeEstimated();
    IssueModal.verifyNoTimeEstimated();
    IssueModal.closeDetailModal();
    cy.contains(issueTitle).click();
    IssueModal.verifyNoTimeEstimated();
  });
});

describe('Time logging functionality', () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
  });
  beforeEach(() => {
    session('Time logging');
  });
  const timeLogged = 2;
  const timeRemaining = 5;

  it('Should log time and update time remaining successfully', () => {
    IssueModal.openTimeTrackingModal();
    IssueModal.addTimeLogged(timeLogged);
    IssueModal.verifyTimeLoggedInTimeTrackingModal(timeLogged);
    IssueModal.addTimeRemaining(timeRemaining);
    IssueModal.verifyTimeRemainingInTimeTrackingModal(timeRemaining);
    IssueModal.closeTimeTrackingModal();
    IssueModal.verifyTimeLoggedInIssueDetailModal(timeLogged);
    IssueModal.verifyTimeRemainingInIssueDetailModal(timeRemaining);
  });

  it('Should remove logged time successfully', () => {
    const estimatedTimeOnIssue = 8;
    IssueModal.openTimeTrackingModal();
    IssueModal.removeTimeLogged();
    IssueModal.verifyNoTimeLoggedInTimeTrackingModal();
    IssueModal.removeTimeRemaining();
    IssueModal.verifyNoTimeLRemainingInTimeTrackingModal();
    IssueModal.verifyEstimatedHoursInTimeTrackingModal(estimatedTimeOnIssue);
    IssueModal.closeTimeTrackingModal();
    IssueModal.verifyNoTimeLoggedInIssueDetailModal();
    IssueModal.verifyNoTimeLRemainingInIssueDetailModal();
    IssueModal.verifyEstimatedHoursInIssueDetailModal(estimatedTimeOnIssue);
  });
});
