import { useEffect, useState } from "react";
//components
import { useRouter } from "next/router";

import { BsArrowRight } from "react-icons/bs";

import { motion } from "framer-motion";

import { fadeIn } from "../../variants";

const Contact = () => {
  const lets = `Let's`;
  const router = useRouter();
  const [isSent, setisSent] = useState(false);
  const [hasQueryParams, sethasQueryParams] = useState(
    Object.keys(router.query).length > 0
  );

  useEffect(() => {
    const sendEmail = async () => {
      sethasQueryParams(Object.keys(router.query).length > 0);

      if (isSent) return;
      const form = document.querySelector("form");

      // add an event listener to the form to handle form submission
      form.addEventListener("submit", async (event) => {
        // prevent the default form submission behavior
        event.preventDefault();
        const formData = new FormData(form);
        const name = formData.get("name");
        const email = formData.get("email");
        const subject = formData.get("subject");
        const message = formData.get("message");
        if (hasQueryParams) {
          const { id } = router.query;

          console.log(`id : ${id}`);
          const response = await fetch("/api/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              subject,
              message,
              id,
            }),
          });
          if (response.ok) {
            // show a success message
            router.push("/");
            alert("Message sent successfully!");
            setisSent(false);
          }

          return;
        } else {
          const id = -1;

          const response = await fetch("/api/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              subject,
              message,
              id,
            }),
          });

          // handle the response from the server-side script
          if (response.ok) {
            // show a success message
            router.push("/");
            alert("Message sent successfully!");
            setisSent(false);
          }

          return;
        }
      });
    };

    if (isSent) return;

    sendEmail();
  });
  return (
    <div className="h-full bg-primary/30">
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
            action=""
            className="flex flex-col flex-1 w-full gap-6 mx-auto "
          >
            <div className="flex w-full gap-x-6">
              <input
                type="text"
                placeholder="name"
                name="name"
                className="input"
              />
              <input
                type="text"
                placeholder="email"
                name="email"
                className="input"
              />
            </div>
            <input
              type="text"
              placeholder="subject"
              name="subject"
              className="input"
            />
            <textarea
              placeholder="message"
              name="message"
              className="textarea"
            ></textarea>
            <button
              type="submit"
              onClick={() => setisSent(true)}
              className="btn rounded-full border border-white/50 max-w-[170px] 
            px-8 transition-all duration-300 flex items-center 
            justify-center overflow-hidden 
            hover:border-accent group"
            >
              <span className="group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500">
                {lets} talk
              </span>
              <BsArrowRight className="group-hover:-translate-y-0 -translate-y-[120%] group-hover:opacity-100 group-hover:flex opacity-0 transition-all duration-300 absolute text-[22px]" />
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
