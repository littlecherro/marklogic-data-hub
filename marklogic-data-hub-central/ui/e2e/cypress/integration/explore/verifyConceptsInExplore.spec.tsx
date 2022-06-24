import {toolbar} from "../../support/components/common";
import browsePage from "../../support/pages/browse";
import graphExplore from "../../support/pages/graphExplore";
import LoginPage from "../../support/pages/login";
import {ExploreGraphNodes} from "../../support/types/explore-graph-nodes";
import entitiesSidebar from "../../support/pages/entitiesSidebar";
import graphExploreSidePanel from "../../support/components/explore/graph-explore-side-panel";
import graphView from "../../support/components/explore/graph-view";

describe("Concepts", () => {
  before(() => {
    cy.visit("/");
    cy.log("**Logging into the app as a developer**");
    cy.loginAsDeveloper().withRequest();
    LoginPage.postLogin();
    //Saving Local Storage to preserve session
    cy.saveLocalStorage();
    cy.log("**Navigate to Explore**");
    toolbar.getExploreToolbarIcon().click();
    browsePage.waitForSpinnerToDisappear();
  });
  beforeEach(() => {
    //Restoring Local Storage to Preserve Session
    cy.restoreLocalStorage();
  });

  it("Validate that the concepts toggle works correctly", () => {
    //Graph view
    cy.log("**Go to graph view**");
    browsePage.clickGraphView();
    graphExplore.getGraphVisCanvas().should("be.visible");
    graphExplore.stopStabilization();

    cy.log("**Select 'Product' entity**");
    entitiesSidebar.openBaseEntityDropdown();
    entitiesSidebar.selectBaseEntityOption("Product");
    entitiesSidebar.getBaseEntityOption("Product").should("be.visible");
    cy.wait(5000); // The canvas takes some more time animating

    cy.log("**Picking up a concept node**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_KETTLE);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_KETTLE).then((nodePositions: any) => {
      let kettleCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_KETTLE];
      const canvas = graphExplore.getGraphVisCanvas();
      canvas.trigger("mouseover", kettleCoordinates.x, kettleCoordinates.y, {force: true});
      canvas.click(kettleCoordinates.x, kettleCoordinates.y, {force: true});
    });

    cy.log("**Verify the side panel opened up for kettle concept node**");
    graphExploreSidePanel.getSidePanel().should("exist");
    graphExploreSidePanel.getSidePanelConceptHeading("Kettle").scrollIntoView().should("be.visible");
    graphExploreSidePanel.getSidePanelConceptHeadingInfo("Kettle").scrollIntoView().should("be.visible");
    graphExploreSidePanel.getTableCellValueByName("1").should("contain", "Product");

    cy.log("**Turn OFF concepts toggle**");
    graphView.getConceptToggle().scrollIntoView().trigger("mouseover").click();

    cy.wait(4000);

    cy.log("**Verify Kettle concept node is not visible in the canvas anymore**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_KETTLE);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_KETTLE).then((nodePositions: any) => {
      let kettleCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_KETTLE];
      //it should not exist because the leaf node was collapsed
      cy.log("**Kettle coordinates should not exist because it was collapsed**");
      expect(kettleCoordinates).to.be.undefined;
    });

    cy.log("**Turn ON concepts toggle**");
    graphView.getConceptToggle().scrollIntoView().trigger("mouseover").click();

    cy.wait(4000);

    cy.log("**Verify Kettle concept node is visible again**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_KETTLE);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_KETTLE).then((nodePositions: any) => {
      let kettleCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_KETTLE];
      const canvas = graphExplore.getGraphVisCanvas();

      //Click on node to open side panel
      canvas.trigger("mouseover", kettleCoordinates.x, kettleCoordinates.y, {force: true});
      canvas.click(kettleCoordinates.x, kettleCoordinates.y, {force: true});
      graphExploreSidePanel.getSidePanel().should("exist");
    });
  });

  it("Validate that the concepts facets are applied properly", () => {
    //Graph view
    cy.log("**Go to graph view**");
    browsePage.clickGraphView();
    graphExplore.getGraphVisCanvas().should("be.visible");
    graphExplore.stopStabilization();

    cy.log("**Select 'Product' entity**");
    entitiesSidebar.openBaseEntityDropdown();
    entitiesSidebar.selectBaseEntityOption("Product");
    entitiesSidebar.getBaseEntityOption("Product").should("be.visible");
    cy.wait(5000); // The canvas takes some more time animating

    entitiesSidebar.toggleRelatedConceptsPanel();
    browsePage.getFacetItemCheckbox("relatedconcepts", "Sneakers").click();
    browsePage.getSelectedFacets().should("exist");
    browsePage.getGreySelectedFacets("Sneakers").should("exist");
    browsePage.getFacetApplyButton().click();
    browsePage.waitForSpinnerToDisappear();
    cy.wait(3000);

    cy.log("**Verify Kettle concept node is not visible in the canvas anymore**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_KETTLE);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_KETTLE).then((nodePositions: any) => {
      let kettleCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_KETTLE];
      //it should not exist because the facet is applied only for Sneakers
      cy.log("**Kettle coordinates should not exist because it was collapsed**");
      expect(kettleCoordinates).to.be.undefined;
    });

    cy.log("**Verify Sneakers concept node should be visible**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_SNEAKERS);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_SNEAKERS).then((nodePositions: any) => {
      let sneakersCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_SNEAKERS];
      const canvas = graphExplore.getGraphVisCanvas();

      //Click on node to open side panel
      canvas.trigger("mouseover", sneakersCoordinates.x, sneakersCoordinates.y, {force: true});
      canvas.click(sneakersCoordinates.x, sneakersCoordinates.y, {force: true});
      graphExploreSidePanel.getSidePanel().should("exist");
    });

    cy.log("**Verify Kettle concept node should be visible when selected as facet**");
    browsePage.clickMoreLink("relatedconcepts");
    browsePage.getFacetItemCheckbox("relatedconcepts", "Kettle").click();
    browsePage.getSelectedFacets().should("exist");
    browsePage.getGreySelectedFacets("Kettle").should("exist");
    browsePage.getFacetApplyButton().click();
    browsePage.waitForSpinnerToDisappear();
    cy.wait(3000);

    cy.log("**Verify Kettle concept node is visible again**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_KETTLE);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_KETTLE).then((nodePositions: any) => {
      let kettleCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_KETTLE];
      const canvas = graphExplore.getGraphVisCanvas();

      //Click on node to open side panel
      canvas.trigger("mouseover", kettleCoordinates.x, kettleCoordinates.y, {force: true});
      canvas.click(kettleCoordinates.x, kettleCoordinates.y, {force: true});
      graphExploreSidePanel.getSidePanel().should("exist");
    });

    browsePage.getFacetItemCheckbox("relatedconcepts", "Sneakers").click();
    browsePage.getAppliedFacets("Sneakers").should("not.exist");
    browsePage.getFacetItemCheckbox("relatedconcepts", "Sneakers").should("not.be.checked");
    browsePage.waitForSpinnerToDisappear();
    cy.wait(3000);

    cy.log("**Verify Sneakers concept node is not visible in the canvas anymore**");
    graphExplore.focusNode(ExploreGraphNodes.CONCEPT_SNEAKERS);
    graphExplore.getPositionsOfNodes(ExploreGraphNodes.CONCEPT_SNEAKERS).then((nodePositions: any) => {
      let sneakersCoordinates: any = nodePositions[ExploreGraphNodes.CONCEPT_SNEAKERS];
      //it should not exist because the facet is applied only for Sneakers
      cy.log("**Sneakers coordinates should not exist because only Kettle is selected as facet**");
      expect(sneakersCoordinates).to.be.undefined;
    });
  });


});