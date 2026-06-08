import { useFormik }   from "formik";
import Joi             from "joi";
import { useMutation } from "@tanstack/react-query";
import { Link }        from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import toast           from "react-hot-toast";
import { authApi }     from "../../api/auth.api";
import logo            from "../../assets/logo/bella.png";
import bgPattern       from "../../assets/logo/logo-bg.png";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "any.required": "Email is required.",
      "string.email": "Please enter a valid email.",
      "string.empty": "Email is required.",
    }),
});

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => authApi.forgotPassword(data),
    onError:    (e)    => toast.error(e.message || "Something went wrong."),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return {};
      return error.details.reduce((acc, d) => ({ ...acc, [d.path[0]]: d.message }), {});
    },
    onSubmit: (values) => mutate(values),
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
            {isSuccess ? "Check your inbox" : "Reset your password"}
          </p>
        </div>

        {isSuccess ? (
          /* Success */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex
                            items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Email Sent!</h2>
            <p className="text-sm text-gray-500">
              If this email exists, a reset link has been sent.
              Check your inbox and spam folder.
            </p>
            <p className="text-xs text-gray-400">The link expires in 15 minutes.</p>
            <Link to="/login"
                  className="block text-[#66BBEE] hover:underline text-sm font-medium">
              Back to Login
            </Link>
          </div>
        ) : (
          /* Form */
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-2xl border px-4 py-3.5 text-gray-800
                            placeholder-gray-400 bg-white/70 backdrop-blur-sm
                            transition-all duration-200 focus:outline-none focus:ring-4
                            ${formik.touched.email && formik.errors.email
                              ? "border-red-400 focus:ring-red-100"
                              : "border-gray-200 focus:ring-[#66BBEE]/20 focus:border-[#66BBEE]"
                            }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-2">{formik.errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-2xl bg-mainColor hover:bg-mainColor/80
                         text-white font-semibold shadow-lg shadow-mainColor/30
                         transition-all duration-200 active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>

            <Link to="/login"
                  className="flex items-center justify-center gap-1.5 text-sm
                             text-gray-500 hover:text-gray-700 transition">
              <ArrowLeft size={15} />
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}