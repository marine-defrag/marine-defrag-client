export const setFocusById = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.focus({ focusVisible: true });
    return true;
  }
  console.log(`Element with ID ${id}, does not exist`);
  return false;
};

export const setFocusByRef = (ref) => ref && ref.current && ref.current.focus({ focusVisible: true });

export const getLastTabbableElement = (parent) => {
  const tabableElementsSelector = 'button:not([disabled]), input:not([disabled]), a[href]:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), textarea:not([disabled]), select:not([disabled])';
  const tabableElements = [...parent.querySelectorAll(tabableElementsSelector)];
  return tabableElements.pop() || null;
};
