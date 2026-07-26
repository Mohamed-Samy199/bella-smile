import { useState } from "react";
import { useFormik } from "formik";
import Joi from "joi";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../../hooks/auth/useRegister";
import logo from "../../assets/logo/bella.png";
import bgPattern from "../../assets/logo/logo-bg.png";

const schema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "any.required": "Full name is required.",
    "string.empty": "Full name is required.",
    "string.min": "Name must be at least 2 characters.",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email.",
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
  }),
  firstName: Joi.string().min(2).required().messages({
    "any.required": "First name is required.",
    "string.empty": "First name is required.",
  }),
  lastName: Joi.string().min(2).required().messages({
    "any.required": "Last name is required.",
    "string.empty": "Last name is required.",
  }),
  phone: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  agency: Joi.string().optional().allow(""),
});

const validate = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce(
    (acc, d) => ({ ...acc, [d.path[0]]: d.message }), {}
  );
};

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  const [showPw, setShowPw] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "", email: "", password: "",
      firstName: "", lastName: "",
      phone: "", city: "", agency: "",
    },
    validate,
    onSubmit: (values) => {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== "")
      );
      register(payload);
    },
  });

  // نفس style بتاع LoginPage
  const inputCls = (name) => `
    w-full rounded-2xl border px-4 py-3.5
    text-gray-800 placeholder-gray-400
    bg-white/70 backdrop-blur-sm
    transition-all duration-200
    focus:outline-none focus:ring-4
    ${formik.touched[name] && formik.errors[name]
      ? "border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:ring-[#66BBEE]/20 focus:border-[#66BBEE]"
    }
  `;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7fafc]
                    flex items-center justify-center px-4 py-10">

      {/* Background Pattern — نفس LoginPage */}
      <div
        className="absolute inset-0 opacity-[0.8]"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "450px",
        }}
      />

      {/* Gradient Overlay — نفس LoginPage */}
      <div className="absolute inset-0 bg-gradient-to-br
                      from-black/50 via-transparent to-black/50" />

      {/* Card — نفس LoginPage */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl
                      border border-white/40 bg-white/80
                      backdrop-blur-xl
                      shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                      p-8 md:p-10">

        {/* Logo — نفس LoginPage */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img src={logo} alt="Bella Smile"
              className="h-16 mb-4 drop-shadow-sm" />
          </Link>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Create your account and join{" "}
            <Link to="/">
              <span className="text-darkColor/55">Bella Smile</span>
            </Link>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">

          {/* ── Section: Account ─────────────────────────────── */}
          <p className="text-xs font-semibold text-gray-400 uppercase
                        tracking-widest">
            Account
          </p>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              name="name"
              placeholder="Dr. Mohamed Ali"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="doctor@clinic.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-2">{formik.errors.email}</p>
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
                placeholder="Min. 8 characters"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls("password")} pr-12`}
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
              <p className="text-red-500 text-xs mt-2">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* ── Divider ──────────────────────────────────────── */}
          <div className="border-t border-white/60 pt-5">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-widest mb-5">
              Personal Info
            </p>

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium
                                  text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  placeholder="Mohamed"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs mt-2">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium
                                  text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  placeholder="Ali"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs mt-2">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Phone + City */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium
                                  text-gray-700 mb-2">
                  Phone
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  name="phone"
                  placeholder="+20 100 000 0000"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("phone")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium
                                  text-gray-700 mb-2">
                  City
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  name="city"
                  placeholder="Cairo"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("city")}
                />
              </div>
            </div>

            {/* Clinic / Agency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic / Agency
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                name="agency"
                placeholder="Smile Dental Clinic"
                value={formik.values.agency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("agency")}
              />
            </div>
          </div>

          {/* Submit — نفس style بتاع LoginPage */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-2xl bg-mainColor
                       hover:bg-mainColor text-white font-semibold
                       shadow-lg shadow-mainColor/30 transition-all
                       duration-200 active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30
                                 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>

          {/* Login Link — نفس style بتاع LoginPage */}
          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link to="/login"
              className="text-mainColor hover:underline font-medium">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}