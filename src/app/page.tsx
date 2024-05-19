"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { parseDate } from "@internationalized/date";
import { Calendar } from "@nextui-org/calendar";

export default function Home() {
  const currentDate = new Date();
  return (
    <main className="flex justify-center items-center h-screen">
      <section className="flex flex-col space-y-2">
        <span className="flex justify-center font-bold text-2xl">
          Hello World
        </span>
        <span className="flex justify-center text-xl">
          Situs Aran8276 (Zahran SMKN6 Malang)
        </span>
        <Button color="primary" className="font-bold text-white">
          Tombol Fidget
        </Button>
        <Input label="Label Teks Disini" />
        <Calendar
          color="danger"
          aria-label="Date (Uncontrolled)"
          defaultValue={parseDate(currentDate.toISOString().split("T")[0])}
        />
      </section>
    </main>
  );
}
