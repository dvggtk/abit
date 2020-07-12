const debug = require(`debug`)(`draggable`);

let saveMouseDownHandler = null;

// Swap two nodes
function swap(nodeA, nodeB) {
  const nextSiblingA = nodeA.nextSibling;
  const nextSiblingB = nodeB.nextSibling;

  if (nextSiblingA === nodeB) {
    nodeA.before(nodeB);
    return;
  }

  if (nextSiblingB === nodeA) {
    nodeB.before(nodeA);
    return;
  }

  if (nextSiblingB === null) {
    if (nextSiblingA === null) throw new Error("Halt");

    nodeB.before(nodeA);
    nextSiblingA.before(nodeB);
    return;
  }

  nodeA.before(nodeB);
  nextSiblingB.before(nodeA);
}

// Check if `nodeA` is above `nodeB`
function isAbove(nodeA, nodeB) {
  // Get the bounding rectangle of nodes
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
}

// https://github.com/phuoc-ng/html-dom/blob/master/demo/drag-and-drop-element-in-a-list/index.html
function draggableEnable(listEle) {
  let draggingEle;
  let placeholder;
  let isDraggingStarted = false;

  // The current position of mouse relative to the dragging element
  let x = 0;
  let y = 0;

  const mouseDownHandler = (e) => {
    debug(`mouseDownHandler, e.target=%O`, e.target);

    const ele = e.target;
    if (ele.tagName !== `LI`) return;

    e.preventDefault(); // предотвратить запуск выделения (действие браузера)

    draggingEle = ele;
    debug(`mouseDownHandler, draggingEle=%O`, draggingEle);

    // Calculate the mouse position
    const rect = draggingEle.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e) => {
    const draggingRect = draggingEle.getBoundingClientRect();

    if (!isDraggingStarted) {
      isDraggingStarted = true;

      // Let the placeholder take the height of dragging element
      // So the next element won't move up
      placeholder = document.createElement("div");
      placeholder.classList.add("placeholder");
      draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
      placeholder.style.height = `${draggingRect.height}px`;
    }

    // Set position for dragging element
    draggingEle.style.position = "fixed";
    draggingEle.style.top = `${e.pageY - y}px`;
    draggingEle.style.left = `${e.pageX - x}px`;
    draggingEle.style.zIndex = `999`;

    // The current order
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;

    // The dragging element is above the previous element
    // User moves the dragging element to the top
    if (prevEle && isAbove(draggingEle, prevEle)) {
      // The current order    -> The new order
      // prevEle              -> placeholder
      // draggingEle          -> draggingEle
      // placeholder          -> prevEle
      swap(placeholder, draggingEle);
      swap(placeholder, prevEle);
      return;
    }

    // The dragging element is below the next element
    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, draggingEle)) {
      // The current order    -> The new order
      // draggingEle          -> nextEle
      // placeholder          -> placeholder
      // nextEle              -> draggingEle
      swap(nextEle, placeholder);
      swap(nextEle, draggingEle);
    }
  };

  const mouseUpHandler = () => {
    // Remove the placeholder
    // eslint-disable-next-line no-unused-expressions
    placeholder && placeholder.remove();

    draggingEle.style.removeProperty("top");
    draggingEle.style.removeProperty("left");
    draggingEle.style.removeProperty("position");
    draggingEle.style.removeProperty("zIndex");

    x = null;
    y = null;
    draggingEle = null;
    placeholder = null;
    isDraggingStarted = false;

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  listEle.addEventListener(`mousedown`, mouseDownHandler);
  saveMouseDownHandler = mouseDownHandler;
}

function draggableDisable(listEle) {
  listEle.removeEventListener(`mousedown`, saveMouseDownHandler);
}

export {draggableEnable, draggableDisable};
