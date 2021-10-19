function saveLoggedUser(loggedUser: UserWithToken): void {
  window.localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
}

function removeLoggedUser(): void {
  window.localStorage.removeItem("loggedUser");
}

function loadLoggedUser(): UserWithToken | null {
  const loggedUserJson = window.localStorage.getItem("loggedUser");
  if (loggedUserJson) {
    return JSON.parse(loggedUserJson);
  }
  return null;
}

const storageUtils = {
  saveLoggedUser,
  removeLoggedUser,
  loadLoggedUser,
};

export default storageUtils;
