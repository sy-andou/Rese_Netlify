export default function ({ $auth, redirect }) {
  if (!$auth.loggedIn||$auth.user.permission_id < 3) {
    return redirect("/login");
  }
}