class IssueModal {
  constructor() {
    //create Issue modal
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = '.ql-editor';
    this.assignee = '[data-testid="select:userIds"]';
    //Issue Details modal
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = 'Delete issue';
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.cancelDeletionButtonName = 'Cancel';
    this.closeDetailModalButton = {
      locator: '[data-testid="icon:close"]',
      index: 0,
    };
    //Issue details comments section
    this.issueDetailComments = '[data-testid="issue-comment"]';
    this.issueCommentArea = 'textarea[placeholder="Add a comment..."]';
    this.saveCommentButtonName = 'Save';
    this.editCommentButtonName = 'Edit';
    this.deleteCommentButtonName = 'Delete';
    this.cancelCommentEditButtonName = 'Cancel';
    this.initialNumberOfComments;
    //Main page
    this.issuesList = '[data-testid="list-issue"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
  }

  addCommentToIssue(comment) {
    this.getIssueDetailModal().within(() => {
      cy.contains('Add a comment...').click();
      cy.get(this.issueCommentArea).type(comment).should('contain', comment);
      this.saveComment();
      cy.log('Comment added');
    });
  }

  editIssueComment(initialComment, editedComment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueDetailComments)
        .contains(initialComment)
        .siblings()
        .contains(this.editCommentButtonName)
        .click()
        .should('not.exist');
      cy.get(this.issueCommentArea).clear().type(editedComment);
      this.saveComment();
    });
  }

  deleteIssueComment(comment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueDetailComments)
        .contains(comment)
        .siblings()
        .contains(this.deleteCommentButtonName)
        .click();
    });
    this.confirmCommentDeletion();
  }

  verifyCommentVisibilityState(comment, isVisible = true) {
    if (isVisible) {
      cy.contains('Add a comment...').should('exist').and('be.visible');
      cy.get(this.issueDetailComments).should('contain', comment);
    }

    if (!isVisible) {
      cy.contains('Add a comment...').should('exist').and('be.visible');
      cy.get(this.issueDetailComments).should('not.contain', comment);
    }
  }
  saveComment() {
    return cy
      .contains('button', this.saveCommentButtonName)
      .click()
      .wait(1000)
      .should('not.exist');
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click('bottomRight');
    cy.get(`[data-testid="select-option:${issueType}"]`).click();
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click('bottomRight');
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced('type', title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should('not.exist');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get(this.backlogList)
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get(this.issuesList)
          .should('have.length', expectedAmountIssues)
          .first()
          .find('p')
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          'be.visible'
        );
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('be.visible');
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('not.exist');
  }

  validateIssueVisibilityState(issueTitle, isVisible = true) {
    cy.reload();
    cy.get(this.backlogList).should('be.visible');
    if (isVisible) cy.contains(issueTitle).should('be.visible');
    if (!isVisible) cy.contains(issueTitle).should('not.exist');
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).should('be.visible').click();
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup)
      .should('be.visible')
      .within(() => {
        cy.contains(this.deleteButtonName).should('be.visible').click();
      });
    cy.get(this.confirmationPopup).should('not.exist');
    cy.get(this.backlogList).should('be.visible');
  }

  confirmCommentDeletion() {
    cy.get(this.confirmationPopup)
      .should('be.visible')
      .within(() => {
        cy.contains(this.deleteCommentButtonName).should('be.visible').click();
      });
    cy.get(this.confirmationPopup).should('not.exist');
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup)
      .should('be.visible')
      .within(() => {
        cy.contains(this.cancelDeletionButtonName).should('be.visible').click();
      });
    cy.get(this.confirmationPopup).should('not.exist');
    this.getIssueDetailModal().should('be.visible');
  }

  closeDetailModal() {
    this.getIssueDetailModal().within(() => {
      cy.get(this.closeDetailModalButton.locator)
        .eq(this.closeDetailModalButton.index)
        .should('be.visible')
        .click();
    });
    cy.get(this.issueDetailModal).should('not.exist');
    cy.get(this.backlogList).should('be.visible');
  }
}

export default new IssueModal();
