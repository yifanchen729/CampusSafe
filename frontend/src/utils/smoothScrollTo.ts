  export function smoothScrollTo(id: string) {
    // Find the element
    const element = document.getElementById(id);

    if (!element) return;

    // Get current scroll position
    const start = window.scrollY;

    // Change the destination a little for the navbar
    const offset = 60;

    // This calculate the distance need to scroll by
    // the element distance from top of currentScroll - offset
    const distance = element.getBoundingClientRect().top - offset;

    // Animation duration in milliseconds
    const duration = 700;

    // Sets the timer, start with null
    let startTime: number | null = null;

    // Function that reptitively run
    function animation(currentTime: number) {
      // Read in start time
      if (startTime === null) {
        startTime = currentTime;
      }

      // Calculate how long had been passed
      const elapsed = currentTime - startTime;
      // This tracks the progress
      const progress = Math.min(elapsed / duration, 1);

      // Calculate movement based on time
      // We want it to be slow => fast => slow
      // Using the pattern of easeInOutQuad
      const ease =
        progress < 0.5
          // This line is for make smaller value lead to smaller increases
          // *2 is for cases like 0.5*0.5 = 0.25 but we want 0.5
          ? 2 * progress * progress
          // -2 * progress + 2 is make it range from 1 - 0 when progess range from 0.5 - 1
          // Then we square it like the above and half it
          // Then subtract it using 1
          // Although I still don't understand this
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // The actual movement
      window.scrollTo(0, start + distance * ease);

      // Tells it to run same function for the next frame
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    // Start the first frame
    requestAnimationFrame(animation);
  }