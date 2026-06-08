import { useFormik }   from "formik";
import Joi             from "joi";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState }    from "react";
import toast           from "react-hot-toast";
import { authApi }     from "../../api/auth.api";
import logo            from "../../assets/logo/bella.png";
import bgPattern       from "../../assets/logo/logo-bg.png";

const schema = Joi.object({
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required.",
    "string.min":   "Password must be at least 8 characters.",
    "string.empty": "Password is required.",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only":     "Passwords do not match.",
      "any.required": "Please confirm your password.",
    }),
});

export default function ResetPasswordPage() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => authApi.resetPassword(token, data),
    onSuccess:  () => {
      toast.success("Password reset! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (e) => toast.error(e.message || "Invalid or expired link."),
  });

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validate: (values) => {
      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return {};
      return error.details.reduce((acc, d) => ({ ...acc, [d.path[0]]: d.message }), {});
    },
    onSubmit: ({ password, confirmPassword }) => mutate({ password, confirmPassword }),
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7fafc]
                    flex items-center justify-center px-4">

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.8]"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "450px",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60
                      via-white/5 to-black/70" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl
                      border border-white/40 bg-white/80 backdrop-blur-xl
                      shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 md:p-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img src={logo} alt="Bella Smile" className="h-16 mb-4 drop-shadow-sm" />
          </Link>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {isSuccess ? "All done!" : "Set your new password"}
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex
                            items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Password Reset!</h2>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {[
              { name: "password",        label: "New Password",     show: showPw,  setShow: setShowPw  },
              { name: "confirmPassword", label: "Confirm Password", show: showCpw, setShow: setShowCpw },
            ].map(({ name, label, show, setShow }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    name={name}
                    placeholder="••••••••"
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-2xl border px-4 py-3.5 text-gray-800
                                placeholder-gray-400 bg-white/70 backdrop-blur-sm
                                transition-all duration-200 focus:outline-none focus:ring-4
                                pr-12
                                ${formik.touched[name] && formik.errors[name]
                                  ? "border-red-400 focus:ring-red-100"
                                  : "border-gray-200 focus:ring-[#66BBEE]/20 focus:border-[#66BBEE]"
                                }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formik.touched[name] && formik.errors[name] && (
                  <p className="text-red-500 text-xs mt-2">{formik.errors[name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-2xl bg-[#66BBEE] hover:bg-[#4da9df]
                         text-white font-semibold shadow-lg shadow-[#66BBEE]/30
                         transition-all duration-200 active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>

            <Link to="/login"
                  className="block text-center text-sm text-gray-500
                             hover:text-gray-700 transition">
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}