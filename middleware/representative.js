export default function ({ $auth, redirect }) {
  if (!$auth.loggedIn||$auth.user.permission_id < 2) {
    return redirect("/login");
  }
}