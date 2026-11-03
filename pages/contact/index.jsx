import { useState } from "react";
//components
import { useRouter } from "next/router";

import { BsArrowRight } from "react-icons/bs";

import { motion } from "framer-motion";

import PageTitle from "../../components/PageTitle";
import { fadeIn } from "../../variants";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUEST_TIMEOUT_MS = 15_000;

function validateForm(values) {
  if (values.name.trim().length === 0) return "Please enter your name.";
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    return "Please enter a valid email address.";
  }
  if (values.subject.trim().length === 0) return "Please enter a subject.";
  if (values.message.trim().length === 0) return "Please enter a message.";
  return "";
}

const Contact = () => {
  const lets = `Let's`;
  const router = useRouter();
  const [values, setValues] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const serviceId =
    typeof router.query.id === "string" ? router.query.id : undefined;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // One user action may start at most one request.
    if (status === "submitting") return;

    const validationError = validateForm(values);
    if (validationError) {
      setErrorMessage(validationError);
      setStatus("error");
      return;
    }

    setErrorMessage("");
    setStatus("submitting");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          id: serviceId || -1,
        }),
        signal: controller.signal,
      });

      if (response.ok) {
        setValues(EMPTY_FORM);
        setStatus("success");
        return;
      }

      if (response.status === 429) {
        setErrorMessage(
          "Too many requests. Please wait a moment and try again.",
        );
      } else if (response.status === 400 || response.status === 413) {
        setErrorMessage(
          "Please check the form fields and try again with a shorter message.",
        );
      } else {
        setErrorMessage(
          "Your message could not be sent right now. Please try again later.",
        );
      }
      setStatus("error");
    } catch (error) {
      setErrorMessage(
        error?.name === "AbortError"
          ? "The request timed out. Please try again."
          : "Your message could not be sent right now. Please try again later.",
      );
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <div className="h-full bg-primary/30">
      <PageTitle
        title="Contact | Tanmay Patil"
        description="Send a project enquiry to Tanmay Patil."
      />
      <div className="container flex items-center justify-center h-full py-32 mx-auto text-center xl:text-left">
        {/* text&form */}
        <div className="flex flex-col w-full max-w-[700px] ">
          {/* text */}
          <motion.h2
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="mb-12 text-center h2"
          >
            {lets} <span className="text-accent">Connect.</span>{" "}
          </motion.h2>
          {/* form */}
          <motion.form
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col flex-1 w-full gap-6 mx-auto "
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
          >
            <div className="flex w-full gap-x-6">
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="name"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                value={values.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input"
              />
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                required
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input normal-case"
              />
            </div>
            <label htmlFor="contact-subject" className="sr-only">
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              placeholder="subject"
              name="subject"
              maxLength={150}
              required
              value={values.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              className="input"
            />
            <label htmlFor="contact-message" className="sr-only">
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="message"
              name="message"
              maxLength={5000}
              required
              value={values.message}
              onChange={handleChange}
              disabled={isSubmitting}
              className="textarea"
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn rounded-full border border-white/50 max-w-[170px]
            px-8 transition-all duration-300 flex items-center
            justify-center overflow-hidden
            hover:border-accent group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500">
                {isSubmitting ? "Sending..." : `${lets} talk`}
              </span>
              <BsArrowRight
                aria-hidden="true"
                className="group-hover:-translate-y-0 -translate-y-[120%] group-hover:opacity-100 group-hover:flex opacity-0 transition-all duration-300 absolute text-[22px]"
              />
            </button>
            <div role="status" aria-live="polite" className="min-h-[24px]">
              {status === "success" && (
                <p className="text-accent">
                  Message sent successfully. Thank you!
                </p>
              )}
            </div>
            {status === "error" && (
              <p role="alert" className="text-red-300">
                {errorMessage}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
