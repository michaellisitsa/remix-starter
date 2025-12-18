import { Await, Form } from "react-router";
import type { Route } from "./+types/home";
import { Suspense } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cart" },
    { name: "description", content: "This is a cart" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const product1 = fetch("https://jsonplaceholder.typicode.com/todos/1");
  const product2 = fetch("https://jsonplaceholder.typicode.com/todos/2");
  return { product1, product2 };
}
export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  // Construct an object using `Object.fromEntries`

  const message = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({ hello: "hi" }),
  });
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}
export default function Cart({ loaderData, actionData }: Route.ComponentProps) {
  const data = loaderData;
  console.log("Log → loader.tsx 31: data", data);

  return (
    <main>
      My form
      <Suspense fallback={null}>
        <Await resolve={Promise.all([data.product1, data.product2])}>
          {async (resp) => {
            console.log("Log → loader.tsx 40: resp", resp.title);
            return <div>{resp.title}</div>;
          }}
        </Await>
      </Suspense>
      <Form method="POST">
        <label htmlFor="text">enter value</label>
        <input type="text" name="name" />
      </Form>
    </main>
  );
}
