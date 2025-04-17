
 .mainWrapper {
  display: flex;

  height: calc(100vh - 65px);
  width: 100%;
  overflow: hidden; 
}

.chatColumn {

  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; 
padding:20px;
}
.chatThreadWrapper { 
  flex: 1 1 auto;   /* Takes up all available vertical space */
  overflow-y: auto; /* THIS element handles the scrolling of the thread */
  min-height: 0;    /* Crucial flexbox fix for shrinking */

  /* --- Hide Scrollbar (Keep your original styles) --- */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.chatThreadWrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
/* --- End Hide Scrollbar --- */


.chatInput {
  flex-shrink: 0; /* Prevent input area from shrinking vertically */
  background: var(--background);
  
  z-index: 1;
  position: relative; /* Keep for the ::before pseudo-element */
}

/* Gradient Styling (Keep your original styles, maybe use rgba) */
.chatInput:before {
  content: "";
  position: absolute;
  left: 0;
  top: -80px; /* Adjust position/height as needed */
  width: 100%;
  height: 80px;
  pointer-events: none;
  /* Example using rgba and your var(--background) */
  background: linear-gradient(to bottom,
     rgba(15, 15, 15, 0) 0%, /* Assuming #0f0f0f is rgb(15,15,15) */
     rgba(15, 15, 15, 0.7) 50%, /* Adjust opacity */
     var(--background) 100%
  );
  /* Original: background: linear-gradient(to bottom, #0f0f0f00 0%, #0f0f0f80 50%, var(--background) 100%); */
}


/* Sidebar Styles (Keep original, ensure height/overflow is okay) */
.sidebarColumn {
  width: 440px;
  flex-shrink: 0;
  overflow-y: auto;
}

.chatThreadWrapper {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0; /* VERY important in flexbox */
}


/*

MEDIA QUERIES

*/

/* Small (Mobile) */
@media (max-width: 480px) {
 
 
}

.scrollDownButton {
  position: fixed;
  bottom: 150px;
  width: 40px;
  z-index: 100;
  left: 50%; /* Position the left edge at 50% of the viewport */
  transform: translateX(-50%); /* Move it left by half its own width */
  cursor: pointer;
}

/* Small (Mobile) */
@media (max-width: 480px) {
  .scrollDownButton {
    bottom: 120px;
  }

}






