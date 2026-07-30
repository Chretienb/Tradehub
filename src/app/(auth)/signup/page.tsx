import { Suspense } from "react";
import { getCategories } from "@/lib/data/catalog";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const categories = await getCategories();

  return (
    <Suspense>
      <SignupForm categories={categories} />
    </Suspense>
  );
}
