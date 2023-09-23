let currentPopUp = null
const createPopUp = (caller,popoutFunction) =>{
  console.log("Generating popup")
  newPopUp = generateElement("div",document.body,{"class":"popup-container"})
  newButton = generateElement("button",newPopUp,{"class":"popup-btn"})
  newButton.onclick = popoutFunction
  currentPopUp = newPopUp
  return newPopUp
} 


const overlayIn = () =>{
  overlay = document.getElementById("overlay")
  overlay.style.width = "100%";
  overlay.style.height = "100%";
}

const overlayOut = () =>{
  overlay = document.getElementById("overlay")
  overlay.style.width = "0";
  overlay.style.height = "0";
  currentPopUp.remove();
}