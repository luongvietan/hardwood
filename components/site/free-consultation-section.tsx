"use client";

import type { FormEvent } from "react";

export function FreeConsultationSection() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const inputClass =
    "w-full min-w-0 border border-gray-300 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400";

  return (
    <section className="w-full min-w-0 bg-white py-14 lg:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl font-bold text-black sm:text-2xl">Free Consultation Request</h2>

        <form onSubmit={handleSubmit} className="mt-10 flex w-full min-w-0 flex-col gap-3 sm:gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <input
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              placeholder="*First name:"
              className={inputClass}
              aria-label="First name (required)"
            />
            <input
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name:"
              className={inputClass}
              aria-label="Last name"
            />
          </div>

          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="*Email:"
            className={inputClass}
            aria-label="Email (required)"
          />

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-4">
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="*Phone:"
              className={`${inputClass} sm:max-w-[220px] sm:shrink-0 lg:max-w-[240px]`}
              aria-label="Phone (required)"
            />
            <input
              name="address"
              type="text"
              required
              autoComplete="street-address"
              placeholder="*Address:"
              className={`${inputClass} min-w-0 flex-1`}
              aria-label="Address (required)"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <input
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="*City:"
              className={inputClass}
              aria-label="City (required)"
            />
            <input
              name="province"
              type="text"
              autoComplete="address-level1"
              placeholder="Province:"
              className={inputClass}
              aria-label="Province"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <input
              name="preferredDate"
              type="text"
              required
              placeholder="*Preferred date:"
              className={inputClass}
              aria-label="Preferred date (required)"
            />
            <input
              name="preferredTime"
              type="text"
              required
              placeholder="*Preferred time:"
              className={inputClass}
              aria-label="Preferred time (required)"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <input
              name="buildingType"
              type="text"
              required
              placeholder="*Building Type:"
              className={inputClass}
              aria-label="Building type (required)"
            />
            <input
              name="flooringType"
              type="text"
              required
              placeholder="*Flooring type:"
              className={inputClass}
              aria-label="Flooring type (required)"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="min-w-[140px] rounded-md bg-[#8B7E6C] px-10 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
