import React from "react";
import {fireEvent, render} from "@testing-library/react";
import DiscardChangesModal from "./discard-changes-modal";

describe("<DiscardChangesModal/>", () => {

  test("Verify Discard changes modal appears with current query name", () => {
    const {getByText, getByTestId} = render(<DiscardChangesModal
      setDiscardChangesModalVisibility = {jest.fn()}
      savedQueryList={[]}
      toggleApply={jest.fn()}
      toggleApplyClicked={jest.fn()}
    />);
    expect(getByTestId("discard-changes-message").textContent).toEqual("Are you sure you want to discard all changes made to select a query?");
    expect(getByText("Yes")).toBeVisible();
    expect(getByText("No")).toBeVisible();
  });

  test("Verify on ok discards changes to current query",  () => {
    const {getByText} = render(<DiscardChangesModal
      setDiscardChangesModalVisibility={jest.fn()}
      savedQueryList={[]}
      toggleApply={jest.fn()}
      toggleApplyClicked={jest.fn()}
    />);

    const okButton = getByText("Yes");
    okButton.onclick = jest.fn();
    fireEvent.click(okButton);
    expect(okButton.onclick).toHaveBeenCalledTimes(1);
  });

  test("Verify clicking no closes the modal", () => {
    const {getByText} = render(<DiscardChangesModal
      setDiscardChangesModalVisibility = {jest.fn()}
      savedQueryList={[]}
      toggleApply={jest.fn()}
      toggleApplyClicked={jest.fn()}
    />);
    const cancelButton = getByText("No");
    cancelButton.onclick = jest.fn();
    fireEvent.click(cancelButton);
    expect(cancelButton.onclick).toHaveBeenCalledTimes(1);
  });

});
