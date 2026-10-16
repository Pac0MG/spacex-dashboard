// Keep the keys in sync with pt.js. vue-i18n treats { } @ | as syntax, so a
// literal one is written as {'@'}.
export default {
  nav: {
    launches: "Launches",
    rockets: "Rockets",
    viewProfile: "{username} — view profile",
    logout: "Log out",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    language: "Language",
  },

  status: {
    success: "Success",
    failure: "Failure",
    upcoming: "Upcoming",
    active: "Active",
    inactive: "Inactive",
    retired: "Retired",
  },

  common: {
    noImage: "No image",
    missionPatch: "Mission patch for {name}",
    backToTop: "Back to top",
    dismiss: "Dismiss notification",
  },

  favorites: {
    add: "Add to favorites",
    remove: "Remove from favorites",
    favorited: "★ Favorited",
    addButton: "☆ Add to favorites",
  },

  empty: {
    title: "No results found",
    message: "There are no results to present.",
  },

  errors: {
    title: "Oops, something went wrong!",
    retry: "Try again",
    loadLaunches: "Couldn't load the launches. Please try again later.",
    loadRockets: "Couldn't load the rockets. Please try again later.",
    api: "API error: {message}",
    apiGeneric: "Something went wrong while talking to the API.",
    generic: "Something went wrong.",
    authUnreachable:
      "Can't reach the auth server. Make sure it's running (npm run server).",
  },

  launches: {
    title: "Launches",
    subtitle: "Explore launches from SpaceX.",
    searchName: "Name",
    searchYear: "Year",
    searchByName: "Search by name...",
    searchByYear: "Search by year...",
    emptyTitle: "There are no results to present",
    tryName: "Try a new name",
    tryYear: "Try a new year",
    previous: "Previous",
    next: "Next",
    page: "Page {current} of {total}",
    viewDetails: "View details",
  },

  filter: {
    title: "Filter Launches",
    favoritesOnly: "Favorites only ★",
    year: "Year",
    allYears: "All Years",
  },

  launchDetail: {
    back: "← Back to Launches",
    notFoundTitle: "Launch not found",
    notFoundMessage: "This launch could not be found.",
    description: "Description",
    noDescription: "No description available.",
    rocket: "Rocket",
    state: "State",
    rocketUnavailable: "Rocket information not available.",
    links: "Links",
    webcast: "Webcast",
    article: "Article",
    wikipedia: "Wikipedia",
  },

  nextLaunch: {
    eyebrow: "Next Launch",
    viewDetails: "View mission details",
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
    liftoff: "🚀 Liftoff!",
  },

  rockets: {
    title: "Rockets",
    subtitle: "Explore rockets from SpaceX.",
    emptyTitle: "No rockets found",
    emptyMessage: "There are no rockets to present.",
    photoOf: "Photo of {name}",
    firstFlight: "First flight",
    height: "Height",
    diameter: "Diameter",
    mass: "Mass",
    country: "Country",
    successRate: "Success rate",
    costPerLaunch: "Cost per launch",
  },

  search: {
    open: "Open search ({shortcut})",
    label: "Search",
    dialog: "Global search",
    placeholder: "Search missions or rockets...",
    missions: "Missions",
    rockets: "Rockets",
    rocket: "Rocket",
    noResults: "No results for \"{query}\"",
    hint: "Type to search missions and rockets. Use ↑ ↓ to navigate, Enter to open, Esc to close.",
  },

  notFound: {
    title: "Lost in space",
    text: "This page doesn't exist, or it was launched into an orbit we can't reach.",
    back: "Back to Launches",
  },

  auth: {
    fields: {
      name: "Name",
      username: "Username",
      email: "Email",
      password: "Password",
    },
    passwordHint:
      "At least 9 characters, 1 uppercase letter and 1 special character.",
    rulesNotMet: "The password doesn't meet all the requirements.",
    mismatch: "The passwords don't match.",

    login: {
      title: "Log in",
      subtitle: "Use your email or username and password to continue.",
      resetDone: "Password changed. Log in with your new password.",
      identifier: "Email or username",
      forgot: "Forgot your password?",
      submit: "Log in",
      submitting: "Logging in...",
      noAccount: "Don't have an account?",
      signupLink: "Sign up",
      missing: "Enter your email or username and your password.",
    },

    signup: {
      title: "Sign up",
      subtitle: "Create an account to explore SpaceX launches.",
      confirm: "Confirm password",
      submit: "Sign up",
      submitting: "Creating account...",
      haveAccount: "Already have an account?",
      loginLink: "Log in",
    },

    forgot: {
      title: "Forgot password",
      subtitle:
        "Enter your account email and we'll send you a link to choose a new password.",
      sent: "If an account exists for {email}, a reset link is on its way. It's valid for 1 hour.",
      submit: "Send reset link",
      submitting: "Sending...",
      back: "Back to log in",
      missing: "Enter your email address.",
    },

    reset: {
      title: "New password",
      subtitle: "Choose a new password for your account.",
      incomplete: "This reset link is incomplete. Request a new one.",
      password: "New password",
      confirm: "Confirm new password",
      submit: "Change password",
      submitting: "Saving...",
      newLink: "Request a new link",
    },
  },

  password: {
    show: "Show password",
    hide: "Hide password",
    requirements: "Password requirements",
    met: "(met)",
    notMet: "(not met)",
    rules: {
      length: "At least 9 characters",
      uppercase: "At least 1 uppercase letter",
      special: "At least 1 special character (e.g. ! {'@'} # $ %)",
    },
  },

  avatar: {
    choose: "Choose a profile photo",
    preview: "Profile photo preview",
    change: "Change",
    add: "Add photo",
    remove: "Remove photo",
    optional: "Optional",
    tooLarge: "Choose an image file smaller than 10 MB.",
    unreadable: "That image couldn't be read. Try a different one.",
  },

  profile: {
    photoHint: "Click to add a photo",
    deleteAccount: "Delete account",
    deleteWarning:
      "This permanently deletes your account. It can't be undone. Enter your password to confirm.",
    cancel: "Cancel",
    deleteConfirm: "Delete my account",
    deleting: "Deleting...",
    deleteMissing: "Enter your password to confirm.",
    deleted: "Your account has been deleted.",
    favoritesTitle: "Favorite launches",
    noFavoritesTitle: "No favorite launches yet",
    noFavoritesMessage: "Tap the star on a launch to save it here.",
  },
};
