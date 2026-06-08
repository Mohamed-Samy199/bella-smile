import { motion }            from "framer-motion";
import { useFormik }         from "formik";
import Joi                   from "joi";
import { useMutation }       from "@tanstack/react-query";
import { Sparkles, Send, User, Mail, MessageSquare } from "lucide-react";
import PhoneInput            from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast                 from "react-hot-toast";

import bellaLogo from "../../../assets/logo/bella.png";
import doctor    from "../../../assets/mission/doctor.webp";
import client    from "../../../api/client";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const sendContactMessage = (data) => client.post("/contact", data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Validation Schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const schema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "any.required": "First name is required.",
    "string.empty": "First name is required.",
    "string.min":   "At least 2 characters.",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "any.required": "Last name is required.",
    "string.empty": "Last name is required.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "any.required": "Email is required.",
      "string.email": "Please enter a valid email.",
      "string.empty": "Email is required.",
    }),
  phone: Joi.string().min(7).required().messages({
    "any.required": "Phone number is required.",
    "string.empty": "Phone number is required.",
    "string.min":   "Please enter a valid phone number.",
  }),
  message: Joi.string().min(10).max(2000).required().messages({
    "any.required": "Message is required.",
    "string.empty": "Message is required.",
    "string.min":   "Message must be at least 10 characters.",
  }),
});

const validate = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => {
    acc[d.path[0]] = d.message;
    return acc;
  }, {});
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Field Component — عشان مش نكرر
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FormInput = ({ icon: Icon, name, type = "text", placeholder, formik }) => {
  const hasError = formik.touched[name] && formik.errors[name];
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2
                      text-gray-400 group-focus-within:text-darkColor
                      transition-colors z-10">
        <Icon size={20} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full pl-12 pr-6 py-4 bg-gray-50/50 border-2
                    rounded-2xl focus:bg-white outline-none transition-all
                    placeholder:text-gray-400 font-medium text-darkColor
                    ${hasError
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-darkColor"
                    }`}
      />
      {hasError && (
        <p className="text-red-500 text-xs mt-1.5 px-1">
          {formik.errors[name]}
        </p>
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const AppointmentSection = () => {

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you soon 🦷");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send. Please try again.");
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName:  "",
      email:     "",
      phone:     "",
      message:   "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      sendMessage(values, {
        onSuccess: () => resetForm(),
      });
    },
  });

  const phoneError = formik.touched.phone && formik.errors.phone;
  const msgError   = formik.touched.message && formik.errors.message;

  return (
    <section
    id="contact"
      className="relative w-full min-h-screen bg-white overflow-hidden
                 flex items-center justify-center py-10 px-6 lg:px-16"
      dir="ltr"
    >
      {/* Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px]
                      bg-mainColor/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px]
                      bg-darkColor/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24
                        items-center w-full">

          {/* ── Form Side ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Title */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2
                              rounded-full bg-darkColor/5 text-darkColor
                              font-bold text-xs mb-4 border border-darkColor/10">
                <Sparkles className="w-3.5 h-3.5 text-mainColor" />
                RESERVE YOUR CONSULTATION
              </div>
              <h2 className="text-darkColor text-5xl lg:text-7xl font-black
                             tracking-tight leading-[1.1]">
                Start Your <br />
                <span className="text-mainColor">New Story</span>
              </h2>
            </div>

            {/* Form */}
            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* First Name */}
              <FormInput
                icon={User}
                name="firstName"
                placeholder="First Name"
                formik={formik}
              />

              {/* Last Name */}
              <FormInput
                icon={User}
                name="lastName"
                placeholder="Last Name"
                formik={formik}
              />

              {/* Email */}
              <FormInput
                icon={Mail}
                name="email"
                type="email"
                placeholder="Email Address"
                formik={formik}
              />

              {/* Phone */}
              <div className="relative group phone-input-container">
                <PhoneInput
                  country="eg"
                  value={formik.values.phone}
                  onChange={(value) => formik.setFieldValue("phone", value)}
                  onBlur={() => formik.setFieldTouched("phone", true)}
                  enableSearch
                  placeholder="Phone Number"
                  containerClass="!w-full"
                  inputClass={`!w-full !pl-14 !pr-6 !py-8 !bg-gray-50/50
                               !border-2 !rounded-2xl !outline-none
                               !font-medium !text-base !text-darkColor
                               ${phoneError
                                 ? "!border-red-400"
                                 : "!border-gray-200"
                               }`}
                  buttonClass="!bg-transparent !border-none !rounded-2xl !pl-4"
                  dropdownClass="!rounded-xl !shadow-2xl !border-gray-100"
                  searchClass="!bg-gray-50 !p-2 !rounded-lg"
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1.5 px-1">
                    {formik.errors.phone}
                  </p>
                )}
                <style>{`
                  .react-tel-input .form-control:focus {
                    border-color: #003366 !important;
                    background-color: white !important;
                    box-shadow: none !important;
                  }
                  .react-tel-input .flag-dropdown.open .selected-flag {
                    background: transparent !important;
                  }
                `}</style>
              </div>

              {/* Message */}
              <div className="md:col-span-2 relative group">
                <div className="absolute left-4 top-5 text-gray-400
                                group-focus-within:text-darkColor transition-colors">
                  <MessageSquare size={20} />
                </div>
                <textarea
                  name="message"
                  placeholder="Tell us about your dental goals..."
                  rows={4}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-12 pr-6 py-4 bg-gray-50/50 border-2
                              rounded-2xl focus:bg-white outline-none
                              transition-all placeholder:text-gray-400
                              font-medium resize-none text-darkColor
                              ${msgError
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-200 focus:border-darkColor"
                              }`}
                />
                {msgError && (
                  <p className="text-red-500 text-xs mt-1.5 px-1">
                    {formik.errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: isPending ? 1 : 1.01, translateY: isPending ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                className="md:col-span-2 bg-darkColor text-white py-5
                           rounded-2xl font-extrabold text-xl flex items-center
                           justify-center gap-3 shadow-2xl shadow-darkColor/30
                           hover:shadow-mainColor/20 transition-all
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Contact Us"}
                <Send className="w-5 h-5 text-mainColor" />
              </motion.button>

            </form>
          </motion.div>

          {/* ── Image Side ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:block relative h-[80vh]"
          >
            <div className="absolute -top-10 -right-10 w-64 h-64
                            opacity-[0.03] rotate-12 -z-10">
              <img src={bellaLogo} alt=""
                   className="w-full h-full object-contain" />
            </div>

            <div className="relative h-full w-full rounded-[4rem] overflow-hidden
                            border-[16px] border-white
                            shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
              <img
                src={doctor}
                alt="Bella Smile Patient"
                className="w-full h-full object-cover scale-110
                           hover:scale-100 transition-transform duration-1000"
              />

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2
                              w-[85%] bg-white/80 backdrop-blur-xl p-6
                              rounded-[2.5rem] border border-white/50 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2
                                              border-white bg-gray-200 overflow-hidden">
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="patient"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-darkColor font-extrabold text-sm
                                  uppercase tracking-tighter">
                      Certified Excellence
                    </p>
                    <p className="text-mainColor text-xs font-bold">
                      100% Digital Workflow
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;