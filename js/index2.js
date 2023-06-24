window.addEventListener("DOMContentLoaded", (event) => {
  const cont = document.getElementById("mycontainer");
  const lay1 = document.getElementById("mylayer1");
  const lay2 = document.getElementById("mylayer2");
  
  for (let i = 0; i < 10; i++) {
    cont.appendChild(lay1.cloneNode(true));
    cont.appendChild(lay2.cloneNode(true));
  }
});
