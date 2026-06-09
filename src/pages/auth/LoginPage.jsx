import { useFormik } from "formik";
import Joi from "joi";
import { useLogin } from "../../hooks/auth/useLogin";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo/bella.png";
import bgPattern from "../../assets/logo/logo-bg.png";
import { Link } from "react-router-dom";
import { useState } from "react";

// ── Validation Schema ─────────────────────────────────────────
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters.",
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
    }),
});

// ── Joi → Formik validate adapter ────────────────────────────
const validate = (values) => {
  const { error } = loginSchema.validate(values, {
    abortEarly: false,
  });

  if (!error) return {};

  return error.details.reduce((acc, curr) => {
    acc[curr.path[0]] = curr.message;
    return acc;
  }, {});
};

// ── Component ─────────────────────────────────────────────────
export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [showPw, setShowPw] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validate,

    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7fafc] flex items-center justify-center px-4">

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.8]"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "450px",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50" />
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#66BBEE]/40 via-white/10 to-[#1a6fa8]/50" /> */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-white/5 to-black/70" /> */}
      {/* Login Card */}
      <div
        className="
          relative z-10
          w-full max-w-md
          rounded-3xl
          border border-white/40
          bg-white/80
          backdrop-blur-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          p-8 md:p-10
        "
      >

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img
              src={logo}
              alt="Bella Smile"
              className="h-16 mb-4 drop-shadow-sm"
            />
          </Link>

          <p className="text-gray-500 text-sm mt-2 text-center">
            Sign in to continue to {" "}
            <Link to="/">
            <span className="text-darkColor/55">Bella Smile Home</span>
          </Link>
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="admin@bellasmile.com"
              className={`
                w-full rounded-2xl border px-4 py-3.5
                text-gray-800 placeholder-gray-400
                bg-white/70
                backdrop-blur-sm
                transition-all duration-200
                focus:outline-none focus:ring-4

                ${formik.touched.email && formik.errors.email
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:ring-[#66BBEE]/20 focus:border-[#66BBEE]"
                }
              `}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-2">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={`
        w-full rounded-2xl border px-4 py-3.5 pr-12
        text-gray-800 placeholder-gray-400
        bg-white/70 backdrop-blur-sm
        transition-all duration-200
        focus:outline-none focus:ring-4
        ${formik.touched.password && formik.errors.password
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:ring-[#66BBEE]/20 focus:border-[#66BBEE]"
                  }
      `}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                 text-gray-400 hover:text-gray-600 transition"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">

            {/* <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300"
              />

              Remember me
            </label> */}

            
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-mainColor hover:text-mainColor/80
               hover:underline transition"
              >
                Forgot your password?
              </Link>
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isPending ||
              !formik.isValid ||
              !formik.dirty
            }
            className="
              w-full py-3.5 rounded-2xl
              bg-mainColor
              hover:bg-mainColor
              text-white font-semibold
              shadow-lg shadow-mainColor/30
              transition-all duration-200
              active:scale-[0.98]
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}
