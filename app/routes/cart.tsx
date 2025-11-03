import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

import { Form } from "react-router";
import type { FunctionComponent } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cart" },
    { name: "description", content: "This is a cart" },
  ];
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
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Submit</button>
      </Form>
      {actionData ? <p>{actionData.title} updated</p> : null}
    </main>
  );
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({ username: "example" }),
  });
  console.log("Log → cart.tsx 119: response", response);
}
