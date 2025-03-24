"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Form {
  example: string;
}

export default function Input() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = (data) => console.log(data);

  useEffect(() => {
    console.log(watch("example"));
  }, [watch("example")]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("example")} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
