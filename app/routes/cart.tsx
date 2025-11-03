import type { Route } from "./+types/home";
import { Form, redirect } from "react-router";

import { z } from "zod";

const schema = z.object({
  // The preprocess step is required for zod to perform the required check properly
  // as the value of an empty input is usually an empty string
  email: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string({ required_error: "Email is required" }).email("Email is invalid"),
  ),
  message: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string({ required_error: "Message is required" })
      .min(2, "Message is too short")
      .max(100, "Message is too long"),
  ),
});

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cart" },
    { name: "description", content: "This is a cart" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  // Construct an object using `Object.fromEntries`
  const payload = Object.fromEntries(formData);
  // Then parse it with zod
  const result = schema.safeParse(payload);
  // Return the error to the client if the data is not valid
  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  const message = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(result.data),
  });
  const response = await message.json();
  console.log("Log → cart.tsx 45: message", response);

  if (!message.ok) {
    return {
      payload,
      formErrors: ["Failed to send the message. Please try again later."],
      fieldErrors: {},
    };
  }

  return {
    payload,
    ...response,
  };
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const products = Promise.all([
    fetch("https://jsonplaceholder.typicode.com/todos/1").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/todos/2").then((r) => r.json()),
  ]);
  return products;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}
export default function Cart({ loaderData, actionData }: Route.ComponentProps) {
  const data = loaderData;
  data?.forEach((item) => {
    const { id, title, userId, completed } = item;
    console.log("Log → cart.tsx 39: title", title);
  });

  return (
    <main>
      <h1>Submit Form</h1>
      <Form method="POST">
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            defaultValue={actionData?.payload.email}
          />
          <div>{actionData?.fieldErrors?.email}</div>
        </div>
        <div>
          <label>Message</label>
          <textarea name="message" defaultValue={actionData?.payload.message} />
          <div>{actionData?.fieldErrors?.message}</div>
        </div>
        <button>Send</button>
        <br />
        <b>Created id: {actionData?.id}</b>
      </Form>
    </main>
  );
}
