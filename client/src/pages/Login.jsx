import { redirect, Form, useNavigation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/login", data);
    toast.success("Login successful");
    return redirect("/dashboard");
  } catch (error) {
    // console.log(error)
    const errorMessage =
      error?.response?.data?.msg ?? error?.response?.data?.error?.[0];
    toast.error(errorMessage);
    redirect("/");
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="login-page">
      <h1 className="login-title">
        POS <span>System</span>
      </h1>

      <Form method="post" className="login-form">
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            id="username"
            name="username"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="form-input"
          />
        </div>

        <button type="submit" className="btn login-btn" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Log In"}
        </button>
      </Form>
    </div>
  );
};

export default Login;
