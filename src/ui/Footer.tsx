function Footer() {
  // Returned JSX
  return (
    <footer className="text-[1.2rem] py-8 sm:py-10 px-10 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-200 transition-colors duration-200">
      <div>
        Built by VSBroN as a portfolio project
        <br />
        This project is available on{" "}
        <a
          href="https://github.com/vsbron/workout-timer__react"
          target="_blank"
          className="underline hover:text-stone-950 dark:hover:text-stone-50"
        >
          GitHub
        </a>
        <br />
        &copy;{new Date().getFullYear()}. All rights reserved
      </div>
    </footer>
  );
}

export default Footer;
