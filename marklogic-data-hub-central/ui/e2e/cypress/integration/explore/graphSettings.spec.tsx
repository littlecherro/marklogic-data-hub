import {Application} from "../../support/application.config";
import {toolbar} from "../../support/components/common";
import specificSidebar from "../../support/components/explore/specific-sidebar";
import entityTypeDisplaySettingsModal from "../../support/components/explore/entity-type-display-settings-modal";
import browsePage from "../../support/pages/browse";
import LoginPage from "../../support/pages/login";
import {BaseEntityTypes} from "../../support/types/base-entity-types";
import entitiesSidebar from "../../support/pages/entitiesSidebar";

const defaultEntityTypeData = {
  name: BaseEntityTypes.CUSTOMER,
  icon: "FaShapes",
  color: {
    HEX: "#EEEFF1",
  }
};
// We must have the same color in rgb and hex because the browser to apply the background changes it to rgb even if the value is passed in hex
// "#FFF0A3" == "rgb(255, 240, 163)"
const newEntityTypeData = {
  icon: "FaAndroid",
  color: {
    HEX: "#FFF0A3",
    RGB: "rgb(255, 240, 163)",
  }
};

// We must have the same color in rgb and hex because the browser to apply the background changes it to rgb even if the value is passed in hex
// "#FFD0AE" == "rgb(255, 208, 174)"
const newEntityTypeData2 = {
  icon: "FaAngular",
  color: {
    HEX: "#FFD0AE",
    RGB: "rgb(255, 208, 174)",
  }
};

describe("Entity Type Settings Modal", () => {
  before(() => {
    cy.visit("/");
    cy.contains(Application.title);

    cy.log("**Logging into the app as a developer**");
    cy.loginAsDeveloper().withRequest();
    LoginPage.postLogin();

    //Setup hubCentral config for testing
    cy.setupHubCentralConfig();

    //Saving Local Storage to preserve session
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    //Restoring Local Storage to Preserve Session
    Cypress.Cookies.preserveOnce("HubCentralSession");
    cy.restoreLocalStorage();
  });

  it("Open settings modal, check default values, select new ones cancel and check that the defaults values are keep", () => {
    cy.log("**Go to Explore section**");
    toolbar.getExploreToolbarIcon().click();

    cy.log("**Select Graph view and open explore settings modal**");
    browsePage.clickGraphView();
    browsePage.waitForSpinnerToDisappear();
    browsePage.clickExploreSettingsMenuIcon();
    browsePage.getEntityTypeDisplaySettingsButton().scrollIntoView().click({force: true});
    entityTypeDisplaySettingsModal.getModalBody().should("be.visible");

    cy.log("**Verify default color it's selected, select new one and check the selection**");
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color").then(color => {
      expect(Cypress._.toLower(color)).equal(Cypress._.toLower(defaultEntityTypeData.color.HEX));
    });
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).click();
    entityTypeDisplaySettingsModal.getColorInPicket(newEntityTypeData.color.HEX).click();
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color", Cypress._.toLower(newEntityTypeData.color.HEX));

    cy.log("**Verify default icon it's selected, select new one and check the selection**");
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", defaultEntityTypeData.icon);
    entityTypeDisplaySettingsModal.getEntityTypeIconButton(defaultEntityTypeData.name).click();
    entityTypeDisplaySettingsModal.getEntityTypeIconSearchInput(defaultEntityTypeData.name).type(newEntityTypeData.icon);
    entityTypeDisplaySettingsModal.getEntityTypeIconMenu(defaultEntityTypeData.name).find("svg").last().click();
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", newEntityTypeData.icon);

    cy.log("**Cancel the edition and verify that the modal close**");
    entityTypeDisplaySettingsModal.getModalCancelButton().click();
    entityTypeDisplaySettingsModal.getModalBody().should("not.exist");

    cy.log("**Reopen the settings modal and check that not was saved the data and are present the default values**");
    browsePage.getEntityTypeDisplaySettingsButton().scrollIntoView().click({force: true});
    entityTypeDisplaySettingsModal.getModalBody().should("be.visible");
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color").then(color => {
      expect(Cypress._.toLower(color)).equal(Cypress._.toLower(defaultEntityTypeData.color.HEX));
    });
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", defaultEntityTypeData.icon);

    cy.log("**Close the modal**");
    entityTypeDisplaySettingsModal.getModalCloseButton().click();
    entityTypeDisplaySettingsModal.getModalBody().should("not.exist");
  });

  it("Open settings modal, select new values and save the changes", () => {
    cy.visit("/");
    cy.log("**Go to Explore section**");
    toolbar.getExploreToolbarIcon().click();

    cy.log("**Select Graph view and open explore settings modal**");
    browsePage.clickGraphView();
    browsePage.waitForSpinnerToDisappear();
    cy.wait(2000);
    browsePage.clickExploreSettingsMenuIcon();
    browsePage.getEntityTypeDisplaySettingsButton().scrollIntoView().click({force: true});
    entityTypeDisplaySettingsModal.getModalBody().should("be.visible");

    cy.log("**Select new color and check the selection**");
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).click();
    entityTypeDisplaySettingsModal.getColorInPicket(newEntityTypeData.color.HEX).click();
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color", Cypress._.toLower(newEntityTypeData.color.HEX));

    cy.log("**Select new icon and check the selection**");
    entityTypeDisplaySettingsModal.getEntityTypeIconButton(defaultEntityTypeData.name).click();
    entityTypeDisplaySettingsModal.getEntityTypeIconSearchInput(defaultEntityTypeData.name).type(newEntityTypeData.icon);
    entityTypeDisplaySettingsModal.getEntityTypeIconMenu(defaultEntityTypeData.name).find("svg").last().click();
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", newEntityTypeData.icon);

    cy.log("**Save the changes**");
    entityTypeDisplaySettingsModal.getModalSaveButton().click();
    entityTypeDisplaySettingsModal.getModalBody().should("not.exist");

    cy.log("**Reopen the settings modal and check the new values**");
    browsePage.getEntityTypeDisplaySettingsButton().scrollIntoView().click({force: true});
    entityTypeDisplaySettingsModal.getModalBody().should("be.visible");
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color", Cypress._.toLower(newEntityTypeData.color.HEX));
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", newEntityTypeData.icon);

    cy.log("**Close the modal**");
    entityTypeDisplaySettingsModal.getModalCloseButton().click();
    entityTypeDisplaySettingsModal.getModalBody().should("not.exist");

    cy.log("**Check in the sidebar that the entity type have the new color and icon**");
    entitiesSidebar.getBaseEntity(defaultEntityTypeData.name).should("be.visible").and("have.attr", "data-color").then(color => {
      expect(Cypress._.toLower(color)).equal(Cypress._.toLower(newEntityTypeData.color.HEX));
    });
    entitiesSidebar.getBaseEntity(defaultEntityTypeData.name).should("have.css", "background-color", newEntityTypeData.color.RGB);
    entitiesSidebar.getBaseEntity(defaultEntityTypeData.name).should("have.attr", "data-icon").then(icon => {
      expect(Cypress._.toLower(icon)).equal(Cypress._.toLower(newEntityTypeData.icon));
    });
  });

  it("Verify settings modal with a selected entity type in the sidebar", () => {
    cy.visit("/");
    cy.log("**Go to Explore section**");
    toolbar.getExploreToolbarIcon().click();

    cy.log("**Select Graph view**");
    browsePage.clickGraphView();
    browsePage.waitForSpinnerToDisappear();
    cy.wait(2000);

    cy.log("**Go to specific entity panel and check icon, title and background color**");
    entitiesSidebar.openBaseEntityFacets(defaultEntityTypeData.name);
    specificSidebar.getLeftBarEntityIcon(defaultEntityTypeData.name).should("have.css", "background-color", newEntityTypeData.color.RGB);
    specificSidebar.getLeftBarEntityIcon(defaultEntityTypeData.name).should("have.attr", "data-icon").then(icon => {
      expect(Cypress._.toLower(icon)).equal(Cypress._.toLower(newEntityTypeData.icon));
    });
    specificSidebar.getEntitySiderComponent(defaultEntityTypeData.name).should("have.css", "background-color", newEntityTypeData.color.RGB);
    specificSidebar.getEntitySpecifIcon(defaultEntityTypeData.name).should("have.attr", "data-icon").then(icon => {
      expect(Cypress._.toLower(icon)).equal(Cypress._.toLower(newEntityTypeData.icon));
    });
    specificSidebar.getEntitySpecifTitle(defaultEntityTypeData.name).should("contain", defaultEntityTypeData.name);

    cy.log("**Open explore settings modal**");
    browsePage.clickExploreSettingsMenuIcon();
    browsePage.getEntityTypeDisplaySettingsButton().scrollIntoView().click({force: true});
    entityTypeDisplaySettingsModal.getModalBody().should("be.visible");

    cy.log("**Select new color and check the selection**");
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).click();
    entityTypeDisplaySettingsModal.getColorInPicket(newEntityTypeData2.color.HEX).click();
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color", Cypress._.toLower(newEntityTypeData2.color.HEX));

    cy.log("**Select new icon and check the selection**");
    entityTypeDisplaySettingsModal.getEntityTypeIconButton(defaultEntityTypeData.name).click();
    entityTypeDisplaySettingsModal.getEntityTypeIconSearchInput(defaultEntityTypeData.name).type(newEntityTypeData2.icon);
    entityTypeDisplaySettingsModal.getEntityTypeIconMenu(defaultEntityTypeData.name).find("svg").last().click();
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", newEntityTypeData2.icon);

    cy.log("**Save the changes**");
    entityTypeDisplaySettingsModal.getModalSaveButton().click();
    entityTypeDisplaySettingsModal.getModalBody().should("not.exist");

    cy.log("**Reopen the settings modal and check the new values**");
    browsePage.getEntityTypeDisplaySettingsButton().scrollIntoView().click({force: true});
    entityTypeDisplaySettingsModal.getModalBody().should("be.visible");
    entityTypeDisplaySettingsModal.getEntityTypeColorButton(defaultEntityTypeData.name).should("have.attr", "data-color", Cypress._.toLower(newEntityTypeData2.color.HEX));
    entityTypeDisplaySettingsModal.getEntityTypeIconButtonWrapper(defaultEntityTypeData.name).should("have.attr", "data-icon", newEntityTypeData2.icon);

    cy.log("**Close the modal**");
    entityTypeDisplaySettingsModal.getModalCloseButton().click();
    entityTypeDisplaySettingsModal.getModalBody().should("not.exist");

    cy.log("**Check the changes in the specific sidebar**");
    specificSidebar.getLeftBarEntityIcon(defaultEntityTypeData.name).should("have.css", "background-color", newEntityTypeData2.color.RGB);
    specificSidebar.getLeftBarEntityIcon(defaultEntityTypeData.name).should("have.attr", "data-icon").then(icon => {
      expect(Cypress._.toLower(icon)).equal(Cypress._.toLower(newEntityTypeData2.icon));
    });
    specificSidebar.getEntitySiderComponent(defaultEntityTypeData.name).should("have.css", "background-color", newEntityTypeData2.color.RGB);
    specificSidebar.getEntitySpecifIcon(defaultEntityTypeData.name).should("have.attr", "data-icon").then(icon => {
      expect(Cypress._.toLower(icon)).equal(Cypress._.toLower(newEntityTypeData2.icon));
    });
    specificSidebar.getEntitySpecifTitle(defaultEntityTypeData.name).should("contain", defaultEntityTypeData.name);

    cy.log("**Go back in the sidebar**");
    entitiesSidebar.backToMainSidebar();

    cy.log("**Check in the sidebar that the entity type have the new color and icon**");
    entitiesSidebar.getBaseEntity(defaultEntityTypeData.name).should("be.visible").and("have.attr", "data-color").then(color => {
      expect(Cypress._.toLower(color)).equal(Cypress._.toLower(newEntityTypeData2.color.HEX));
    });
    entitiesSidebar.getBaseEntity(defaultEntityTypeData.name).and("have.css", "background-color", newEntityTypeData2.color.RGB);
    entitiesSidebar.getBaseEntity(defaultEntityTypeData.name).and("have.attr", "data-icon").then(icon => {
      expect(Cypress._.toLower(icon)).equal(Cypress._.toLower(newEntityTypeData2.icon));
    });
  });
});